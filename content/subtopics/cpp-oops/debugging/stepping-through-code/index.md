---
subtopic: Stepping through code
published: 2026-10-19
summary:
  - A debugger runs your program under its control, so you can pause it and look inside without changing any code.
  - Use a Debug build (-g -O0). With optimization on, the compiler merges, moves and removes code, and stepping stops matching your source.
  - The highlighted line is the one that runs next. It hasn't run yet.
  - Step over runs the current line, including any function it calls, and pauses on the next line.
  - Step into pauses at the first line inside a function the current line calls. Step out runs the rest of the current function and pauses back in the caller.
sources:
  - https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-stepping/
  - https://wiki.codeblocks.org/index.php/Keyboard_Shortcuts
  - https://www.jetbrains.com/help/clion/running-and-debugging-shortcuts.html
  - https://learn.microsoft.com/en-us/visualstudio/debugger/just-my-code
---

With print debugging, you guess where the problem might be, add output there, rebuild, run, and read. If the guess was wrong, you do it all again. A **debugger** turns that around. It runs your program under its control, so you can pause it at any point and look at what's going on, without adding a single line of code.

While the program is paused, you can see its **state**: which line it's about to run, the value of every variable, and which functions called which to get there. The next few pages cover each of those. This one is about the most basic skill, moving through the program one line at a time, which is called **stepping**.

Each of the setups from **Setting up the compiler** can debug, and so can the terminal, with gdb and lldb. They all have the same basic commands. Only the menus and keys differ, and there's a table of those at the end.

## First, a Debug build

The debugger needs your program built in the Debug configuration, or with `-g -O0` on the command line (see **Setting up the compiler**). `-g` adds **debug information**: notes that map each piece of machine code back to a line of your source and each memory location back to a variable name. Without it, the debugger can show you machine instructions but not your code.

`-O0` matters just as much. An optimizing compiler is allowed to rearrange your program completely as long as the result is the same, and it does. For the program used below, GCC at `-O2` works out the whole score calculation while compiling, so `main` just calls `printScore(250)`. The call to `bonusFor` is gone, so there's nothing to step into. Clang goes further and folds `printScore` into `main` too. In an optimized build, the debugger jumps around between lines, skips some entirely, and shows some variables as "optimized out".

## Starting a debugging session

This page uses one small program, which works out a score with a bonus and prints it:

```cpp title="score.cpp"
#include <iostream>

int bonusFor(int level)
{
    int bonus{level * 50};
    return bonus;
}

void printScore(int score)
{
    std::cout << "Score: " << score << '\n';
}

int main()
{
    int score{100};
    score += bonusFor(3);
    printScore(score);
    return 0;
}
```

Each tool starts a debugging session a little differently. The goal is the same in each: start the program and have it pause on the first line of `main`.

- In Visual Studio, press <kbd>F11</kbd> (_Debug → Step Into_). It builds, starts the program and pauses at the opening brace of `main`. <kbd>F5</kbd> (_Start Debugging_) also starts it, but doesn't pause unless there's a breakpoint.
- VS Code needs a small config file first. Open `score.cpp`, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> (<kbd>⌘</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> on a Mac), run _C/C++: Add Debug Configuration_ and pick _C/C++: g++ build and debug active file_ (_clang++_ on a Mac). In the `launch.json` it creates, set `"stopAtEntry": true`. Then press <kbd>F5</kbd>.
- In CLion, click in the gutter to the left of the first line of `main`. A red dot appears. Then press the bug icon next to Run. CLion runs until it reaches the red dot and pauses there.
- In Code::Blocks, put the cursor on the first line of `main`, press <kbd>F5</kbd> for the same red dot, then <kbd>F8</kbd> (_Debug → Start / Continue_). Its debugger, gdb, can get confused by spaces or non-English characters in the project's folder path, so keep projects somewhere simple.

The red dot is a **breakpoint**, and the next page, **Breakpoints and run-to-cursor**, is all about them. For now it's just a way of saying "pause here".

From a terminal, gdb's `start` command does the same job in one go. In lldb, you set the pause point yourself and then run:

```bash title="terminal"
g++ -std=c++20 -g -O0 score.cpp -o score
gdb ./score     # then type: start
lldb ./score    # or, in lldb: b main, then run
```

**Debugging with gdb and lldb** covers working this way properly.

> [!NOTE]
> The first time you debug on a Mac, macOS may ask for your password before it lets the debugger control your program. That's expected. It's a security check, not an error.

## The highlighted line hasn't run yet

Once the program is paused, the IDE marks one line, usually with a yellow arrow or a highlighted background. gdb and lldb print it in the terminal. This is the line that will run _next_. That trips up a lot of people at first: the marked line has not run yet.

So if the marker is on `int score{100};` and you look at `score`, you won't see 100 yet. You'll see whatever was left in that memory, because the line that sets it hasn't run.

## Step over, step into, step out

Start a session on `score.cpp` as described above. The program pauses in `main`, at line 16, `int score{100};`. (Visual Studio pauses one step earlier, on the opening brace of `main`.)

### Step over

**Step over** runs the current line and pauses at the next one. Press it once. Line 16 runs, `score` is now 100, and the marker moves to line 17.

Line 17 calls `bonusFor`. If you step over it, `bonusFor` still runs, all of it, but you don't watch it happen. The debugger pauses on line 18, with `score` already at 250.

### Step into

Go back to the moment the marker is on line 17. This time use **step into**. When the current line calls one of your functions, step into goes inside that function and pauses at its first line. The marker jumps to line 5, inside `bonusFor`, where `level` is 3. (Visual Studio stops on the function's opening brace, line 4, first, so it takes one extra step over to get there.)

Step over once more and the marker moves to line 6, `return bonus;`, with `bonus` now 150.

### Step out

You've seen what you wanted in `bonusFor`. **Step out** runs the rest of the current function and pauses back in the code that called it. Press it, and you're back in `main`.

Notice where you land: on line 17 again, not line 18. That line isn't finished. `bonusFor` has returned 150, but adding it to `score` is still to come. Many debuggers show you the returned value at this point, which is handy. Step over, and line 17 completes and the marker moves to line 18.

![From line 17, step over pauses on line 18, and step into pauses inside bonusFor. Step out returns to line 17, which still has work to do.](diagram:step-commands)

### Running to the end

On line 18, step over runs all of `printScore`, and `Score: 250` appears in the program's output. The marker moves to line 19.

When you've seen enough, use **continue**. The program runs freely until it reaches a breakpoint or ends. Here there are no more breakpoints, so it finishes. Some debuggers end the session by themselves when the program ends. Others leave it open, and you use _Stop_. You can also stop at any moment while paused.

![A debugging session: paused, you step one line at a time or continue; running, the program goes until a breakpoint or the end.](diagram:session-states)

## Stepping into code that isn't yours

Line 11 uses `std::cout <<`, and `<<` is a function call too, into the standard library. Step into it, and depending on the debugger, you may end up in the library's own source: a strange file, with names full of underscores. Nothing is broken. Step out to get back to your code.

Debuggers try to save you from this by default. lldb is set up to skip functions in `std::`. Visual Studio has a setting called **Just My Code**, on by default, that steps over code that isn't part of your project. gdb steps into a function only if it has debug information for it, which standard library code usually doesn't. It still happens sometimes, especially with templates, so it's good to know what you're looking at when it does.

## Which one to use

Step over is the one you'll press most. Use it to move through code you trust, or code that isn't yours.

Use step into when the line calls a function the bug might be in. If you're not sure, step over first, and check whether the values coming out of the call are right. If they're wrong, you know to go into that function next time.

Use step out when you've seen enough of a function, or stepped into one by accident.

It's easy to press step over one too many times and go past the line you wanted. Most debuggers can only go forward. The fix is to restart the session and be more careful this time, and once there's a breakpoint at the right line, restarting gets you there in one key press. A few tools can run backward: gdb has `reverse-next` after you turn on recording with `record`, and rr, on Linux, records a whole run so you can replay it in either direction. They're worth knowing about for later.

## If output doesn't show up

You step over line 18 and `Score: 250` doesn't appear. That's buffering, which you met in **Print debugging and logging**. When the program's output goes to a real terminal window, a newline usually flushes it. Some IDE output panes aren't a terminal, and the text waits in the buffer until much later.

For a debugging session, you can make `std::cout` flush after every write by putting this at the top of `main`:

```cpp title="top of main()"
std::cout << std::unitbuf; // flush after every output, for debugging
```

It makes output slower, so take it out again afterward.

## The keys

Each tool has the same commands under a _Debug_ or _Run_ menu, and the debugger has its own toolbar with buttons for each one.

| Tool                    | Step over | Step into | Step out      | Continue   |
| ----------------------- | --------- | --------- | ------------- | ---------- |
| Visual Studio           | F10       | F11       | Shift+F11     | F5         |
| VS Code                 | F10       | F11       | Shift+F11     | F5         |
| CLion                   | F8        | F7        | Shift+F8      | F9         |
| Code::Blocks            | F7        | Shift+F7  | Ctrl+Shift+F7 | Ctrl+F7    |
| gdb and lldb (terminal) | `next`    | `step`    | `finish`      | `continue` |

A few notes on these:

- CLion's keys are for its default Windows and Linux keymap. On macOS, Continue is <kbd>⌥</kbd>+<kbd>⌘</kbd>+<kbd>R</kbd> and the step keys are the same.
- Code::Blocks calls step over _Next line_.
- On a Mac laptop the F keys may control brightness and volume. Hold <kbd>fn</kbd> to use them as F keys, or use the toolbar buttons.
- In gdb and lldb, `n`, `s` and `c` work as short forms of `next`, `step` and `continue`.

## If it comes up in an interview

You might be asked the difference between step over, step into and step out, and the clearest way to answer is with a line that calls a function. Step over runs the whole call and pauses on the next line, step into pauses inside the function, and step out finishes the current function and returns to the caller. A related question is why a debugger behaves oddly on a release build. The answer is optimization: the compiler inlines functions, reorders code and keeps values in registers, so lines and variables no longer map neatly to what you wrote. Also be ready for "what does `-g` do?". It adds debug information and nothing else. It doesn't turn optimization off, so `-g -O2` is a valid combination: an optimized build that's just harder to debug.
