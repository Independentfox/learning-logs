---
subtopic: Preprocessor, headers and header guards
published: 2026-10-09
summary:
  - The preprocessor edits each .cpp file before compiling. #include pastes in a file, #define makes a text substitution, and #ifdef keeps or drops code.
  - A header (.h) holds declarations that several .cpp files share. Include it instead of retyping the declarations in every file.
  - Use "quotes" for your own headers and <angle brackets> for library headers. Each .cpp should include its own header first.
  - Keep function and variable definitions out of headers. Included in two .cpp files, they break the One Definition Rule and the linker fails.
  - Header guards (#ifndef / #define / #endif, or #pragma once) stop one header being pasted into the same file twice.
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-the-preprocessor/
  - https://www.learncpp.com/cpp-tutorial/header-files/
  - https://www.learncpp.com/cpp-tutorial/header-guards/
---

In **Forward declarations and multiple files**, every file that used `add` had to declare it at the top. With dozens of functions and files, that's tedious and fragile: change a function's parameters, and every copy of its declaration has to change too. **Header files** fix this, and they're built on the first step of every build, the **preprocessor**. This page covers both, plus **header guards**, the small trick that keeps headers safe.

## The preprocessor

Before the compiler sees a `.cpp` file, the **preprocessor** runs through it and makes text edits. The result, the original file plus everything those edits add or remove, is called a **translation unit**, and that's what actually gets compiled. Your files on disk are never changed.

The preprocessor is driven by **directives**: lines that start with `#`. They have their own simple syntax: they aren't C++ statements, so there's no semicolon at the end. The preprocessor works through each file **top to bottom**, and it handles each file on its own, so a directive in one `.cpp` file has no effect on another.

### #include: paste a file here

`#include` replaces itself with the entire contents of the named file. The pasted text is processed too, so any `#include`s inside it get pasted as well.

![#include pastes the header's text into the .cpp file; the combined text is the translation unit the compiler sees.](diagram:include-paste)

You can see the result with `g++ -E main.cpp` (from **From source code to a running program**). A ten-line program that includes `<iostream>` expands to tens of thousands of lines.

### #define: macros

`#define` creates a **macro**: a rule that replaces a name with some text, everywhere it appears after the definition.

```cpp title="object-like.cpp"
#define MAX_PLAYERS 8 // from here on, MAX_PLAYERS is replaced by 8
```

That's how constants were made in C. In modern C++, a real constant is better, because it has a type and follows scope rules: `constexpr int maxPlayers{8};` (see **constexpr variables**).

Macros can take arguments too, which makes them look like functions. But they do _text_ substitution, not maths, and that bites:

```cpp title="macro-trap.cpp"
#include <iostream>

#define SQUARE(x) x * x

int main()
{
    std::cout << SQUARE(5) << '\n';
    std::cout << SQUARE(2 + 3) << '\n';
    return 0;
}
```

```output
25
11
```

`SQUARE(2 + 3)` becomes `2 + 3 * 2 + 3`, which is `11`, not `25`. A real function, `int square(int x)`, can't make that mistake. **Prefer constants and functions to macros.** The one job macros are still good for is the next one.

### Conditional compilation

A macro can also be defined with **no replacement text**, just to mark something as "on". Combine it with `#ifdef` ("if this macro is defined") or `#ifndef` ("if it isn't"), ending with `#endif`, and you can keep or drop whole blocks of code before compiling:

```cpp title="conditional.cpp"
#include <iostream>

#define DEBUG_LOG

int main()
{
#ifdef DEBUG_LOG
    std::cout << "debug: starting\n";
#endif
    std::cout << "Hello\n";
#if 0
    std::cout << "this line is switched off\n";
#endif
    return 0;
}
```

```output
debug: starting
Hello
```

- Delete the `#define DEBUG_LOG` line and the debug message disappears from the program entirely. It's not skipped at run time; it was never compiled.
- `#if 0` … `#endif` switches off a block of code. Unlike `/* */`, it can't be broken by a comment inside the block.
- Instead of writing `#define` in the file, you can define a macro from the command line with `-D`: `g++ -DDEBUG_LOG main.cpp`.

> [!NOTE]
> A macro is in effect from its `#define` to the end of **that file**, regardless of braces or functions. Writing it inside a function doesn't limit it to that function. It doesn't reach other `.cpp` files either, unless it's in a header they include.

## Header files

A **header file** (`.h`, sometimes `.hpp`) is where you put declarations that more than one file needs. Then each file `#include`s the header instead of retyping the declarations. You've used headers from day one: `<iostream>` is a header full of declarations for `std::cout` and friends.

### Writing your own

The usual pattern is a **pair of files**: `add.h` declares, and `add.cpp` defines:

```cpp title="add.h"
#ifndef ADD_H
#define ADD_H

int add(int x, int y);

#endif
```

```cpp title="add.cpp"
#include "add.h"

int add(int x, int y)
{
    return x + y;
}
```

```cpp title="main.cpp"
#include "add.h"
#include <iostream>

int main()
{
    std::cout << add(2, 3) << '\n';
    return 0;
}
```

```bash title="terminal"
g++ main.cpp add.cpp -o app
```

```output title="Output of ./app"
5
```

(The `#ifndef ADD_H` lines are a **header guard**, explained below. Every header should have one.)

![add.h is included by both .cpp files; each is compiled on its own, and the linker joins them.](diagram:header-structure)

Notice what's **not** in the command: `add.h`. Headers are never compiled on their own. They're pasted into the `.cpp` files that include them.

### Why add.cpp includes its own header

`add.cpp` doesn't _need_ `add.h` to compile, since it contains the definition itself. But including it lets the compiler **check that the two agree**. If someone changes the definition's return type and forgets the header, the mismatch is caught straight away:

```output title="Compiler output (GCC), add.cpp defining double add(int, int)"
add.cpp:3:8: error: ambiguating new declaration of 'double add(int, int)'
add.h:4:5: note: old declaration 'int add(int, int)'
```

Without that include, nothing would catch the mismatch. A function's return type isn't part of the name the linker matches, so `main.cpp`, still using the old `int` declaration, would link without complaint, and the call would be undefined behavior at run time.

### Quotes or angle brackets

- `#include "add.h"` with **quotes** is for **your own** headers. The preprocessor looks in the current file's folder first, then the include paths.
- `#include <iostream>` with **angle brackets** is for headers from the **standard library** and **other libraries**. The preprocessor only searches the system and configured include paths.

Standard headers like `<iostream>` have no `.h`. The pre-standard versions were called `iostream.h`, and when the standard put everything into `std`, new names without `.h` were chosen so old code kept working. The C library headers follow the same pattern: use `<cmath>` and `<cstdio>`, not `<math.h>` and `<stdio.h>`.

### Headers in other folders

When headers live in another folder, don't write paths like `#include "../../lib/math/add.h"`. They break the moment a file moves. Tell the compiler where to look instead: `g++ -I lib/math main.cpp` (or the IDE's _Include Directories_ setting), then just `#include "add.h"`.

### What to include, and in what order

**Each file should include what _it_ uses.** If `main.cpp` uses `std::string`, it should `#include <string>` itself, even if some other header happens to include it already. Those indirect **transitive includes** can disappear when that other header changes, and your file suddenly stops compiling.

A good order for the includes at the top of a `.cpp` file:

1. its own paired header (`"add.h"` in `add.cpp`);
2. other headers from your project;
3. third-party library headers;
4. standard library headers.

Putting the paired header first means that if `add.h` forgot to include something it needs, the error shows up in `add.cpp`, right where you can fix it.

### Keep definitions out of headers

A header gets pasted into every `.cpp` that includes it. Put a function **definition** in a header, include it in two `.cpp` files, and the program now defines that function twice. That breaks ODR part 2, and the linker fails, even with a header guard:

```output title="Linker output (GCC, object paths shortened), squareSides() defined in a header included by geometry.cpp and main.cpp"
/usr/bin/ld: main.o: in function `squareSides()':
main.cpp:(.text+0x0): multiple definition of `squareSides()'; geometry.o:geometry.cpp:(.text+0x0): first defined here
collect2: error: ld returned 1 exit status
```

**Headers hold declarations; `.cpp` files hold definitions.** The exceptions are things that can safely be defined in several files: types (like the structs and classes you'll write later), templates, and `inline` functions and variables, which ODR part 3 allows as long as every copy is identical; `constexpr` functions, which are automatically `inline`; and `constexpr` variables, where each `.cpp` file gets its own private copy. Those are exactly what headers are for, and it's why header guards matter.

## Header guards

Even inside **one** `.cpp` file, the same header can end up pasted twice. That happens when a file includes a header directly and also includes another header that includes it:

```cpp title="square.h (no guard)"
int squareSides()
{
    return 4;
}
```

```cpp title="geometry.h"
#include "square.h"

int perimeter(int side);
```

```cpp title="main.cpp"
#include "square.h"
#include "geometry.h"
#include <iostream>

int main()
{
    std::cout << squareSides() << '\n';
    return 0;
}
```

`main.cpp` gets `square.h` once directly, and again through `geometry.h`. The definition appears twice in one translation unit, which breaks ODR part 1:

```output title="Compiler output (GCC)"
square.h:1:5: error: redefinition of 'int squareSides()'
square.h:1:5: note: 'int squareSides()' previously defined here
```

A **header guard** makes a header's contents count only once per translation unit:

```cpp title="square.h (with a guard)"
#ifndef SQUARE_H
#define SQUARE_H

int squareSides()
{
    return 4;
}

#endif
```

The first time it's included, `SQUARE_H` isn't defined yet, so the preprocessor defines it and keeps the contents. The second time, `SQUARE_H` is already defined, so everything up to `#endif` is skipped. With that change, the program above compiles and prints `4`.

![The first #include defines the guard macro and keeps the contents; any later #include in the same file skips them.](diagram:header-guard-flow)

- **Name the guard after the file**, in capitals: `square.h` becomes `SQUARE_H`. Big projects make the names more unique, such as `MYGAME_GEOMETRY_SQUARE_H`, so two `square.h` files in different folders don't share a guard.
- **Guards work per translation unit.** They stop double pasting _within_ one `.cpp` file, but each `.cpp` file still gets its own copy. That's why a guard can't fix the "multiple definition" link error above: the only fix for that is to keep definitions out of headers.

### #pragma once

Many projects use a shorter alternative:

```cpp title="square.h (with #pragma once)"
#pragma once

int squareSides()
{
    return 4;
}
```

`#pragma once` asks the compiler itself to include the file only once per translation unit. It's shorter, and you can't get a guard name wrong. Every major compiler (GCC, Clang, MSVC) supports it, but it isn't part of the C++ standard, and in rare setups, such as the same file reachable through two different paths, it can be fooled. Both styles are fine. Pick one and use it in every header.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What does the preprocessor do, and what is a translation unit?**
> - **What's the difference between `#include "x.h"` and `#include <x.h>`?**
> - **Why shouldn't you define functions in a header?** And which things _can_ go in headers?
> - **What problem do header guards solve, and what problem don't they solve?** They stop double inclusion within one file, not duplicate definitions across files.
> - **`#pragma once` vs `#ifndef` guards?**
> - **What's wrong with `#define SQUARE(x) x * x`?** It does text substitution, so `SQUARE(2 + 3)` gives 11.
