---
subtopic: Variables and initialization
published: 2026-10-08
summary:
  - An object is a piece of memory that holds a value. A variable is an object with a name.
  - Defining a variable (int apples;) fixes its type and name. Memory is reserved when that line runs.
  - Assignment (=) replaces a variable's value. Initialization gives it a value the moment it's created.
  - "Prefer brace initialization: int count{5}; or int count{}; for zero. It rejects narrowing such as int x{4.7};"
  - "Initialize every variable. Watch for int a, b = 5;, which initializes only b."
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-objects-and-variables/
  - https://www.learncpp.com/cpp-tutorial/variable-assignment-and-initialization/
---

Programs exist to work with **data**: scores, prices, names, positions. Variables are how C++ stores that data and lets you refer to it by name. This page covers where values actually live, how to create a variable, and the many ways to give one a value, along with the one way you should use by default.

## Values, and where they live

A **value** is a single piece of data: the number `5`, the letter `'A'`, the text `"hello"`, the number `3.14`. A value written straight into your code, like the `5` in `apples = 5;`, is called a **literal**.

While a program runs, its data lives in **RAM** (memory). Think of RAM as a very long row of numbered boxes. Each box holds one **byte**, and its number is its **address**. Reading and writing data means reading and writing those boxes.

## Objects and variables

Working with raw addresses ("put 5 in box 1000") would be miserable, so C++ gives you **objects**. An object is a region of memory that holds a value. The compiler decides _where_ it goes; you just use it.

An object with a **name** is a **variable**. The name, its **identifier**, is how you refer to it:

![A variable is a named object: a few bytes of memory the compiler sets aside, which you use by name instead of by address.](diagram:memory-and-variables)

> [!NOTE]
> "Object" here is the C++ meaning: _any_ piece of memory holding a value, even a single `int`. It's not the same as an object in object-oriented programming, which you'll meet in **Classes & Objects**.

## Defining a variable

You create a variable with a **definition**, which gives it a type and a name:

```cpp title="definition.cpp"
int apples; // a variable called apples, which holds an int
```

Two things happen at two different times:

- **When you compile:** the compiler notes that `apples` exists and is an `int`. It knows how much memory that needs, and checks that you only use `apples` in ways that make sense for an `int`.
- **When the program runs:** when execution reaches this line, memory is actually set aside for `apples`. This is called **allocation**, and the variable is now **instantiated**: it exists, and can be used.

### Data types

The **type** decides what kind of value an object can hold, and how much memory it takes. A few you'll use all the time:

| Type     | Holds                        | Example value  |
| -------- | ---------------------------- | -------------- |
| `int`    | Whole numbers                | `42`, `-7`     |
| `double` | Numbers with a decimal point | `3.14`, `-0.5` |
| `char`   | A single character           | `'A'`          |
| `bool`   | True or false                | `true`         |

A variable's type is fixed when you compile and **never changes**: an `int` stays an `int`. You'll take every type apart in **Data Types, Constants & Strings**.

### Defining several variables at once

Variables of the **same** type can share one definition, separated by commas:

```cpp title="several.cpp"
int width, height; // two ints in one definition
```

Two mistakes come up a lot, and both are compile errors:

```cpp title="several-wrong.cpp"
int width, int height;    // wrong: don't repeat the type
int count, double price;  // wrong: one definition, one type
```

Defining one variable per line is clearer anyway, and gives each one room for a comment:

```cpp title="several-better.cpp"
int width;  // in pixels
int height; // in pixels
```

## Assignment: giving a variable a value

Once a variable exists, the **assignment operator** `=` puts a value into it. This is called **copy assignment**, because the value on the right is copied into the variable on the left:

```cpp title="assignment.cpp"
#include <iostream>

int main()
{
    int apples;  // define it
    apples = 5;  // assign 5
    std::cout << apples << '\n';

    apples = 7;  // assign again: 5 is replaced by 7
    std::cout << apples << '\n';
    return 0;
}
```

```output
5
7
```

A variable holds **one value at a time**. Assigning a new value throws the old one away.

> [!WARNING]
> In C++, `=` means _assign_ and `==` means _is equal to_. Writing `=` when you meant `==` is a classic bug. You saw it in **Setting up the compiler**, where `-Wall` catches it.

## Initialization: a value from the very start

Defining a variable and then assigning to it is two steps, and in between the variable holds garbage. **Initialization** gives a variable its value **at the moment it's created**, in one step. C++ has several ways to write it, for historical reasons:

| Form                           | Example        | What you get                                                |
| ------------------------------ | -------------- | ----------------------------------------------------------- |
| Default-initialization         | `int a;`       | No initializer. For a local `int`, the value is **garbage** |
| Copy-initialization            | `int b = 5;`   | `5`. The style C++ inherited from C                         |
| Direct-initialization          | `int c(5);`    | `5`                                                         |
| **Direct-list-initialization** | `int d{5};`    | `5`. **Use this one**                                       |
| Copy-list-initialization       | `int e = {5};` | `5`. Rarely used                                            |
| Value-initialization           | `int f{};`     | `0`. Empty braces mean zero                                 |

```cpp title="init-forms.cpp"
#include <iostream>

int main()
{
    int a = 5;  // copy-initialization
    int b(6);   // direct-initialization
    int c{7};   // direct-list-initialization: preferred
    int d{};    // value-initialization: d is 0
    std::cout << a << ' ' << b << ' ' << c << ' ' << d << '\n';
    return 0;
}
```

```output
5 6 7 0
```

![Which way to initialize: braces with a value, or empty braces for zero.](diagram:which-initialization)

### Why braces are the best default

**1. They refuse to lose data.** Putting a decimal number into an `int` throws away the fraction, which is called a **narrowing conversion**. The older forms do it silently. Braces make it a compile error:

```cpp title="narrowing.cpp"
#include <iostream>

int main()
{
    int x = 4.7; // compiles, but x quietly becomes 4
    std::cout << x << '\n';

    int y{4.7};  // error: braces don't allow narrowing
    std::cout << y << '\n';
    return 0;
}
```

```output title="Compiler output (GCC)"
narrowing.cpp:8:11: error: narrowing conversion of '4.7000000000000002e+0' from 'double' to 'int' [-Wnarrowing]
```

(The long number is just how GCC writes `4.7` exactly. Decimal numbers are stored in binary, so `4.7` can't be represented perfectly. More on that in **Floating-point numbers and precision**.)

**2. They work almost everywhere.** The same `{ }` syntax initializes plain variables, structs, arrays and objects. The other forms each work only in some places.

**3. They can take several values.** You'll use this for lists and structs later: `std::vector<int> scores{90, 85, 77};`.

> [!TIP]
> Use `{0}` when zero is a meaningful starting value, like a counter that starts at zero. Use `{}` when the value is about to be replaced anyway, like a variable you're about to read input into. Both give `0`; the difference tells the reader what you intend.

**Initialize every variable when you create it.** A variable with no initializer holds whatever happened to be in that memory before, and reading it is one of the most common bugs in C++. The next subtopic, **Uninitialized variables and undefined behavior**, shows how bad it gets.

### Initializing several variables on one line

Each variable needs its own initializer:

```cpp title="several-init.cpp"
int a = 5, b = 6;    // both initialized
int c{7}, d{8};      // both initialized
```

This one is a trap:

```cpp title="trap.cpp"
#include <iostream>

int main()
{
    int a, b = 5; // only b is initialized! a holds garbage
    std::cout << a + b << '\n';
    return 0;
}
```

It looks like both get `5`, but the initializer belongs only to `b`:

![The = 5 applies only to b; a is left holding whatever was in its memory before.](diagram:one-line-trap)

With warnings on, GCC catches it:

```output title="Compiler output (GCC, with -Wall)"
trap.cpp:6:27: warning: 'a' is used uninitialized [-Wuninitialized]
```

It's only a warning, so the program still builds and runs. When we ran it, it printed `797389997`, which is whatever happened to be in `a`'s memory plus 5. Run it again and you may get a different number.

## Unused variables, and [[maybe_unused]]

With `-Wall`, compilers warn about variables you create but never use, since that's often a sign of a typo or unfinished code. With `-Werror` on, the warning stops the build:

```cpp title="unused.cpp"
int main()
{
    int score{10};                 // never used: warning
    [[maybe_unused]] int lives{3}; // never used, on purpose: no warning
    return 0;
}
```

```output title="Compiler output (GCC, with -Wall)"
unused.cpp:3:9: warning: unused variable 'score' [-Wunused-variable]
```

Usually the right fix is to delete the variable, or use it. When a variable really is meant to sit unused, say one that's only read in some build configurations, mark it **`[[maybe_unused]]`** (C++17) to tell the compiler, and the reader, that it's deliberate.

## Assignment vs initialization

|                     | Initialization                                 | Assignment                      |
| ------------------- | ---------------------------------------------- | ------------------------------- |
| When                | As the variable is created                     | Any time after it exists        |
| Syntax              | `int count{5};`                                | `count = 5;`                    |
| How often           | Exactly once per variable                      | As many times as you like       |
| Works for constants | Yes, and it's the only way to give one a value | No: constants can't be assigned |

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What's the difference between an object and a variable?** A variable is a named object.
> - **Initialization vs assignment: what's the difference, and why does it matter?** Constants and references must be initialized, and an uninitialized variable is a bug waiting to happen.
> - **Why prefer `int x{5};` over `int x = 5;`?** Braces reject narrowing conversions and work consistently everywhere.
> - **What value does `int x{};` hold?** `0`. What about `int x;`? An indeterminate value, and reading it is undefined behaviour.
> - **What's wrong with `int a, b = 5;`?**
