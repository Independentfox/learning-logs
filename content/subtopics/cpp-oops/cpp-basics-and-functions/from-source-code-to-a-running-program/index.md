---
subtopic: From source code to a running program
published: 2026-10-08
summary:
  - Making software is a loop of planning, writing, building, testing and debugging, not a straight line.
  - Building runs four steps, preprocess, compile, assemble and link, and one g++ command does all of them.
  - The compiler turns each .cpp file into an object file on its own. The linker joins them, plus libraries, into one executable.
  - A compile error means a file breaks the language rules. A link error means a piece is missing or defined twice.
  - Build only recompiles what changed. Rebuild cleans first and compiles everything again.
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-cpp-development/
  - https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/
  - https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/
  - https://www.learncpp.com/cpp-tutorial/a-few-common-cpp-problems/
---

You type some text into a file, press a button, and a program runs. A lot happens in between, and knowing what happens is the difference between staring at an error and knowing exactly where to look. This page follows a program from the first idea all the way to the moment the operating system runs it.

## Software is a loop, not a line

Writing a program isn't _write it once, run it, done_. Real development is a cycle you go round many times:

1. **Define the problem.** What exactly should the program do? "A program that tracks my expenses" is a wish. "Read amounts and categories, then print the total per category" is a problem you can solve.
2. **Plan the solution.** Decide _how_ before you type. A few minutes with paper saves hours of rewriting.
3. **Write the code.**
4. **Build it.** Turn the code into something the computer can run.
5. **Test it.** Does it do what step 1 said, including for odd inputs?
6. **Debug it.** Find out _why_ it misbehaves, fix it, and go round again.

![Most of the work happens in the two loops: fixing build errors, and debugging behaviour that's wrong.](diagram:dev-cycle)

A good solution is usually:

- **simple:** no cleverer than it needs to be;
- **well documented:** especially wherever a choice isn't obvious;
- **modular:** built from small pieces you can reuse and test on their own;
- **graceful when things go wrong:** bad input or a missing file shouldn't crash it.

Mistakes in a program are called **bugs**. Engineers used the word long before computers existed; Thomas Edison wrote about "bugs" in his inventions in the 1870s. It stuck to computing after 1947, when operators of the Harvard Mark II found an actual moth stuck in a relay. Most bugs come from skipping step 2, which is why planning matters.

And programs don't stay finished. Most of a program's life is spent being fixed and extended, usually by someone who didn't write it, often _you_ months later. Code that is easy to read and change saves more time than code that was quick to write.

## Writing source code

The C++ you write is called **source code**, and it lives in plain text files:

| File                        | What it holds                                              |
| --------------------------- | ---------------------------------------------------------- |
| `.cpp` (also `.cc`, `.cxx`) | C++ source code, the code that actually gets compiled      |
| `.h` or `.hpp`              | Header files: declarations that several `.cpp` files share |

A tiny program is a single `main.cpp`. A big one can be thousands of files. Naming the file that holds `main()` **`main.cpp`** is a common convention, and it makes any project easy to find your way around.

Write code in a **code editor** rather than a word processor. A word processor quietly adds formatting and "smart" quotes that break code. A code editor gives you:

- **line numbers**, because compiler errors point at line numbers;
- **syntax highlighting**, colouring keywords, strings and comments differently so mistakes stand out;
- **a monospace font**, where every character is the same width and `0`/`O` and `1`/`l` are easy to tell apart.

## Building: from text to an executable

Turning source code into a runnable program is called **building**. People often say "compiling", but a build is really **four steps**. One command runs all four:

![g++ runs the preprocessor, compiler, assembler and linker for you, one after another.](diagram:build-pipeline)

1. **Preprocessing.** The preprocessor handles lines that start with `#`. For `#include <iostream>` it pastes in the contents of that header; `#define` rules get expanded. The result is one big, expanded source file. _(More in **Preprocessor, headers and header guards**.)_
2. **Compiling.** The compiler checks your code against the rules of C++ (spelling, grammar, types) and stops with an **error** if something breaks them. If everything is valid, it translates the code into assembly for your CPU.
3. **Assembling.** The assembler turns that assembly into machine code and writes an **object file** (`.o` with GCC and Clang, `.obj` with Microsoft's compiler).
4. **Linking.** The linker combines your object files and any **libraries** you use into a single **executable**: `hello.exe` on Windows, plain `hello` on Linux and macOS.

You can watch each step happen by asking `g++` to stop early:

```bash title="terminal"
g++ -E hello.cpp -o hello.ii   # 1. preprocess only
g++ -S hello.cpp -o hello.s    # 2. compile to assembly
g++ -c hello.cpp -o hello.o    # 3. assemble an object file
g++ hello.o -o hello           # 4. link an executable
./hello                        # run it
```

Open `hello.ii` and you'll find thousands of lines: that's what `#include <iostream>` pasted in. You'll learn to drive the compiler properly in **Compiling from the command line**.

### What an object file is

An object file is machine code that isn't a program _yet_. Along with the code, it keeps a list of names:

- the functions and variables it **provides** (_"I define `add`"_);
- the ones it **needs** from somewhere else (_"I call `add`, but I don't have it"_).

The compiler works on **one `.cpp` file at a time**, and never looks inside the others. Each `.cpp` file plus everything it includes is called a **translation unit**, and each becomes its own object file.

### What the linker does

The linker's job is to put the pieces together:

1. Take every object file in the program.
2. Match every **need** to exactly one **provide**: the `add` that `main.o` calls is found in `math.o`.
3. Pull in what the program uses from **libraries**.
4. Write one executable file.

![Each .cpp file is compiled on its own; the linker matches what each object file needs with what another one provides.](diagram:multi-file-link)

If a need can't be matched, or something is provided twice, the linker stops with an error. That's a **link error**, and it looks quite different from a compile error (more on that below).

### Libraries

A **library** is a bundle of code that has already been compiled, ready to be linked into your program.

- **The C++ standard library** comes with every compiler: input and output (`std::cout`), strings, containers like `std::vector`, sorting and much more. It's linked in automatically. With GCC it's called `libstdc++`, and with Clang on macOS it's `libc++`.
- **Third-party libraries** are written by other people for specific jobs, for example SFML for games and graphics, Boost for general utilities, or `fmt` for formatting. You download them and tell the build where they are.

How libraries are packaged (static vs dynamic) has its own subtopic: **Static and dynamic libraries**.

### Build, rebuild, clean, run

IDEs and build tools use a few words you'll see constantly:

| Command     | What it does                                                                  |
| ----------- | ----------------------------------------------------------------------------- |
| **Compile** | Compiles one file, without linking                                            |
| **Build**   | Compiles only the files that changed since last time, then links. Fast        |
| **Clean**   | Deletes the object files and executable from previous builds                  |
| **Rebuild** | Clean, then build everything from scratch. Use it when a build acts strangely |
| **Run**     | Starts the executable (building first if needed)                              |

Build skips unchanged files because their object files are still valid. That's why splitting a big program into many `.cpp` files makes it faster to rebuild.

## Three kinds of problems, at three different times

When something goes wrong, the first question is **when** it went wrong. That tells you where to look.

### 1. Compile errors: a file breaks the rules

```cpp title="missing-semicolon.cpp"
#include <iostream>

int main()
{
    std::cout << "Hi\n"
    return 0;
}
```

```output title="Compiler output (GCC)"
missing-semicolon.cpp: In function 'int main()':
missing-semicolon.cpp:5:24: error: expected ';' before 'return'
```

The message gives the **file**, **line**, **column** and the problem. The mistake is often on the line just _before_ the one reported, as here: the semicolon is missing at the end of line 5, and the compiler only notices when it reaches `return`.

### 2. Link errors: every file compiled, but a piece is missing

```cpp title="missing-definition.cpp"
#include <iostream>

int add(int x, int y); // declared, but never defined

int main()
{
    std::cout << add(2, 3) << '\n';
    return 0;
}
```

```output title="Linker output (GCC)"
/usr/bin/ld: missing-definition.o: in function `main':
missing-definition.cpp:(.text+0xe): undefined reference to `add(int, int)'
collect2: error: ld returned 1 exit status
```

The file compiles fine: the declaration promises the compiler that `add` exists _somewhere_. The linker then searches every object file and library, finds no definition, and gives up. Spot a link error by **`ld`**, **"undefined reference"** or **"multiple definition"** (GCC and Clang), or **`LNK`** codes such as `LNK2019` (Visual Studio).

### 3. Run-time and logic errors: it builds, but it's wrong

The program builds and runs, but crashes or prints the wrong answer. Neither tool can catch these, because the code is perfectly legal C++ that just doesn't do what you meant. Finding them is what the **Debugging** topic is about.

|                        | When it happens        | Typical signs                                                 | Where to look                                                            |
| ---------------------- | ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Compile error          | During compiling       | `error:` with a file, line and column                         | That line, or the one just before it                                     |
| Link error             | During linking         | `undefined reference`, `multiple definition`, `ld`, `LNK2019` | Missing or duplicate definitions, files left out of the build, libraries |
| Run-time / logic error | While the program runs | A crash, a hang, or wrong output                              | Your logic: test and debug                                               |

> [!TIP]
> Always fix the **first** error first. One mistake, like a missing brace, can confuse the compiler into reporting dozens of errors after it. Fix the first, build again, and many of the rest disappear.

## Tools: an IDE or separate pieces

You need an editor, a compiler, a linker, and later a debugger. An **IDE** (integrated development environment) bundles them all into one app. It also manages a **project**: the list of source files and settings that make up one program.

- **Visual Studio** (Windows) and **Xcode** (macOS) come with their own compilers.
- **CLion** and **Code::Blocks** work with GCC or Clang.
- **VS Code** is an editor, not a full IDE. Add the C/C++ extension and install a compiler separately.

A few IDE terms:

- **Project:** everything for _one_ program. Make a new project for each program.
- **Console application:** a program that runs in a text terminal, with no windows or buttons. Everything in this course is a console application.
- **Workspace / solution:** a container that can hold several related projects.

Installing and configuring all of this is covered in **Setting up the compiler**.

## Common problems and how to fix them

| Problem                                                           | Likely cause                                                            | Fix                                                                             |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| The console window flashes and closes                             | The IDE runs the program in a window that closes when it ends           | Run it from a terminal, or turn on the IDE's "keep console open" setting        |
| The program runs but shows nothing                                | Antivirus is blocking the new executable                                | Run it from a terminal, or add an exclusion for your project folder             |
| `undefined reference to main` / `unresolved external symbol main` | No `main()`, a misspelt `main`, or its file isn't part of the build     | Check the spelling, and check the file is in the project or on the command line |
| `multiple definition of main` / `main already defined`            | Two files in the build each have a `main()`                             | A program has exactly one `main()`. Remove or exclude the extra one             |
| `'cout' was not declared` (or `cin`, `endl`)                      | Missing `#include <iostream>` or the `std::` prefix                     | Add the include, and write `std::cout`                                          |
| `'end1' was not declared`                                         | The digit one instead of the letter l                                   | It's `endl`, with a lowercase L                                                 |
| Modern C++ features don't compile                                 | The compiler is old, or set to an old standard                          | Update it, or pass a flag such as `-std=c++20`                                  |
| `cannot open output file … Permission denied`                     | The program from the last run is still open, or antivirus has locked it | Close the running program, then build again                                     |
| Visual Studio: error `C1010` about precompiled headers            | The project expects a `pch.h` include                                   | Turn off precompiled headers in the project settings                            |
| Visual Studio: `unresolved external symbol WinMain`               | It was created as a Windows desktop app                                 | Create a new **Console App** project                                            |
| Visual Studio: "Cannot find or open the PDB file"                 | Debug symbols for system files aren't downloaded                        | Harmless, so ignore it                                                          |

> [!NOTE]
> **When you're stuck:** paste the _exact_ error message into a search engine (minus your file paths), read the **first** error, and if you ask someone, include the smallest program that still shows the problem.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What happens when you run `g++ main.cpp`?** Preprocess, compile, assemble, link.
> - **What's an object file, and why does each `.cpp` file get its own?** Each translation unit is compiled separately, which also makes rebuilds faster.
> - **Compile error vs link error: how can you tell, and what usually causes each?**
> - **What does the linker actually do?** It matches every needed name with exactly one definition, pulls in libraries, and writes the executable.
> - **Why might a program that compiles still fail to link?** A declaration with no definition, a file left out of the build, or a library that isn't linked.
