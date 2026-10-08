---
subtopic: "Build systems: Make and CMake"
published: 2026-10-09
summary:
  - A build system remembers how to build your program and rebuilds only what changed, so you stop retyping long compiler commands.
  - Make reads a Makefile of rules (target, prerequisites, then a tab-indented command) and rebuilds a target when a prerequisite is newer.
  - List headers as prerequisites too, so editing add.h rebuilds every file that includes it.
  - CMake doesn't build anything itself. It reads CMakeLists.txt and generates files for Make, Ninja or Visual Studio, which do the building.
  - "Modern CMake is target-based: add_executable and add_library, then target_link_libraries, target_include_directories and target_compile_options."
sources:
  - https://www.gnu.org/software/make/manual/make.html
  - https://cmake.org/cmake/help/latest/guide/tutorial/index.html
  - https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/
---

So far you've built programs by typing `g++` commands. With three files that's fine. With three hundred files, each needing the same twelve flags, plus a library or two, it isn't. You'd also want to recompile only the files you changed, not all of them. **Build systems** do this: you describe your project once, and they work out the commands. This page covers the two you'll meet most often in C++: **Make**, the classic, and **CMake**, today's standard.

## What a build system does

1. **Remembers the commands.** The flags, the files and the libraries are written down once, in a file in the project, so everyone builds the same way.
2. **Tracks dependencies.** It knows `app` is made from `main.o` and `add.o`, and `main.o` is made from `main.cpp` and `add.h`.
3. **Rebuilds only what changed.** Edit one file, and it recompiles only that file and anything that depends on it, then relinks. This is the incremental build from **Compiling from the command line**, done for you.

## Make

**Make** reads a file called `Makefile` that lists **rules**. Each rule says _what_ to build, _from what_, and _how_:

```makefile title="the shape of a rule"
target: prerequisites
	command to build the target
```

Here's a complete Makefile for the `main.cpp` + `add.cpp` + `add.h` program from earlier pages:

```makefile title="Makefile"
CXX      = g++
CXXFLAGS = -std=c++20 -Wall -Wextra -g

app: main.o add.o
	$(CXX) $(CXXFLAGS) main.o add.o -o app

main.o: main.cpp add.h
	$(CXX) $(CXXFLAGS) -c main.cpp -o main.o

add.o: add.cpp add.h
	$(CXX) $(CXXFLAGS) -c add.cpp -o add.o

.PHONY: clean
clean:
	rm -f app main.o add.o
```

- `CXX` and `CXXFLAGS` are **variables**. Use one with `$(NAME)`. Change the flags in one place, and every command picks them up.
- `app: main.o add.o` means _app is built from main.o and add.o_. The indented line under it is the command that does it.
- `main.o: main.cpp add.h` lists **the header too**, because `main.o` has to be rebuilt when `add.h` changes.
- `clean` deletes the build output. `.PHONY` tells Make that `clean` is a command name, not a file to build.

Run `make` and it builds the first target in the file, `app`, working out what's needed:

```output title="terminal: make (first time)"
$ make
g++ -std=c++20 -Wall -Wextra -g -c main.cpp -o main.o
g++ -std=c++20 -Wall -Wextra -g -c add.cpp -o add.o
g++ -std=c++20 -Wall -Wextra -g main.o add.o -o app
$ ./app
5
```

### How Make decides what to rebuild

Make compares **modification times**. A target is rebuilt if it doesn't exist yet, or if **any of its prerequisites is newer than it**. Then the check ripples upwards:

```output title="terminal: rebuilding"
$ make
make: `app' is up to date.
$ touch add.cpp && make
g++ -std=c++20 -Wall -Wextra -g -c add.cpp -o add.o
g++ -std=c++20 -Wall -Wextra -g main.o add.o -o app
$ touch add.h && make
g++ -std=c++20 -Wall -Wextra -g -c main.cpp -o main.o
g++ -std=c++20 -Wall -Wextra -g -c add.cpp -o add.o
g++ -std=c++20 -Wall -Wextra -g main.o add.o -o app
```

(`touch` updates a file's modification time, as if you'd edited it. Newer versions of Make quote the name as `'app'` rather than `` `app' ``.)

- With nothing changed, there's nothing to do.
- Change `add.cpp`, and only `add.o` is recompiled before relinking. `main.o` is reused.
- Change `add.h`, and **both** object files are rebuilt, because both list it as a prerequisite.

![Make rebuilds a target when any prerequisite is newer; editing add.h makes both object files, and then app, out of date.](diagram:make-dependencies)

> [!WARNING]
> The command lines under a rule **must start with a Tab character**, not spaces. Many editors quietly convert tabs to spaces, and Make then refuses with:
>
> `Makefile:5: *** missing separator (did you mean TAB instead of 8 spaces?).  Stop.`
>
> Set your editor to keep real tabs in Makefiles.

### Less typing: automatic variables and pattern rules

Real Makefiles avoid repeating every file's name. **Automatic variables** stand for parts of the current rule: `$@` is the target, `$^` all the prerequisites, `$<` the first prerequisite. A **pattern rule** with `%` covers every `.cpp` file at once:

```makefile title="Makefile (shorter)"
CXX      = g++
CXXFLAGS = -std=c++20 -Wall -Wextra -g

app: main.o add.o
	$(CXX) $(CXXFLAGS) $^ -o $@

%.o: %.cpp add.h
	$(CXX) $(CXXFLAGS) -c $< -o $@
```

Listing headers by hand gets error-prone as a project grows. Compilers can generate those dependency lists for you, with GCC and Clang's `-MMD -MP` flags. That's one of the many details CMake takes care of automatically.

## CMake

Makefiles get complicated as projects grow, and Visual Studio doesn't use them. **CMake** solves both problems by working one level up. You describe your project in a portable file called `CMakeLists.txt`, and CMake **generates** the real build files for whatever tool you use: Makefiles, **Ninja** files, a Visual Studio solution or an Xcode project. CMake has become the standard choice for C++ projects. CLion uses it directly, Visual Studio opens CMake projects natively, VS Code does with Microsoft's CMake Tools extension, and many libraries ship with it.

![CMake reads CMakeLists.txt and generates build files for Make, Ninja or Visual Studio, which then run the compiler.](diagram:cmake-flow)

The same program, as a CMake project:

```cmake title="CMakeLists.txt"
cmake_minimum_required(VERSION 3.20)
project(MathApp LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

add_library(mymath add.cpp)
target_include_directories(mymath PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_executable(app main.cpp)
target_link_libraries(app PRIVATE mymath)

if(CMAKE_CXX_COMPILER_ID MATCHES "GNU|Clang")
  target_compile_options(app PRIVATE -Wall -Wextra -pedantic-errors)
endif()
```

Line by line:

| Command                                                                 | What it does                                                                                         |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `cmake_minimum_required(VERSION 3.20)`                                  | The oldest CMake this file works with                                                                |
| `project(MathApp LANGUAGES CXX)`                                        | Names the project, and says it's C++                                                                 |
| `set(CMAKE_CXX_STANDARD 20)` + `..._REQUIRED ON` + `..._EXTENSIONS OFF` | `-std=c++20` with no GNU extensions, on any compiler (as recommended in **Setting up the compiler**) |
| `add_library(mymath add.cpp)`                                           | A library **target** built from `add.cpp` (static, unless `BUILD_SHARED_LIBS` is turned on)          |
| `target_include_directories(mymath PUBLIC …)`                           | Where `add.h` lives. `PUBLIC` passes it on to anything that links `mymath`                           |
| `add_executable(app main.cpp)`                                          | The program **target**                                                                               |
| `target_link_libraries(app PRIVATE mymath)`                             | Link `app` against `mymath`, which brings its include folder along too                               |
| `target_compile_options(app PRIVATE …)`                                 | Warning flags for this target, only for GCC and Clang (MSVC uses `/W4`)                              |

Modern CMake is **target-based**: you create targets (executables and libraries), then attach settings to _each target_. Settings marked `PUBLIC` flow on to whatever links that target. That's how `app` finds `add.h` without being told.

### Building a CMake project

CMake builds happen in two steps, in a **separate build folder** (an **out-of-source build**), so generated files never clutter your source code:

```bash title="terminal"
cmake -S . -B build          # configure: read CMakeLists.txt, generate build files into build/
cmake --build build          # build: run the generated build (Make, Ninja, …)
./build/app
```

```output title="Output of ./build/app"
5
```

- **Configure** (`cmake -S . -B build`) runs once, and again whenever `CMakeLists.txt` changes. `-S` is the source folder, `-B` the build folder.
- **Build** (`cmake --build build`) is what you run after every edit. Like Make, it only recompiles what changed, and CMake works out the header dependencies itself.
- **Pick a generator** with `-G`: `cmake -S . -B build-ninja -G Ninja` uses Ninja, which is usually faster than Make on big projects. Use a fresh build folder for it: a folder keeps the generator it was first configured with, and CMake refuses to switch.
- **Debug and Release builds:** with Make or Ninja, a folder configured without a build type gets neither optimization nor debug info, so pick one. Use `cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug` while developing, and `cmake -S . -B build-release -DCMAKE_BUILD_TYPE=Release` for a separate, optimized build (see **Setting up the compiler**).
- To start fresh, just delete the build folder.

### Using libraries from CMake

For libraries installed on the system or by a package manager, CMake's `find_package` locates them and creates a target you can link, with the include paths and library paths from **Static and dynamic libraries** handled for you:

```cmake title="CMakeLists.txt (using an installed library)"
find_package(fmt REQUIRED)
target_link_libraries(app PRIVATE fmt::fmt)
```

## Make or CMake?

|                                  | Make                                                   | CMake                                                                     |
| -------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| What it is                       | A build tool: runs commands                            | A build-file **generator**: writes input for Make, Ninja or Visual Studio |
| You write                        | `Makefile`                                             | `CMakeLists.txt`                                                          |
| Header dependencies              | By hand, or with `-MMD -MP`                            | Automatic                                                                 |
| Works with Visual Studio / Xcode | Not natively                                           | Yes, it generates their project files                                     |
| Good for                         | Small Unix projects, and understanding how builds work | Cross-platform projects, and anything beyond a few files                  |

Learn enough Make to read a Makefile and understand what a build system does. **Use CMake** for your own projects.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **How does Make decide what to rebuild?** By modification times of targets and their prerequisites.
> - **Why list header files as prerequisites in a Makefile?**
> - **What does "missing separator" mean in Make?** Spaces where a tab was required.
> - **Is CMake a build system?** It's a build-system _generator_: it produces Makefiles, Ninja files or IDE projects.
> - **What's the difference between `PUBLIC` and `PRIVATE` in `target_link_libraries` / `target_include_directories`?**
> - **What's an out-of-source build, and why use one?**
