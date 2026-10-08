---
subtopic: Local scope and using functions well
published: 2026-10-08
summary:
  - A local variable is defined inside a function, and parameters count too. Every call gets brand-new copies of them.
  - Lifetime is when a variable exists at run time. It's created at its definition and destroyed at the closing brace, in reverse order.
  - Scope is where a name can be used, checked at compile time. A local's name is visible from its definition to the end of its block.
  - Each function's locals are private, so two functions can both have an x without clashing.
  - Give each function one job, separate calculating from printing, and split a function when it gets long or hard to name.
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-local-scope/
  - https://www.learncpp.com/cpp-tutorial/why-functions-are-useful-and-how-to-use-them-effectively/
---

Once a program has more than one function, two questions come up straight away. _Where can each variable be used?_ And _how long does it exist?_ The answers, **scope** and **lifetime**, explain a lot of C++ behavior that otherwise looks mysterious. The second half of this page is about the other big question: how to split a program into functions _well_.

## Local variables

A variable defined inside a function's body is a **local variable**. A function's **parameters** are local variables too: they just get their starting values from the caller.

```cpp title="locals.cpp"
int add(int x, int y) // x and y are local to add
{
    int sum{x + y};   // so is sum
    return sum;
}
```

## Lifetime: when a variable exists

A local variable's **lifetime** starts at its definition, when it's created and initialized. It ends at the **closing brace** of the block it's in, when it's **destroyed**. Locals are destroyed in the **reverse order** they were created, so the last one created is the first one destroyed.

![Locals come into existence at their definitions and are destroyed at the closing brace, last-created first.](diagram:lifetime-timeline)

Lifetime is a **run-time** property: it's about when the program creates and destroys things as it runs. One important consequence is that **every call creates fresh local variables**. Nothing carries over between calls:

```cpp title="fresh-each-call.cpp"
#include <iostream>

void countCall()
{
    int calls{0};       // created anew on every call
    calls = calls + 1;
    std::cout << "calls = " << calls << '\n';
} // calls is destroyed here

int main()
{
    countCall();
    countCall();
    countCall();
    return 0;
}
```

```output
calls = 1
calls = 1
calls = 1
```

If you expected `1`, `2`, `3`, that's the lesson: `calls` is created and set to `0` on every call, then destroyed when the call ends. (A variable that keeps its value between calls is possible, and it's called a **static local variable**. See **Static local variables**.)

For simple types like `int`, "destroyed" just means the memory is no longer reserved and the value can't be used. For class types, destruction can also run cleanup code, which you'll meet with **Destructors**.

## Scope: where a name can be used

An identifier's **scope** is the region of code where it can be used. A local variable has **local scope** (also called **block scope**): its name is usable from its definition to the end of the block that contains it. Outside that region the name is **out of scope**, and using it is a compile error.

Scope is a **compile-time** property: the compiler checks it before the program ever runs. Here `printDouble` tries to use a variable that belongs to `main`:

```cpp title="not-in-scope.cpp"
#include <iostream>

void printDouble()
{
    std::cout << value * 2 << '\n'; // value belongs to main
}

int main()
{
    int value{21};
    printDouble();
    return 0;
}
```

```output title="Compiler output (GCC)"
not-in-scope.cpp:5:18: error: 'value' was not declared in this scope
```

If this compiled, `value` would still exist while `printDouble` runs, because `main` hasn't finished: its lifetime hasn't ended. But its _name_ is only visible inside `main`. To share a value with another function, **pass it as an argument**:

```cpp title="pass-it-in.cpp"
#include <iostream>

void printDouble(int value) // now printDouble has its own value
{
    std::cout << value * 2 << '\n';
}

int main()
{
    int value{21};
    printDouble(value);
    return 0;
}
```

```output
42
```

![Each function's locals are visible only inside that function; data moves between functions through arguments and return values.](diagram:scope-boxes)

### Scope vs lifetime

|                      | Scope                                       | Lifetime                                 |
| -------------------- | ------------------------------------------- | ---------------------------------------- |
| Describes            | Where a **name** can be used                | When an **object** exists                |
| Checked              | At compile time                             | At run time                              |
| For a local variable | From its definition to the end of its block | From its definition until its block ends |

The phrases are easy to mix up, too. A name is **out of scope** wherever it can't be used. An object **goes out of scope** at the moment its block ends, and that's when a local is destroyed.

### Same name, different functions, no conflict

Because each function's locals are private to it, different functions can reuse the same names freely:

```cpp title="same-names.cpp"
#include <iostream>

int add(int x, int y) // add's own x and y
{
    return x + y;
}

int main()
{
    int x{1}; // main's x: a different variable
    int y{2}; // main's y: a different variable
    std::cout << add(y, x) << '\n';
    return 0;
}
```

```output
3
```

`main`'s `x` and `add`'s `x` share a name but nothing else. When `main` calls `add(y, x)`, `add`'s `x` is initialized with `main`'s `y`, which is `2`. The matching names mean nothing to the compiler. Arguments are matched to parameters **by position**, never by name.

### Define locals close to where they're used

Old C code put every variable at the top of a function. In C++, define each variable **as late as possible, right before its first use**, and initialized there. It's easier to read, because the variable sits next to the code that needs it, and it can't be used by mistake before it has a meaningful value.

```cpp title="close-to-use.cpp"
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int first{};  // defined right where it's needed
    std::cin >> first;

    std::cout << "Enter another: ";
    int second{}; // likewise
    std::cin >> second;

    std::cout << first + second << '\n';
    return 0;
}
```

**Parameter or local?** If the caller should supply the starting value, make it a parameter. If the function works the value out itself, make it a local.

### Temporary objects

Some values don't have a name at all. When `getValue()` returns a value, or `a + b` produces one, the result is held in a **temporary object**: an unnamed object that lives only until the end of the full expression it appears in, and is destroyed before the next statement runs. You never refer to temporaries by name, and modern compilers often optimize them away entirely, but they're worth knowing about. They come back in **Temporary objects** and **Copy elision and RVO**.

## Using functions well

Knowing how functions work is half the story. The other half is deciding **where to put the boundaries**.

### Why bother?

- **Organization.** `main` reads like a summary, and each function is small enough to understand on its own.
- **Reuse.** Write a job once and call it anywhere, so there's nothing to copy, paste and get subtly wrong.
- **Testing.** A small function with clear inputs and outputs is easy to check by itself.
- **Easy to change.** Fix or improve a function, and every caller gets the fix.
- **Abstraction.** Callers only need to know a function's name, inputs and output, not how it works. You've been using `std::cout` this way all along.

### Guidelines

1. **Repeated code becomes a function.** If you write the same few statements twice, give them a name.
2. **Look for clear inputs and outputs.** "Given a price and a quantity, produce a total" is a perfect function.
3. **One job per function**, named with a verb that describes it: `readNumber`, `calculateTax`, `printReport`. If the honest name has an "and" in it (`readAndPrintAndSave`), it's doing too much.
4. **Split long functions.** If a function no longer fits on a screen, or is hard to name, break it into smaller ones. Improving code's structure without changing what it does is called **refactoring**.
5. **Separate calculating from printing.** A function that _returns_ a result can be reused anywhere: printed, saved, compared or tested. A function that only _prints_ its result can only ever print.

```cpp title="separate-concerns.cpp"
#include <iostream>

// Less reusable: the result can only ever be printed.
void printArea(int width, int height)
{
    std::cout << width * height << '\n';
}

// More reusable: the caller decides what to do with it.
int area(int width, int height)
{
    return width * height;
}

int main()
{
    printArea(3, 4);
    std::cout << area(3, 4) << '\n';
    std::cout << area(3, 4) + area(5, 6) << '\n'; // printArea can't do this
    return 0;
}
```

```output
12
12
42
```

### A refactor, start to finish

Most simple programs have the same shape: **read input → compute → print output**. Here's a program written all in `main`, with the reading code duplicated:

```cpp title="before.cpp"
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int a{};
    std::cin >> a;
    std::cout << "Enter a number: ";
    int b{};
    std::cin >> b;
    std::cout << "The larger is " << (a > b ? a : b) << '\n';
    return 0;
}
```

And the same program split into functions, one job each:

```cpp title="after.cpp"
#include <iostream>

int readNumber()
{
    std::cout << "Enter a number: ";
    int n{};
    std::cin >> n;
    return n;
}

int larger(int a, int b)
{
    return a > b ? a : b;
}

void printLarger(int value)
{
    std::cout << "The larger is " << value << '\n';
}

int main()
{
    int a{readNumber()};
    int b{readNumber()};
    printLarger(larger(a, b));
    return 0;
}
```

```output title="terminal"
Enter a number: 8
Enter a number: 13
The larger is 13
```

![The same program before and after: one long main, versus input, compute and output functions.](diagram:refactor)

Both versions behave the same. The second is longer, but each piece is obvious, `readNumber` can be reused, and `larger` can be tested on its own. That trade gets better and better as programs grow.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What's the difference between scope and lifetime?** One is about names at compile time, the other about objects at run time.
> - **When is a local variable created and destroyed?** In what order are several destroyed?
> - **Why does a local variable "forget" its value between calls?** And how would you make one remember it? With `static`.
> - **Can two functions have variables with the same name?** Yes. How are arguments matched to parameters? By position.
> - **What makes a function well designed?** One job, a clear name, clear inputs and outputs, and calculation separate from output.
