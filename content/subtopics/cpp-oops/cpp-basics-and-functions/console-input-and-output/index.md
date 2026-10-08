---
subtopic: Console input and output
published: 2026-10-08
summary:
  - "#include <iostream> gives you std::cout for printing, std::cin for reading, and std::cerr for errors."
  - "<< sends data out to std::cout and >> pulls data in from std::cin. The arrows point the way the data flows."
  - "End lines with '\\n'. std::endl adds a newline and also flushes the output buffer, which is slower and rarely needed."
  - ">> skips whitespace and reads one value at a time. Spaces and newlines just separate values."
  - "If input doesn't fit the variable, the read fails: the variable gets 0, cin enters a failed state, and every later read is skipped."
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-iostream-cout-cin-and-endl/
---

A program that can't talk to anyone isn't much use. The simplest way to talk is through the **console**: print text to the screen, and read what the user types. C++ does both with the **iostream** library. This page covers printing, newlines and why output is _buffered_, reading input, and exactly what happens when the user types something unexpected.

## The iostream library

Input and output live in the standard library, in the header `<iostream>`. Include it, and you get three ready-made objects:

| Object      | Direction          | Used for                                                            |
| ----------- | ------------------ | ------------------------------------------------------------------- |
| `std::cout` | Program → screen   | Normal output ("character output")                                  |
| `std::cin`  | Keyboard → program | Reading input ("character input")                                   |
| `std::cerr` | Program → screen   | Error messages. It's never buffered, so messages appear immediately |

![Data flows out through << to std::cout, and in through >> from std::cin; the arrows point the way the data moves.](diagram:io-flow)

## Printing with std::cout

The **insertion operator** `<<` sends a value to `std::cout`. You can chain as many `<<` as you like in one statement, mixing text, numbers, variables and even calculations:

```cpp title="print.cpp"
#include <iostream>

int main()
{
    int apples{5};
    std::cout << "Hello!\n";
    std::cout << "I have " << apples << " apples.\n";
    std::cout << "Double that is " << apples * 2 << ".\n";
    return 0;
}
```

```output
Hello!
I have 5 apples.
Double that is 10.
```

`std::cout` prints exactly what you give it, and nothing more. It never adds spaces or new lines by itself:

```cpp title="no-newline.cpp"
#include <iostream>

int main()
{
    std::cout << "first";
    std::cout << "second";
    std::cout << 1 << 2 << '\n';
    return 0;
}
```

```output
firstsecond12
```

## Ending lines: '\n' vs std::endl

There are two ways to move to a new line:

```cpp title="newlines.cpp"
#include <iostream>

int main()
{
    std::cout << "Line one\n";              // \n inside the text
    std::cout << "Line two" << '\n';        // \n on its own
    std::cout << "Line three" << std::endl; // std::endl
    return 0;
}
```

```output
Line one
Line two
Line three
```

All three print a line break. The difference is what `std::endl` does _as well_, and that comes down to **buffering**.

### Output is buffered

Sending text to the screen is slow compared with everything else a program does. So `std::cout` doesn't send each piece the moment you write it. It collects output in a block of memory called a **buffer**, and sends the whole batch at once. Sending the buffer's contents on is called **flushing**. The buffer gets flushed when it's full, when the program ends normally, when the program is about to read from `std::cin`, or when you ask for it.

![std::cout collects output in a buffer and sends it to the screen in batches; std::endl forces a send every line.](diagram:output-buffer)

`'\n'` just adds a newline character to the buffer. `std::endl` adds a newline **and flushes** straight away. Flushing after every line throws away the whole point of the buffer, and in a program that prints a lot it can be dramatically slower.

**So use `'\n'` by default.** Flush on purpose only when it matters, for example to make sure a progress message appears before a long calculation starts. Then use `std::flush`, or `std::endl` on that one line.

> [!NOTE]
> You don't need `std::endl` before reading input. `std::cin` automatically flushes `std::cout` before it waits for the user, so a prompt like `"Enter your age: "` always appears in time. Also, `'\n'` (single quotes, one character) and `"\n"` (double quotes, a one-character string) print the same thing. Use whichever reads better.

## Reading with std::cin

The **extraction operator** `>>` takes a value from the input and stores it in a variable:

```cpp title="age.cpp"
#include <iostream>

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;
    std::cout << "Next year you'll be " << age + 1 << ".\n";
    return 0;
}
```

```output title="terminal"
Enter your age: 20
Next year you'll be 21.
```

The program stops at `std::cin >> age;` and waits until the user types something and presses **Enter**. Notice that `age` is initialized with `{}` even though its value is about to be read. Always give a variable a value before reading into it, because a failed read can leave it untouched (more below).

### Reading several values

Chain `>>` to read several values in one statement:

```cpp title="area.cpp"
#include <iostream>

int main()
{
    std::cout << "Enter width and height: ";
    int width{};
    int height{};
    std::cin >> width >> height;
    std::cout << "Area: " << width * height << '\n';
    return 0;
}
```

```output title="terminal"
Enter width and height: 3 4
Area: 12
```

`>>` skips any **whitespace** (spaces, tabs and newlines) before a value, then reads characters until the value ends. So `3 4`, `3     4`, and `3` on one line with `4` on the next all work the same way.

## When the input doesn't match

`std::cin` doesn't read straight from the keyboard. Whatever the user types, up to and including the Enter key, goes into an **input buffer**, and each `>>` takes what it needs from the front of it. Whatever it doesn't need **stays in the buffer** for the next read. That explains everything below. Here's a program that reads two `int`s:

```cpp title="two-ints.cpp"
#include <iostream>

int main()
{
    int a{};
    int b{};
    std::cout << "Enter two numbers: ";
    std::cin >> a >> b;
    std::cout << "a = " << a << ", b = " << b << '\n';
    return 0;
}
```

And what it does with different input, as tested on GCC:

| User types | Result          | Why                                                                                            |
| ---------- | --------------- | ---------------------------------------------------------------------------------------------- |
| `7 8`      | `a = 7, b = 8`  | Both values fit                                                                                |
| `7 8 9`    | `a = 7, b = 8`  | The `9` stays in the buffer, unread                                                            |
| `7.5 8`    | `a = 7, b = 0`  | `a` takes `7` and stops at the `.`. Then `b` tries to read `.5`, can't, and the read **fails** |
| `12abc`    | `a = 12, b = 0` | Same idea: `b` can't read `abc`                                                                |
| `abc 8`    | `a = 0, b = 0`  | The very first read fails                                                                      |

![For input "7.5 8": the first >> stops at the dot, the second can't read ".5", and the rest is left in the buffer.](diagram:input-buffer)

When a read fails, two things happen:

1. The variable is set to **`0`** (this has been the rule since C++11).
2. `std::cin` goes into a **failed state**, and from then on it **ignores every read** until you reset it. Those later reads don't touch their variables at all.

You can see the second rule if you start `b` at `99` instead of `0`: typing `abc` gives `a = 0, b = 99`. The failed read set `a` to 0, and the read into `b` never happened. That's another reason to initialize variables before reading into them. Otherwise a skipped read leaves a garbage value behind.

Detecting a failed read and recovering from it is covered in **Handling invalid input from std::cin**.

> [!TIP]
> `>>` reads a **single word** when reading text: it stops at the first space. To read a whole line, such as a full name, use `std::getline`, covered in **std::string basics**.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **`std::endl` vs `'\n'`: what's the difference, and which should you use?** `endl` also flushes, which costs time, so prefer `'\n'`.
> - **What is output buffering, and when does the buffer get flushed?**
> - **What does `std::cin >> x` do with spaces and newlines?** It skips leading whitespace and stops at the next one.
> - **What happens when you type letters into `std::cin >> number`?** The number becomes 0, cin fails, and later reads are skipped.
> - **Why is `std::cerr` not buffered?** So error messages appear even if the program crashes straight afterwards.
