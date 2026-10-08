---
subtopic: Setting up the compiler
published: 2026-10-08
summary:
  - Install one toolchain. Visual Studio on Windows, Apple Clang plus an editor on macOS, and GCC plus an editor on Linux.
  - Develop in a Debug build (no optimization, debug info). Switch to Release (-O2 -DNDEBUG) to ship or to measure speed.
  - Turn compiler extensions off with -pedantic-errors or /permissive-, so your code is standard C++ that works everywhere.
  - Turn warnings up (-Wall -Wextra -Wconversion -Wsign-conversion, or /W4) and treat them as errors while you learn.
  - Pick the newest standard your compiler supports (-std=c++20 or newer), and check it with the __cplusplus macro.
sources:
  - https://www.learncpp.com/cpp-tutorial/installing-an-integrated-development-environment-ide/
  - https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-build-configurations/
  - https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-compiler-extensions/
  - https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/
  - https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/
  - https://www.learncpp.com/cpp-tutorial/what-language-standard-is-my-compiler-using/
  - https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/
---

A compiler fresh out of the box is set up to be forgiving: it accepts old-style code, quietly allows its own non-standard features, and stays silent about plenty of suspicious things. That's convenient for compiling other people's old projects, and bad for learning. This page gets you a working setup, then changes the **four settings** that turn your compiler from a pushover into a strict, helpful teacher.

## What you're installing

You need a **toolchain**, the set of tools that turns code into a program:

- a **compiler** (which also brings the linker and the standard library);
- an **editor** to write code in, ideally one that understands C++;
- a **debugger**, to pause a running program and look inside it (you'll use it in the **Debugging** topic).

An **IDE** bundles all three into one app. You can also use a separate editor plus a compiler you install yourself. Both are fine.

## Pick your tools

![Choose by operating system; any of these handles everything in this course.](diagram:toolchain-choices)

**Windows.** Install **Visual Studio Community** (free). In the installer, tick the **"Desktop development with C++"** workload, which brings Microsoft's compiler (MSVC), the debugger and everything else. If you'd rather use VS Code or CLion, install GCC through **MSYS2** (MinGW-w64) first.

**macOS.** Run `xcode-select --install` in Terminal. It installs Apple's **Clang** compiler and command-line tools without the full Xcode app. Then use **VS Code** (with Microsoft's C/C++ extension), **CLion** or **Xcode**. On a Mac, the `g++` command is actually Clang under another name.

**Linux.** Install GCC from your package manager: `sudo apt install build-essential` on Debian and Ubuntu, or `sudo dnf install gcc-c++` on Fedora. Then use **VS Code**, **CLion** or **Code::Blocks**.

A few more notes on choosing:

- **VS Code is an editor, not a full IDE.** It's excellent, but you install the compiler yourself and write a small config file to build and debug. Do this once and you're set. If you'd rather not, use Visual Studio or CLion.
- **Code::Blocks on Windows** ships with an old MinGW compiler that can't handle newer C++. If you use it, install a newer GCC (from MSYS2 or winlibs) and point Code::Blocks at it.
- **Online compilers** like **Compiler Explorer** (godbolt.org) and **Wandbox** need no install. They're great for trying a quick idea, but have no debugger and are awkward with several files. Use them as a scratchpad, not your main setup.
- **Avoid** Turbo C++ (it predates standard C++ entirely), old Dev-C++ downloads that bundle an ancient compiler, and Visual Studio for Mac (discontinued, and it never supported C++ properly).

### Make sure your compiler is recent

Anything released in the last two or three years supports C++20 well. Check what you have:

```bash title="terminal"
g++ --version        # GCC
clang++ --version    # Clang
```

For Visual Studio, use **Help → About**, or keep the installer up to date. If an install fails, uninstall, reboot, pause your antivirus while you reinstall, and search the _exact_ error message.

### Create your first project

Each IDE starts a program slightly differently:

- **Visual Studio:** _Create a new project_ → **Console App** (C++) → name it → _Create_. It opens a `.cpp` file that already holds a hello-world program. Press **Ctrl+F5** (_Start Without Debugging_) to build and run, and the console window stays open afterwards.
- **Code::Blocks:** _File → New → Project_ → **Console application** → C++ → name and folder. Open `main.cpp` under _Sources_ and press **F9** (_Build and run_).
- **VS Code:** open an empty folder, create `main.cpp`, then use _Terminal → Run Build Task_ to compile it with the settings in `.vscode/tasks.json` (below).
- **CLion:** _New Project_ → **C++ Executable**. It makes a CMake project with `main.cpp`. Press the green **Run** arrow.

Whatever you use, **one program = one project**. And, as the rest of this page shows, check the project's settings before you write much code.

## Setting 1: build configurations (Debug and Release)

A **build configuration** is a named bundle of settings for how your project gets built. Every IDE gives you at least two:

![The same source code built two ways: one easy to debug, one fast to run.](diagram:debug-vs-release)

|                                | Debug                      | Release                                   |
| ------------------------------ | -------------------------- | ----------------------------------------- |
| Optimization                   | Off (`-O0`)                | On (`-O2`)                                |
| Debug information              | Included (`-g`)            | Left out                                  |
| `assert()` checks              | On                         | Off (`-DNDEBUG`)                          |
| Executable                     | Bigger, slower             | Smaller, faster                           |
| Stepping through in a debugger | Easy                       | Confusing: lines get reordered or removed |
| Use it for                     | Writing and debugging code | Shipping, and measuring speed             |

**Develop in Debug. Switch to Release** when you hand the program to someone or want to know how fast it really is. Timing a Debug build tells you very little, since optimization can make code several times faster.

Where to switch:

- **Visual Studio:** the **Debug / Release** drop-down on the toolbar. Next to it, choose **x64** (64-bit) rather than x86.
- **Code::Blocks:** the **Build target** drop-down.
- **GCC / Clang on the command line:** `-g` (or `-ggdb`) and `-O0` for a debug build; `-O2 -DNDEBUG` for a release build. `-O3` optimizes even harder, and `-Og` (GCC) optimizes only in ways that don't get in the debugger's way.

> [!IMPORTANT]
> IDE settings are stored **per configuration**. When you change the settings below, apply them to **All Configurations** (Visual Studio has a drop-down for this). Otherwise your Debug build is strict while your Release build quietly isn't.

## Setting 2: turn compiler extensions off

Compilers add **extensions**: features of their own that aren't part of standard C++. The classic example is GCC accepting an array whose size is only known at run time:

```cpp title="vla.cpp"
#include <iostream>

int main()
{
    int n = 0;
    std::cin >> n;
    int numbers[n]; // size known only at run time: not standard C++
    std::cout << sizeof(numbers) << '\n';
    return 0;
}
```

GCC compiles this happily by default. Microsoft's compiler rejects it. Turn extensions off, and GCC tells you the truth:

```output title="g++ -pedantic-errors vla.cpp"
vla.cpp:7:9: error: ISO C++ forbids variable length array 'numbers' [-Wvla]
```

Extensions are a trap while you're learning. You end up thinking a compiler quirk is part of C++, and then your code fails on another compiler, in an interview, or on an online judge. Switch them off:

- **GCC / Clang:** add `-pedantic-errors`.
- **Visual Studio:** _Project → Properties → C/C++ → Language → **Conformance mode: Yes (/permissive-)**_. Newer projects usually have it on already, but check.
- **Code::Blocks:** _Settings → Compiler → Compiler flags_, and tick **-pedantic-errors**.

> [!NOTE]
> Also prefer `-std=c++20` over GCC's default `-std=gnu++17`. The `gnu++` modes switch on GNU extensions too. More on standards below.

## Setting 3: turn the warnings up

When the compiler spots a problem it prints a **diagnostic**, which comes in two kinds:

- an **error**: the code breaks the rules of C++, so compiling **stops**;
- a **warning**: the code is legal but looks suspicious, so compiling **carries on** and you get a program that may be wrong.

Compilers don't always agree, either. The same mistake can be an error on one and a warning on another. And by default, most compilers only warn about the most obvious problems. Here's a bug that compiles silently:

```cpp title="oops.cpp"
#include <iostream>

int main()
{
    int x = 3;
    if (x = 5) // meant ==, but this assigns 5 and is always true
        std::cout << "x is five\n";
    return 0;
}
```

With warnings on, the compiler points straight at it:

```output title="g++ -Wall oops.cpp"
oops.cpp:6:11: warning: suggest parentheses around assignment used as truth value [-Wparentheses]
```

The flags to use:

- **GCC / Clang:** `-Wall -Wextra -Wconversion -Wsign-conversion -Wshadow`.
  - `-Wall` turns on the common warnings. Despite the name, it is _not_ all of them.
  - `-Wextra` adds more.
  - `-Wconversion` and `-Wsign-conversion` warn when a conversion could lose data, or flip a negative number into a huge positive one.
  - `-Wshadow` warns when one variable's name hides another's.
- **Visual Studio:** _C/C++ → General → **Warning Level: Level 4 (/W4)**_. Don't use `/Wall`: it buries you in warnings from Microsoft's own headers. To also get signed/unsigned conversion warnings, add `/w44365` under _C/C++ → Command Line_. If headers you didn't write get noisy, lower the **External Header Warning Level**.
- **Code::Blocks:** tick **-Wall** and **-Wextra** in _Compiler flags_, and add the rest under _Other compiler options_.

> [!TIP]
> You may see `-Weffc++` recommended elsewhere. It checks rules from a book written for C++98, and on modern code it mostly produces noise. You can safely skip it.

### Treat warnings as errors

Add **`-Werror`** (GCC/Clang) or set **Treat Warnings As Errors: Yes (/WX)** in Visual Studio. Every warning then stops the build, so you _have_ to fix it. While you're learning, that's exactly what you want: each warning is a small lesson, and warnings you leave alone pile up until the important one hides among them.

Very occasionally you'll need to silence one specific warning, usually in someone else's code. Compilers have their own `#pragma` lines for that. It's rare, so fix the code instead whenever you can.

![Every flag in a solid starting command, and what it does.](diagram:compiler-flags)

## Setting 4: choose the newest language standard

Each C++ standard is named after the year it was finished. While a standard is still being written it has a placeholder name, which you'll see in older compilers and docs:

| Standard | Name while in progress | Compiler flag                                |
| -------- | ---------------------- | -------------------------------------------- |
| C++11    | C++0x                  | `-std=c++11`                                 |
| C++14    | C++1y                  | `-std=c++14`                                 |
| C++17    | C++1z                  | `-std=c++17`                                 |
| C++20    | C++2a                  | `-std=c++20` (older compilers: `-std=c++2a`) |
| C++23    | C++2b                  | `-std=c++23` (older compilers: `-std=c++2b`) |
| C++26    | C++2c                  | `-std=c++2c`                                 |

Compilers **don't default to the newest standard**. Recent GCC and Clang default to `gnu++17` (C++17 plus extensions), and Microsoft's compiler defaults to C++14. So set it yourself:

- **GCC / Clang:** `-std=c++20`, or `-std=c++23` if your compiler supports it.
- **Visual Studio:** _C/C++ → Language → **C++ Language Standard**_: pick **ISO C++20 (/std:c++20)** or newer.
- **Code::Blocks:** _Settings → Compiler_, then tick the newest `-std=` option listed. If it doesn't list C++20, your bundled compiler is too old.
- **VS Code:** put the `-std=` flag in `tasks.json`, and set `"cppStandard"` in the C/C++ extension settings so the editor's error squiggles match.

**Which one?** While learning, use the **newest standard your compiler fully supports**; this course assumes at least C++20. Companies often stay one or two versions behind, so every compiler on every platform they ship to can handle the code. A compiler can also lag behind the paperwork. A standard may be official before every feature is implemented, so if a new feature won't compile, check the _compiler support_ tables on cppreference.com.

> [!TIP]
> Settings like these are saved **per project** in Visual Studio. Once a project is set up the way you like, use _Project → Export Template_ and start new projects from it. Code::Blocks keeps these settings globally, so you set them once.

### Check which standard you're actually using

Every compiler defines a macro called `__cplusplus`, a number that tells you which standard it's compiling against:

| `__cplusplus` | Standard      |
| ------------- | ------------- |
| `199711L`     | C++98 / C++03 |
| `201103L`     | C++11         |
| `201402L`     | C++14         |
| `201703L`     | C++17         |
| `202002L`     | C++20         |
| `202302L`     | C++23         |

A value _between_ two of these means the compiler is part-way to the next standard: newer than the lower one, with only some of the newer features. Here's a small program that prints what you've got:

```cpp title="standard.cpp"
#include <iostream>

int main()
{
#ifdef _MSVC_LANG
    long version = _MSVC_LANG; // MSVC: see the warning below
#else
    long version = __cplusplus;
#endif
    std::cout << "__cplusplus is " << version << '\n';

    if (version > 202002L)
        std::cout << "Newer than C++20\n";
    else if (version > 201703L)
        std::cout << "C++20\n";
    else if (version > 201402L)
        std::cout << "C++17\n";
    else if (version > 201103L)
        std::cout << "C++14\n";
    else if (version > 199711L)
        std::cout << "C++11\n";
    else
        std::cout << "C++98/03\n";

    return 0;
}
```

```output title="Output with -std=c++20"
__cplusplus is 202002
C++20
```

> [!WARNING]
> Microsoft's compiler reports `__cplusplus` as `199711L` no matter which standard you pick, unless you also pass `/Zc:__cplusplus`. That's why the program reads `_MSVC_LANG` instead, which MSVC always sets correctly.

Want to see a compiler's _default_ without writing a program? This prints the predefined value:

```bash title="terminal"
g++ -dM -E -x c++ /dev/null | grep __cplusplus
```

## The whole setup at a glance

| Setting             | GCC / Clang                                             | Visual Studio                         | Code::Blocks                       |
| ------------------- | ------------------------------------------------------- | ------------------------------------- | ---------------------------------- |
| Language standard   | `-std=c++20`                                            | C++ Language Standard: ISO C++20      | Tick the newest `-std=`            |
| Extensions off      | `-pedantic-errors`                                      | Conformance mode: Yes (/permissive-)  | Tick `-pedantic-errors`            |
| Warnings up         | `-Wall -Wextra -Wconversion -Wsign-conversion -Wshadow` | Warning Level 4 (/W4), plus `/w44365` | Tick `-Wall -Wextra`, add the rest |
| Warnings are errors | `-Werror`                                               | Treat Warnings As Errors: Yes (/WX)   | Add `-Werror`                      |
| Debug build         | `-g -O0`                                                | Debug configuration                   | Build target: Debug                |
| Release build       | `-O2 -DNDEBUG`                                          | Release configuration                 | Build target: Release              |

All together, a strict debug build from the terminal looks like this:

```bash title="terminal"
g++ -std=c++20 -Wall -Wextra -Wconversion -Wsign-conversion \
    -Wshadow -pedantic-errors -Werror -g main.cpp -o main
```

In VS Code, the same flags go in the `args` list of `.vscode/tasks.json`:

```json title=".vscode/tasks.json (args)"
"args": [
  "-std=c++20",
  "-Wall", "-Wextra", "-Wconversion", "-Wsign-conversion",
  "-Wshadow", "-pedantic-errors", "-Werror",
  "-g", "${file}",
  "-o", "${fileDirname}/${fileBasenameNoExtension}"
]
```

Typing all that every time gets old fast. **Compiling from the command line** shows how to save it, and **Build systems: Make and CMake** shows how real projects handle it.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **Debug vs Release build:** what changes, and why you shouldn't measure speed in Debug.
> - **What `-O2` does:** turns on optimizations that make code faster, at the cost of slower compiles and harder debugging.
> - **What `NDEBUG` is:** a macro that, when defined, turns every `assert()` into nothing. Release builds define it.
> - **What a compiler extension is**, with an example: variable-length arrays in GCC.
> - **Why `-Wall` isn't "all warnings"**, and which flags you'd add.
> - **How to tell which standard you're compiling with:** the `__cplusplus` macro (and `_MSVC_LANG` on MSVC).
