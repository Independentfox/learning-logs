---
subtopic: Static and dynamic libraries
published: 2026-10-09
summary:
  - A library is ready-made code in two parts. Headers (declarations) are for the compiler, and a compiled binary (definitions) is for the linker.
  - A static library (.a, or .lib on Windows) is copied into your executable when you link. The program stands alone, but every program carries its own copy.
  - A dynamic library (.so, .dylib, .dll) stays a separate file, loaded when the program starts. Programs share one copy, but it must be findable at run time.
  - "Using a library takes three settings: where its headers are (-I), where its binaries are (-L), and which library to link (-lname)."
  - Undefined reference means the library wasn't linked. "Cannot open shared object file" means it linked, but can't be found when the program runs.
sources:
  - https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/
  - https://www.learncpp.com/cpp-tutorial/a2-using-libraries-with-visual-studio-2005-express/
  - https://www.learncpp.com/cpp-tutorial/a3-using-libraries-with-codeblocks/
---

Sooner or later you'll want code you didn't write: a graphics library for a game, a JSON parser, a networking library. That code usually arrives as a **library**. This page explains what a library actually is, the two kinds (static and dynamic), how to build your own, and how to wire one into a project, plus the two errors you'll hit when the wiring is wrong.

## What a library is

A **library** is reusable code, packaged so other programs can use it without compiling its source code every time. It comes in two parts:

1. **Header files**, holding the **declarations**. Your code `#include`s them, so the compiler knows what the library offers.
2. A **compiled binary**, holding the **definitions** as machine code. The linker connects your calls to it.

This is the header/source split from **Preprocessor, headers and header guards**, except the `.cpp` files have already been compiled for you. Shipping compiled code saves every user from rebuilding the library (big libraries can take hours to compile), and it lets a vendor ship a library without handing over its source code.

The binary comes in one of two forms.

## Static libraries

A **static library** is a bundle of object files in one file: `.a` ("archive") on Linux and macOS, `.lib` on Windows. When you link against it, the linker **copies** the machine code your program uses into your executable.

**Building one** takes two commands: compile to object files, then pack them into an archive with `ar`:

```bash title="terminal"
g++ -c add.cpp                          # → add.o
ar rcs libmymath.a add.o                # pack it into a static library
g++ main.cpp -L. -lmymath -o app        # link against it
./app
```

```output title="Output of ./app"
5
```

Here `add.h` declares `int add(int x, int y);`, `add.cpp` defines it, and `main.cpp` includes the header and prints `add(2, 3)`.

- `-L.` adds a folder (here `.`, the current one) to the places the linker searches for libraries.
- `-lmymath` links the library called `libmymath`. The linker adds the `lib` prefix and the file extension for you.

| Static libraries                    |                                                      |
| ----------------------------------- | ---------------------------------------------------- |
| ✅ The executable is self-contained | Ship one file, and it just works                     |
| ✅ No version surprises             | The library code is frozen into your program         |
| ❌ Bigger executables               | Every program that uses it carries its own copy      |
| ❌ Updating means relinking         | A bug fix in the library needs every program rebuilt |

## Dynamic (shared) libraries

A **dynamic library**, also called a **shared library**, stays a **separate file**: `.so` ("shared object") on Linux, `.dylib` on macOS, `.dll` on Windows. Your executable only records which library it needs. When the program starts, the operating system's **loader** finds the library, loads it into memory, and connects your calls to it.

**Building one** on Linux:

```bash title="terminal"
g++ -shared -fPIC add.cpp -o libmymath.so   # build a shared library
g++ main.cpp -L. -lmymath -o app             # link against it
LD_LIBRARY_PATH=. ./app                      # tell the loader where to look
```

`-shared` makes a shared library instead of an executable. `-fPIC` (position-independent code) lets the library work wherever in memory the loader places it.

| Dynamic libraries                   |                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| ✅ One copy shared by every program | Smaller executables, and less memory used when many programs run               |
| ✅ Update without relinking         | Replace the `.so`/`.dll`, and every program picks up the fix                   |
| ❌ It must be found at run time     | Missing or in the wrong place means the program won't start                    |
| ❌ Version mismatches               | A newer library that changed its interface can break old programs ("DLL hell") |

![A static library is copied into the executable; a dynamic library stays separate and is loaded when the program starts.](diagram:static-vs-dynamic)

### Import libraries on Windows

On Windows, linking against a `.dll` usually goes through a small **import library**, a `.lib` file. Your program links against that `.lib` at build time, and the real code is loaded from the `.dll` at run time. So on Windows a `.lib` can be either a full static library or just the import stub for a DLL. Check the library's documentation to see which one you've got. On Linux, the `.so` file plays both roles.

## Using someone else's library

Whatever the library, wiring it in takes the same three settings, plus one more for dynamic libraries:

| Step                             | What it tells                              | g++ / clang++                                                             | Visual Studio (Project Properties)                             |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Header folder                    | The **compiler** where the `.h` files are  | `-I path/include`                                                         | C/C++ → General → **Additional Include Directories**           |
| Library folder                   | The **linker** where the binaries are      | `-L path/lib`                                                             | Linker → General → **Additional Library Directories**          |
| Which library                    | The **linker** what to link                | `-lname`                                                                  | Linker → Input → **Additional Dependencies** (e.g. `name.lib`) |
| Run-time location (dynamic only) | The **loader** where the shared library is | Put it in a system library folder, set `LD_LIBRARY_PATH`, or set an rpath | Put the `.dll` next to the `.exe` (or on `PATH`)               |

In **Code::Blocks** the same settings live under _Project → Build options_: **Search directories** (Compiler and Linker tabs) for the folders, and **Linker settings** for the library names.

![The compiler needs the headers, the linker needs the binary, and for a dynamic library the loader needs to find it at run time.](diagram:using-a-library)

> [!TIP]
> You rarely do this by hand any more. **Package managers** download libraries and install them where your tools can find them: your Linux distribution's (`apt install libfmt-dev` puts the headers and binaries in folders the compiler and linker already search), Homebrew on macOS, or C++-specific ones like **vcpkg** and **Conan**. **CMake** then wires the paths and library names into the build, as covered in **Build systems: Make and CMake**.

## When it goes wrong

Two errors cover almost every library problem, and they come from different stages.

**At link time: the library wasn't linked.** You included the header, so it compiles, but nobody gave the linker the binary:

```output title="Linker output (GCC, object paths shortened), main.cpp built without -lmymath"
/usr/bin/ld: main.o: in function `main':
main.cpp:(.text+0xf): undefined reference to `add(int, int)'
collect2: error: ld returned 1 exit status
```

Fix: add the `-l` (and `-L` if needed), or the Visual Studio _Additional Dependencies_ entry. Remember from **Compiling from the command line**: `-l` must come **after** the files that use it.

**At run time: a dynamic library can't be found.** The build succeeded, but when the program starts, the loader can't find the `.so`:

```output title="Output (Linux), running the program when libmymath.so isn't on the loader's search path"
./app: error while loading shared libraries: libmymath.so: cannot open shared object file: No such file or directory
```

Fix: install the library somewhere standard, point `LD_LIBRARY_PATH` at its folder, or embed the folder in the executable (an **rpath**, which is what CMake does automatically for programs in its build tree). On Windows the equivalent is a "_the code execution cannot proceed because X.dll was not found_" dialog: copy the `.dll` next to the `.exe`.

| Message                                           | Stage   | Means                                 |
| ------------------------------------------------- | ------- | ------------------------------------- |
| `fatal error: x.h: No such file or directory`     | Compile | Header folder not set: `-I`           |
| `undefined reference to …`                        | Link    | Library not linked: `-l` / `-L`       |
| `cannot open shared object file` / missing `.dll` | Run     | Loader can't find the dynamic library |

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **Static vs dynamic library:** how is each linked, and what are the trade-offs?
> - **What does `-fPIC` mean, and why do shared libraries need it?**
> - **What's an import library on Windows?**
> - **What do `-I`, `-L` and `-l` each do, and which stage uses each?**
> - **A program builds but fails to start with "cannot open shared object file". Why, and how do you fix it?**
