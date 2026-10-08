---
subtopic: Forward declarations and multiple files
published: 2026-10-08
summary:
  - The compiler reads top to bottom, so a name must be declared before it's used. A forward declaration (a function's header plus ;) promises that it exists.
  - A declaration says a thing exists. A definition makes it, with a body or storage. Every definition is also a declaration.
  - "The One Definition Rule has three parts: one definition per file (or a compile error), one per program (or a link error), and identical type, template and inline definitions across files."
  - Each .cpp file is compiled on its own, knowing nothing about the others, so a file must declare every function it uses from elsewhere.
  - No declaration means a compile error. A declaration with no definition anywhere, or a file left out of the build, means a link error.
sources:
  - https://www.learncpp.com/cpp-tutorial/forward-declarations/
  - https://www.learncpp.com/cpp-tutorial/programs-with-multiple-code-files/
---

In **Functions, return values and parameters** you hit a rule: define a function _before_ you call it. That works for small programs, but it breaks down when functions call each other, and it can't work at all once your program is split across several files. The fix is the **forward declaration**, and understanding it means understanding the difference between _declaring_ something and _defining_ it.

## The problem: the compiler reads top to bottom

The compiler processes a file from top to bottom. When it meets a call, it must already know that the function exists, and what arguments and return type it has. Moving functions above their callers works sometimes, but not when two functions call **each other**. Here `isEven` calls `isOdd` and `isOdd` calls `isEven`, so whichever comes first can't see the other:

```output title="Compiler output (GCC), without forward declarations"
error: 'isOdd' was not declared in this scope
```

## Forward declarations

A **forward declaration** tells the compiler that a function exists before you define it. It's the function's header followed by a semicolon, with no body:

```cpp title="mutual.cpp"
#include <iostream>

bool isEven(int n); // forward declarations let each function
bool isOdd(int n);  // call the other, whichever is defined first

bool isEven(int n)
{
    if (n == 0)
        return true;
    return isOdd(n - 1);
}

bool isOdd(int n)
{
    if (n == 0)
        return false;
    return isEven(n - 1);
}

int main()
{
    std::cout << isEven(4) << ' ' << isOdd(4) << '\n';
    return 0;
}
```

```output
1 0
```

A forward declaration of a function is also called a **function prototype**. It gives the compiler everything it needs to check a call: the name, the parameter types and the return type. The body can come later in the file, or in another file entirely.

Parameter **names** are optional in a declaration (`bool isEven(int);` is valid), but include them anyway. They document what each parameter means, and editors show them as hints when you type a call.

> [!WARNING]
> A forward declaration is a _promise_ that a definition exists somewhere. If you call the function and never keep the promise, everything compiles, but the **linker** fails with `undefined reference`. You saw that error in **From source code to a running program**.

## Declarations vs definitions

These two words come up constantly in C++:

- A **declaration** introduces a name and tells the compiler what it is, for example _"`add` is a function taking two `int`s and returning an `int`."_
- A **definition** actually creates the thing. For a function, that's its **body**. For a variable, it's the memory set aside for it.

![A declaration announces a name; a definition creates the thing it names.](diagram:declaration-vs-definition)

| Code                                      | Declaration? | Definition?                                  |
| ----------------------------------------- | ------------ | -------------------------------------------- |
| `int add(int x, int y);`                  | Yes          | No: there's no body (a **pure declaration**) |
| `int add(int x, int y) { return x + y; }` | Yes          | Yes                                          |
| `int count{0};`                           | Yes          | Yes: memory is set aside                     |

**Every definition is also a declaration**, but not every declaration is a definition. When the compiler only needs to _check a use_, a declaration is enough. Making a program that actually runs needs the definition, somewhere.

## The One Definition Rule

The **One Definition Rule** (**ODR**) says how many definitions you're allowed. It has three parts, each enforced at a different stage:

![The three parts of the One Definition Rule, and what happens when each is broken.](diagram:odr-rules)

**1. Within a file, each function, variable, type or template may be defined only once in a given scope.** Definitions in different scopes don't count, so `main`'s `x` and `add`'s `x` are fine. Break the rule, and the compiler catches it straight away:

```cpp title="redefined.cpp"
int add(int x, int y)
{
    return x + y;
}

int add(int x, int y)
{
    return x + y;
}

int main()
{
    return add(1, 2);
}
```

```output title="Compiler output (GCC)"
redefined.cpp:6:5: error: redefinition of 'int add(int, int)'
redefined.cpp:1:5: note: 'int add(int, int)' previously defined here
```

**2. Within a whole program, a function or variable may be defined only once.** The compiler can't catch this, because it sees one file at a time. The **linker** sees all the object files together, and it does:

```output title="Linker output (GCC, object paths shortened), with add defined in both math.cpp and math2.cpp"
/usr/bin/ld: math2.o: in function `add(int, int)':
math2.cpp:(.text+0x0): multiple definition of `add(int, int)'; math.o:math.cpp:(.text+0x0): first defined here
collect2: error: ld returned 1 exit status
```

**3. Types, templates, inline functions and inline variables may be defined in several files, as long as every definition is identical.** This part exists so headers can hold these definitions (you'll see why in **Preprocessor, headers and header guards**). If the definitions differ between files, nothing is required to catch it, and the result is **undefined behavior**.

## Programs with several files

Real programs are split across many `.cpp` files. Here `math.cpp` defines `add` and `main.cpp` uses it:

```cpp title="math.cpp"
int add(int x, int y)
{
    return x + y;
}
```

```cpp title="main.cpp"
#include <iostream>

int add(int x, int y); // declaration: defined in math.cpp

int main()
{
    std::cout << add(2, 3) << '\n';
    return 0;
}
```

```bash title="terminal"
g++ main.cpp math.cpp -o app
```

```output title="Output of ./app"
5
```

Why does `main.cpp` need that declaration, when `add` is right there in `math.cpp`? Because **the compiler compiles each `.cpp` file on its own, with no knowledge of the others.** It compiles `main.cpp` as if `math.cpp` didn't exist. The declaration is how `main.cpp` learns that `add` exists and what it looks like. The **linker** then connects the call in `main.o` to the definition in `math.o`.

![The compiler sees each file alone, so main.cpp declares add; the linker joins the call to the definition in math.cpp.](diagram:multi-file-declarations)

Take the declaration out of `main.cpp`, and it fails to compile, even though `math.cpp` is in the same build:

```output title="Compiler output (GCC), main.cpp without the declaration"
main.cpp:5:18: error: 'add' was not declared in this scope
```

### Compile errors vs link errors, in multi-file programs

| Mistake                                                    | Which tool complains | Typical message                          |
| ---------------------------------------------------------- | -------------------- | ---------------------------------------- |
| A file uses a function it never declared                   | **Compiler**         | `'add' was not declared in this scope`   |
| It's declared, but the file defining it isn't in the build | **Linker**           | `undefined reference to 'add(int, int)'` |
| It's defined in two files                                  | **Linker**           | `multiple definition of 'add(int, int)'` |

### Adding files to your project

- **Command line:** list every `.cpp` file in the command: `g++ main.cpp math.cpp -o app`.
- **Visual Studio:** right-click **Source Files** → **Add → New Item…** → C++ File. Files added this way are built automatically.
- **Code::Blocks:** **File → New → File… → C/C++ source**, and tick both **Debug** and **Release** when asked which targets to add it to.
- **VS Code:** create the file, then make sure your build task compiles every file, not just the one you have open. For example, use `"${fileDirname}/*.cpp"` instead of `"${file}"` in `tasks.json`.
- **CLion:** add the new file to the `add_executable(...)` line in `CMakeLists.txt`. CLion offers to do this for you.

If a function is "declared but not found" by the linker, the most common cause is a file that exists on disk but isn't part of the build.

### Why files can't see each other

It might seem simpler if the compiler read every file at once, but compiling each file alone is a deliberate design:

- Files can be compiled **in any order**, even in parallel.
- After an edit, **only the changed file** needs recompiling.
- It **reduces accidental name clashes**, because what one file declares isn't visible in another. (Two files _defining_ the same function still clash at link time: that's ODR part 2.)

> [!CAUTION]
> Never `#include` a `.cpp` file to "make the functions visible". Its definitions get copied into the including file, so they end up defined twice: once from the copy and once from the original file. That breaks ODR part 2, and the linker fails. Declarations are the right tool.

Writing the same declarations at the top of every file that needs them is tedious and easy to get wrong. **Header files** solve that, and they're next: **Preprocessor, headers and header guards**.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What's the difference between a declaration and a definition?** Is every definition a declaration?
> - **What is a forward declaration, or function prototype, and why is it needed?**
> - **State the One Definition Rule.** Which violations does the compiler catch, which does the linker catch, and which are undefined behavior?
> - **Why does the compiler need declarations for functions in other files?** It compiles each file separately.
> - **Why is `#include "math.cpp"` a bad idea?**
