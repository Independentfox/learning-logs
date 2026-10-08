---
subtopic: Compiling from the command line
published: 2026-10-08
summary:
  - An IDE's Build button just runs compiler commands for you. Knowing them lets you build anywhere, from servers to online judges to CI.
  - "g++ main.cpp -o main compiles, and ./main runs it. The ./ is needed because the current folder isn't on your PATH."
  - Several files compile together (g++ a.cpp b.cpp -o app), or separately with -c and are linked at the end, so only changed files are rebuilt.
  - Use < and > to feed a program input from a file and save its output, | to pipe one program into another, and echo $? to see main's return value.
  - "-I adds a header folder, -L and -l link a library, and -D defines a macro. MSVC's cl uses / flags for the same jobs."
sources:
  - https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html
  - https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html
  - https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/
  - https://www.learncpp.com/cpp-tutorial/programs-with-multiple-code-files/
  - https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/
---

Every IDE's **Build** button does the same thing in the end: it runs a compiler command in the background. Learning to type those commands yourself pays off quickly. You can build on a server with no screen, run your solution exactly the way an online judge does, script your builds, and understand what every IDE setting actually changes. It takes about ten commands.

## Opening a terminal

- **macOS:** open **Terminal** (the shell is `zsh`).
- **Linux:** open your distribution's terminal (usually `bash`).
- **Windows:** use the shell that matches your compiler. For GCC installed through MSYS2, open **MSYS2 UCRT64**. For Microsoft's compiler, open **Developer PowerShell for VS** from the Start menu, which is a PowerShell window with the compiler already set up.

A terminal always has a **current folder**, and commands work on files in that folder. A few commands get you around:

| What you want           | macOS / Linux / MSYS2 | Windows PowerShell |
| ----------------------- | --------------------- | ------------------ |
| Show the current folder | `pwd`                 | `pwd`              |
| List the files here     | `ls`                  | `ls` or `dir`      |
| Go into a folder        | `cd projects`         | `cd projects`      |
| Go up one level         | `cd ..`               | `cd ..`            |
| Make a folder           | `mkdir hello`         | `mkdir hello`      |
| Show a text file        | `cat input.txt`       | `cat input.txt`    |

## Is the compiler installed? (and what PATH is)

Ask the compiler for its version:

```bash title="terminal"
g++ --version
```

If you get `command not found` (or, on Windows, _"'g++' is not recognized"_), the compiler is either not installed or not on your **PATH**.

**PATH** is a list of folders. When you type a command, the shell looks through those folders in order and runs the first program with that name it finds. Installing a compiler often means adding its folder to PATH, and forgetting that step is the classic cause of "command not found".

![The shell searches PATH for a command's name; ./ skips the search and runs a file from the current folder.](diagram:path-lookup)

To see where a command comes from: `which g++` on macOS/Linux, or `Get-Command g++` in PowerShell. `echo $PATH` shows the list itself.

## Compile and run one file

Create `hello.cpp` (any editor works):

```cpp title="hello.cpp"
#include <iostream>

int main()
{
    std::cout << "Hello from the terminal!\n";
    return 0;
}
```

Then compile it, and run the result:

```output title="terminal"
$ g++ hello.cpp -o hello
$ ./hello
Hello from the terminal!
```

- `g++ hello.cpp` compiles **and** links in one go: all four build steps from **From source code to a running program**.
- `-o hello` names the output. Leave it out and you get `a.out` on macOS/Linux, or `a.exe` on Windows.
- `./hello` runs it. The `./` means _"the file called hello **in this folder**"_. The current folder isn't on PATH, so typing `hello` alone gives "command not found". In PowerShell, write `.\hello.exe`.
- `$` here is just the shell's prompt. Don't type it.

**Clang** works the same way: swap `g++` for `clang++`, and every flag on this page carries over.

### Build and run with one command

`&&` runs the second command only if the first one succeeded:

```bash title="terminal"
g++ hello.cpp -o hello && ./hello
```

If compiling fails, the old `hello` doesn't run by mistake. Press the **↑** key to bring the command back after each edit.

## Use the strict flags, without retyping them

**Setting up the compiler** gave you a strict set of flags. Typing them every time gets old fast, so give them a short name. Add this to `~/.zshrc` (macOS) or `~/.bashrc` (Linux), then open a new terminal:

```bash title="~/.zshrc or ~/.bashrc"
cxx() {
  g++ -std=c++20 -Wall -Wextra -Wconversion \
      -Wsign-conversion -Wshadow -pedantic-errors -g "$@"
}
```

Now `cxx hello.cpp -o hello` compiles with all of them. `"$@"` passes along whatever you type after `cxx`.

## Programs with several files

Real programs are spread across files. Here `main.cpp` calls a function defined in `math.cpp`:

```cpp title="math.cpp"
int add(int x, int y)
{
    return x + y;
}
```

```cpp title="main.cpp"
#include <iostream>

int add(int x, int y); // defined in math.cpp

int main()
{
    std::cout << add(2, 3) << '\n';
    return 0;
}
```

**All at once.** Pass every `.cpp` file to the compiler:

```bash title="terminal"
g++ main.cpp math.cpp -o app
```

Leave one out and you get a link error: `undefined reference to 'add(int, int)'`. Never pass the `.h` header files; `#include` already pulls them in.

**One file at a time.** `-c` means _compile, but don't link_. It turns each `.cpp` into an object file, and a final command links them:

```bash title="terminal"
g++ -c main.cpp           # → main.o
g++ -c math.cpp           # → math.o
g++ main.o math.o -o app  # link them into app
```

![With -c, each file becomes an object file; after an edit only that file is recompiled before linking again.](diagram:separate-compilation)

Why bother? If you edit only `math.cpp`, you recompile only `math.cpp` and link again, while `main.o` is reused. With hundreds of files, that turns a long rebuild into a quick one. Tracking what needs recompiling by hand gets tedious, which is exactly what **Build systems: Make and CMake** automate.

## Headers, libraries and macros from the command line

| Flag        | What it does                                                                             | Example                     |
| ----------- | ---------------------------------------------------------------------------------------- | --------------------------- |
| `-I folder` | Also search `folder` for `#include "..."` and `<...>` headers                            | `g++ -I include main.cpp`   |
| `-L folder` | Also search `folder` for libraries                                                       | `g++ main.o -L lib -lgame`  |
| `-l name`   | Link the library `libname` (`.a`, `.so`, `.dylib`, or `.lib` on Windows)                 | `-lpthread`, `-lm`          |
| `-D NAME`   | Define a macro, as if the file started with `#define NAME`                               | `-DNDEBUG`, `-DLOG_LEVEL=2` |
| `-O2`       | Optimize, for release builds and for timing                                              | `g++ -O2 main.cpp`          |
| `-v`        | Print every step g++ runs, including the real preprocessor, compiler and linker commands | `g++ -v hello.cpp`          |

> [!TIP]
> Put `-l` **after** the files that use the library: `g++ main.o -lgame`, not `g++ -lgame main.o`. The GNU linker reads left to right and only keeps what's been asked for so far, so a library listed too early gets skipped.

Libraries get their own subtopic: **Static and dynamic libraries**.

## Feeding input and capturing output

Every program starts with three **streams**: **standard input** (what it reads, from the keyboard by default), **standard output** (what it prints with `std::cout`), and **standard error** (`std::cerr`, for error messages). The shell can redirect any of them, which is how online judges test your code. Take a program that adds two numbers:

```cpp title="sum.cpp"
#include <iostream>

int main()
{
    int a = 0;
    int b = 0;
    std::cin >> a >> b;
    std::cout << a + b << '\n';
    return 0;
}
```

```output title="terminal"
$ g++ sum.cpp -o sum
$ ./sum
3 4
7
$ echo "10 20" | ./sum
30
$ ./sum < input.txt > answer.txt
$ cat answer.txt
13
```

- Typed input: `./sum` waits for you to type `3 4` and press Enter.
- `|` (a **pipe**) feeds one program's output into the next program's input. Here, `echo` hands `10 20` to `sum`.
- `< input.txt` reads standard input from a file (this one contains `5 8`), and `> answer.txt` writes standard output to a file instead of the screen. `>>` appends instead of overwriting.

![Standard input, output and error, and how <, >, 2> and | reconnect them.](diagram:streams-redirect)

> [!TIP]
> For competitive programming, keep the sample input in a file and run `./solution < input.txt` after every change. It's much faster than retyping the test case each time.

### The exit code: what main returns

The number `main` returns is handed to the shell as the program's **exit code**. By convention, `0` means success and anything else means something went wrong. `echo $?` shows the last exit code (in PowerShell it's `$LASTEXITCODE`):

```cpp title="check.cpp"
#include <iostream>

int main()
{
    int age = 0;
    std::cin >> age;
    if (age < 0)
    {
        std::cerr << "error: age can't be negative\n";
        return 1;
    }
    std::cout << "ok\n";
    return 0;
}
```

```output title="terminal"
$ g++ check.cpp -o check
$ echo 21 | ./check; echo $?
ok
0
$ echo -5 | ./check; echo $?
error: age can't be negative
1
$ echo -5 | ./check 2> errors.txt
$ cat errors.txt
error: age can't be negative
```

Scripts, build tools and `&&` all rely on exit codes: `&&` only carries on after a `0`. And `2>` redirects **standard error**, separately from standard output.

## Microsoft's compiler: cl

In **Developer PowerShell for VS**, Microsoft's compiler is `cl`. It does the same jobs with different flags:

```bash title="Developer PowerShell"
cl /std:c++20 /W4 /permissive- /EHsc hello.cpp
.\hello.exe
```

| Job                | g++ / clang++      | cl (MSVC)       |
| ------------------ | ------------------ | --------------- |
| Name the output    | `-o hello`         | `/Fe:hello.exe` |
| Language standard  | `-std=c++20`       | `/std:c++20`    |
| Warnings           | `-Wall -Wextra`    | `/W4`           |
| Extensions off     | `-pedantic-errors` | `/permissive-`  |
| Warnings as errors | `-Werror`          | `/WX`           |
| Debug info         | `-g`               | `/Zi`           |
| Optimize           | `-O2`              | `/O2`           |
| Compile only       | `-c`               | `/c`            |
| Define a macro     | `-DNAME`           | `/DNAME`        |
| Header folder      | `-I folder`        | `/I folder`     |

`/EHsc` switches on standard C++ exception handling. Always pass it, or `cl` warns as soon as you include standard headers that use exceptions.

## When it goes wrong

| Message                                         | Usually means                                    | Fix                                                                   |
| ----------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| `command not found` / `'g++' is not recognized` | The compiler isn't installed or isn't on PATH    | Install it, or add its `bin` folder to PATH, then open a new terminal |
| `hello.cpp: No such file or directory`          | You're in a different folder from the file       | `pwd` and `ls` to check, `cd` to the right folder                     |
| `hello: command not found` after compiling      | You typed `hello` instead of `./hello`           | Run it as `./hello` (`.\hello.exe` in PowerShell)                     |
| `undefined reference to 'main'`                 | No file with `main()` was passed in              | Include the file that has `main`                                      |
| `undefined reference to 'add(int, int)'`        | The `.cpp` that defines it was left out          | Add `math.cpp` (or its `.o`) to the command                           |
| Errors about a path with spaces                 | The shell split `My Projects` into two arguments | Put quotes around it: `cd "My Projects"`                              |

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What does `g++ -c` do, and why compile files separately?** It compiles without linking, producing object files, so only changed files are rebuilt.
> - **What's the default output name if you leave out `-o`?** `a.out` (or `a.exe` on Windows).
> - **Why `./program` rather than `program`?** The current folder isn't on PATH.
> - **How do you pass a macro, a header folder or a library?** `-D`, `-I`, and `-L` with `-l`, and why `-l` goes last.
> - **What do `<`, `>`, `2>` and `|` do, and what's an exit code?**
