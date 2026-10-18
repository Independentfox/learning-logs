---
subtopic: Print debugging and logging
published: 2026-10-19
summary:
  - Print debugging means adding output that shows which code ran and what values it had. It's crude, but it works everywhere.
  - Send debug output to std::cerr. It's unbuffered, so the message is already out if the program crashes on the next line.
  - std::cout output can be lost in a crash when it's going to a file or pipe, because it sits in a buffer that never gets flushed.
  - Commenting code out to see if a bug disappears is a quick way to narrow things down. Keep track of what you disabled.
  - Switch debug output on and off with a constexpr bool or an #ifdef instead of deleting it. For real programs, use a logging library.
sources:
  - https://www.learncpp.com/cpp-tutorial/basic-debugging-tactics/
  - https://www.learncpp.com/cpp-tutorial/more-debugging-tactics/
---

The oldest debugging technique there is: add a line that prints something, run the program, and see what it says. You already used it to find the discount bug in **A systematic debugging process**. Debuggers can do a lot more, and they're coming up next, but printing stays useful for your whole career. It works on any machine, in any build, on a server you can only reach through logs, and inside code where a debugger is awkward to attach. It's worth doing well.

## Three things you can do with prints

### See which code runs

Sometimes the question isn't "what's the value?" but "does this code even run?". Print a line at the top of each function you care about:

```cpp title="which-ran.cpp"
#include <iostream>

int square(int x)
{
    std::cerr << "square called with " << x << '\n';
    return x * x;
}

int main()
{
    int a{square(4)};
    int b{square(3)};
    std::cout << a + b << '\n';
    return 0;
}
```

If you expected `square` to run twice and the output shows it once, or zero times, or fifty, you've learned something before looking at any values.

### See what the values are

Print the variables that matter at the point you're unsure about. Print the name as well as the value. `x = 4` is much easier to read in a stream of output than a bare `4`. Put prints before and after a suspicious call, so you can see what went in and what came out.

The goal is the same as in the systematic process: find the first place where a value stops matching what you expect. The bug is somewhere between that point and the last place where everything was still right.

### Switch code off and see if the bug goes away

You can also go the other way: comment out a call you suspect, and run again.

- If the bug disappears, that code was probably responsible.
- If nothing changes, it probably wasn't.
- If something _else_ breaks, other code depends on what it did, and that's worth knowing too.

The danger is forgetting what you switched off. It's easy to comment out three things while hunting, fix the bug, and leave one of them disabled. Version control helps here: before you commit, look at the diff, and any leftover commented-out code stands out.

## Why std::cerr, and not std::cout

`std::cout` is **buffered**. Text you write goes into memory first, and gets sent out later (see **Console input and output**). `std::cerr` is **unbuffered**: every write goes straight out.

That difference matters most at the worst possible moment, when the program crashes. A crash like this one kills the process without flushing the buffer, so anything `std::cout` was still holding is simply lost. Here's a program that crashes when the input is `0`:

```cpp title="lost-output.cpp"
#include <iostream>

int main()
{
    int people{};
    std::cin >> people;
    std::cout << "about to divide\n";
    std::cout << 12 / people << '\n';
    return 0;
}
```

```output title="Output on Linux (Compiler Explorer), input 0, output going to a pipe"
Program terminated with signal SIGFPE (8)
```

"about to divide" never appears, even though the line that prints it ran before the crash. Change that one line to use `std::cerr`, and it shows up:

```output title="Output on Linux (Compiler Explorer), input 0, the same program using std::cerr"
about to divide
Program terminated with signal SIGFPE (8)
```

On an Apple Silicon Mac this particular program won't crash, because dividing by zero there quietly gives 0 (see **Syntax errors vs semantic errors**). Other crashes, such as writing through a null pointer, lose buffered output on a Mac in exactly the same way.

Whether you'd lose the `std::cout` line depends on where the output is going. In an interactive terminal, the output is usually flushed at each newline, so you'd probably see it. When it's going to a file or a pipe, as in `./app > log.txt` or a CI system collecting output, it's buffered in bigger chunks, and the crash takes it with it. That's exactly the situation where you most need your debug output. Use `std::cerr` for it and the question never comes up.

There's a second benefit. `std::cerr` is a separate stream from `std::cout`, so `./app > out.txt` sends the real output to the file and leaves the debug lines on your screen, instead of mixing them together.

![std::cout holds text in a buffer that a crash throws away; std::cerr sends each message out immediately.](diagram:cerr-vs-cout)

## Keep debug output, but switch it off

Adding prints, deleting them, then adding them back when the bug returns gets old quickly. Instead, leave them in and make them easy to switch off.

The simplest way is a constant you flip:

```cpp title="debug-flag.cpp"
#include <iostream>

constexpr bool debugLog{true}; // set to false to silence debug output

int square(int x)
{
    if (debugLog)
        std::cerr << "square(" << x << ")\n";
    return x * x;
}

int main()
{
    int a{square(4)};
    int b{square(3)};
    std::cout << a + b << '\n';
    return 0;
}
```

```output title="Output with debugLog set to true (stderr then stdout)"
square(4)
square(3)
25
```

Set `debugLog` to `false` and only `25` is printed. Because the condition is a constant known at compile time, GCC and Clang leave the switched-off prints out of the program entirely, even with optimization turned off. They cost nothing.

The older way, which you'll see in a lot of existing code, uses the preprocessor (see **Preprocessor, headers and header guards**):

```cpp title="debug-ifdef.cpp"
#include <iostream>

int square(int x)
{
#ifdef ENABLE_DEBUG
    std::cerr << "square(" << x << ")\n";
#endif
    return x * x;
}

int main()
{
    int a{square(4)};
    int b{square(3)};
    std::cout << a + b << '\n';
    return 0;
}
```

Built normally, the debug line isn't even compiled. Built with `g++ -DENABLE_DEBUG debug-ifdef.cpp`, it is, and the program prints `square(4)` and `square(3)` before `25`. The upside is that you can switch it from the command line or the build system without touching the code. The downsides are the `#ifdef` clutter, and that it's easy to misspell the macro in one file and silently lose that file's output.

There's a subtler catch too. Code inside a switched-off `#ifdef` isn't compiled at all, so if you rename a variable and forget the debug line, nothing complains until the day someone turns debugging on. The `constexpr bool` version is always compiled, even when it's off, so it can't quietly go stale like that.

![With #ifdef, the preprocessor decides before compiling whether the debug line is part of the program at all.](diagram:debug-switch)

## Logging, for programs that live longer

Debug prints are for a bug you're chasing right now. **Logging** is the grown-up version: messages a program writes all the time, so that when something goes wrong in production you can look back at what happened.

A log line usually has a timestamp, a **level** (how serious it is: debug, info, warning, error) and a message. You can turn the level up or down without recompiling, so normally you only see warnings and errors, and you switch debug messages on when you're investigating something. Logs usually go to a file, where they can be kept, searched and sent to whoever is fixing the problem.

C++ has a third standard output stream, `std::clog`. It goes to the same place as `std::cerr`, but unlike `cerr` it isn't set to flush after every write. You won't see it much, though. Real projects tend to use a logging library, because getting files, levels and timestamps right yourself is a project in itself. **spdlog** is a popular, fast one, and **plog** is a small header-only option. You add one as a library (see **Static and dynamic libraries**) and call something like `spdlog::info("loaded {} items", count);`.

## Where print debugging falls short

It's slow to iterate. Every new question means editing code, rebuilding and running again. It clutters both the code and the output, and every print you add is a small code change that could itself be a mistake.

Worst of all, adding output changes timing, and some bugs, especially in programs that do several things at once, vanish when you try to observe them. These are nicknamed **heisenbugs**.

That's why the next few pages are about a **debugger**, which lets you pause the program anywhere and look at everything, without changing a line of code.

## If it comes up in an interview

A good question to be ready for is why you'd print debug output to `std::cerr` rather than `std::cout`. The answer is that `cerr` is unbuffered, so the message survives a crash, while buffered `cout` output can be lost, especially when it's going to a file or a pipe. You might also be asked how you'd leave debugging code in a program without it running in production. Mention a compile-time flag or a logging library with levels. And it's worth knowing what a heisenbug is.
