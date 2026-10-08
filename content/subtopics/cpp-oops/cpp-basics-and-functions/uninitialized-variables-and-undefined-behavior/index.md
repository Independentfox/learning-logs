---
subtopic: Uninitialized variables and undefined behavior
published: 2026-10-08
summary:
  - A local variable with no initializer holds garbage, whatever bits were already in that memory. C++ doesn't zero it for you.
  - Reading an uninitialized variable is undefined behavior (UB). The C++ standard places no rules on what happens next.
  - UB can crash, print nonsense, look fine, or change with the compiler or flags. Compilers assume UB never happens and optimize on that basis.
  - Implementation-defined behavior is a documented choice each compiler makes. Unspecified behavior is a choice it doesn't have to document.
  - Initialize every variable, keep warnings on, and use -fsanitize=undefined,address while developing.
sources:
  - https://www.learncpp.com/cpp-tutorial/uninitialized-variables-and-undefined-behavior/
---

Most languages protect you from reading a variable you never set: they either refuse to compile, or quietly give it a default like `0`. C++ does neither. This page shows what really happens when you read one, and introduces the most important idea for writing safe C++: **undefined behavior**.

## Uninitialized variables

A local variable defined without an initializer is **uninitialized**. It gets a piece of memory, and that memory still holds whatever bits the last user left there. C++ doesn't clear it, so the variable starts out holding **garbage**.

| Term              | Meaning                                  | Example                       |
| ----------------- | ---------------------------------------- | ----------------------------- |
| **Initialized**   | Given a known value when it was defined  | `int score{10};`              |
| **Assigned**      | Given a known value after it was defined | `int score; score = 10;`      |
| **Uninitialized** | Never given a known value at all         | `int score;` and nothing else |

Why doesn't C++ just set it to zero? Speed. Zeroing memory costs time, C++ grew up when that cost mattered, and the language's rule is that you don't pay for what you don't ask for. If you're about to read input into a variable, zeroing it first would be wasted work. So the language leaves it to you, and the rule for you is simple: **always initialize**.

### What reading one actually does

```cpp title="garbage.cpp"
#include <iostream>

int main()
{
    int x; // no initializer: x holds garbage
    std::cout << x << '\n'; // reads garbage: undefined behavior
    return 0;
}
```

We ran this one program with different compilers and settings, and got four different answers:

| Built with                 | Printed                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| GCC, no optimization       | `32765`                                                                      |
| GCC, `-O2`                 | `0`                                                                          |
| Clang, `-O2`               | `-1433509784`                                                                |
| Visual Studio, Debug build | typically `-858993460` (Debug builds fill fresh memory with the byte `0xCC`) |

![One program, four builds, four different numbers: an uninitialized read gives whatever the memory and optimizer happen to produce.](diagram:garbage-values)

The `0` is the dangerous one. It looks like a sensible default, so a bug can hide for months, until a different compiler or setting turns it into nonsense.

Compilers can usually spot the simple cases, if you've turned warnings on:

```output title="Compiler output (GCC, with -Wall)"
garbage.cpp:6:23: warning: 'x' is used uninitialized [-Wuninitialized]
```

```output title="Compiler output (Clang, with -Wall)"
garbage.cpp:6:18: warning: variable 'x' is uninitialized when used here [-Wuninitialized]
garbage.cpp:5:10: note: initialize the variable 'x' to silence this warning
```

They can't catch every case, though. Once a value travels through functions, pointers or loops, the warning often disappears. Initializing every variable is the only sure fix.

## Undefined behavior

Reading an uninitialized variable is one example of **undefined behavior** (**UB**): code whose result the C++ standard simply doesn't define. It's not an error the compiler must report, and it's not "random". It means **there are no rules at all** about what happens. A program with UB might:

- print a different value on every run;
- print the right answer, on your machine, today;
- crash, either immediately or much later somewhere unrelated;
- behave differently with another compiler, another flag such as `-O2`, or after an unrelated change;
- do something that seems logically impossible.

That last one is real, and it's the key to understanding UB. **The compiler is allowed to assume your program never has undefined behavior**, and it optimizes based on that. Here's signed integer overflow, another kind of UB:

```cpp title="ub.cpp"
#include <iostream>

int main()
{
    int x{};
    std::cin >> x;            // enter 2147483647, the largest int
    int y{x + 1};             // signed overflow: undefined behavior
    std::cout << y << '\n';
    std::cout << (x + 1 > x) << '\n';
    return 0;
}
```

```output title="Output (GCC and Clang, input 2147483647)"
-2147483648
1
```

Read that output carefully. The first line shows `x + 1` came out _negative_: the addition wrapped around. The second line says `x + 1 > x` is `1`, which means **true**. Both lines describe the same `x + 1`, and they contradict each other.

Here's why. Signed overflow is UB, so the compiler may assume it never happens. And if it never happens, `x + 1 > x` is always true. So the compiler replaced the whole comparison with `true` before the program even ran. Meanwhile the actual addition on the line above did wrap around on the hardware. Both lines are "correct" under the assumption that overflow can't happen, and that assumption is false here.

![The compiler reasons from "overflow never happens" and decides x + 1 > x is always true, while at run time the addition wraps.](diagram:compiler-assumes)

### Catching UB with sanitizers

You can't see UB by reading the output. It may look fine. Instead, have the compiler add checks. **Sanitizers** are compiler options that instrument your program and report UB the moment it happens:

```bash title="terminal"
g++ -std=c++20 -g -fsanitize=undefined,address ub.cpp -o ub
```

```output title="Output with -fsanitize=undefined"
ub.cpp:7:9: runtime error: signed integer overflow: 2147483647 + 1 cannot be represented in type 'int'
```

`-fsanitize=undefined` (UBSan) catches overflow, division by zero, bad shifts and more. `-fsanitize=address` (ASan) catches out-of-bounds memory access and use after delete. Turn them on while you develop and test. You'll learn them properly in **AddressSanitizer and UBSan**.

### Common sources of undefined behavior

| What you do                                                   | Covered in                      |
| ------------------------------------------------------------- | ------------------------------- |
| Read an uninitialized variable                                | Here                            |
| Overflow a signed integer (`int`, `long`…)                    | Signed integers and overflow    |
| Divide an integer by zero                                     | Arithmetic and integer division |
| Access an array outside its bounds                            | std::vector & Arrays            |
| Dereference a null or dangling pointer                        | References & Pointers           |
| Use an object after it's been destroyed or deleted            | Dynamic Allocation              |
| Modify a `const` object by casting away `const`               | const_cast and reinterpret_cast |
| Two threads writing the same variable without synchronization | Modern C++ (11–23)              |

## Implementation-defined and unspecified behavior

Not everything the standard leaves open is UB. There are two milder cases.

**Implementation-defined behavior.** The standard lets each compiler choose, but the compiler must **document** its choice and stick to it. For example, `sizeof(int)` is 4 on every mainstream desktop compiler today, but the standard only guarantees at least 2. Whether plain `char` is signed or unsigned also varies: it's signed on most x86 systems and unsigned on many ARM Linux systems.

**Unspecified behavior.** The compiler chooses from a set of allowed outcomes, but doesn't have to document which, and may even choose differently in different places. The classic example is the order in which a function's arguments are evaluated:

```cpp title="order.cpp"
#include <iostream>

int first()  { std::cout << "first ";  return 1; }
int second() { std::cout << "second "; return 2; }

int add(int a, int b) { return a + b; }

int main()
{
    std::cout << add(first(), second()) << '\n';
    return 0;
}
```

```output title="GCC"
second first 3
```

```output title="Clang"
first second 3
```

Both compilers are correct. The sum is always `3`, but which function runs first isn't specified. Code that depends on the order works on one compiler and silently breaks on another.

![How much the C++ standard promises, from fully defined to undefined.](diagram:behavior-spectrum)

|                        | Who decides                 | Documented?          | Safe to rely on?                     |
| ---------------------- | --------------------------- | -------------------- | ------------------------------------ |
| Defined                | The standard                | Yes, in the standard | Yes                                  |
| Implementation-defined | Each compiler               | Yes, by the compiler | Only if you target one compiler      |
| Unspecified            | Each compiler, case by case | No                   | No: write code that works either way |
| **Undefined**          | Nobody                      | No                   | **Never**                            |

## How to stay out of trouble

> [!IMPORTANT]
>
> - **Initialize every variable** when you define it. `int x{};` costs nothing in practice.
> - **Keep warnings on**: `-Wall -Wextra`, and `-Werror` while learning.
> - **Develop with sanitizers**: `-fsanitize=undefined,address`.
> - **Don't rely on** a particular compiler's choices unless you mean to, such as the size of `int` or the order arguments are evaluated in.
> - If something "works on my machine" but not elsewhere, **suspect undefined behavior first**.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What value does an uninitialized local `int` have?** None you can rely on. Reading it is undefined behavior.
> - **What is undefined behavior, and why is it dangerous even when the program seems to work?**
> - **Why can the compiler turn `x + 1 > x` into `true`?** Signed overflow is UB, so it's allowed to assume overflow never happens.
> - **Undefined vs unspecified vs implementation-defined behavior:** give an example of each.
> - **How would you find UB in a program?** Warnings, sanitizers, Valgrind, and code review.
