---
subtopic: Syntax errors vs semantic errors
published: 2026-10-19
summary:
  - A syntax error breaks the grammar of C++. The compiler stops and tells you where.
  - A semantic error is grammatically fine code that means the wrong thing. Some the compiler catches, many it can't.
  - The ones it can't catch show up when the program runs, as wrong output, a crash or behavior that changes from run to run.
  - Warnings catch some of these early. Clang's -Wunreachable-code, for example, flags code after a return that GCC lets through silently.
  - Debugging is mostly about the semantic errors the compiler couldn't see.
sources:
  - https://www.learncpp.com/cpp-tutorial/syntax-and-semantic-errors/
---

Every bug you'll write falls into one of two buckets. Either the code isn't valid C++ at all, or it's valid C++ that doesn't do what you meant. The first kind is annoying for a minute. The second kind is what this whole topic is about.

## Syntax errors

A **syntax error** means the code breaks the grammar of the language: a missing semicolon, a brace that never closes, a quote that never ends. You've already met a few of these in **Statements and program structure**.

They're the friendly kind of mistake. The compiler refuses to build the program, points at a line, and tells you roughly what it expected. You fix it and compile again. The only real trap is that the reported line is sometimes _after_ the actual mistake, because the compiler only notices something is wrong when the next piece doesn't fit.

## Semantic errors

A **semantic error** is code that is grammatically fine but means something wrong. "Semantic" just means "to do with meaning". These come in two flavors, depending on whether the compiler can spot them.

### The ones the compiler still catches

Some meanings are simply impossible, and the compiler knows enough to reject them. Putting text into an `int`:

```cpp title="wrong-type.cpp"
int main()
{
    int total{"ten"};
    return 0;
}
```

```output title="Compiler output (GCC)"
wrong-type.cpp:3:15: error: invalid conversion from 'const char*' to 'int' [-fpermissive]
```

Or trying to assign to something that can't be changed. A literal like `5` isn't a variable you can store into:

```cpp title="assign-to-literal.cpp"
int main()
{
    int x{};
    5 = x;
    return 0;
}
```

```output title="Compiler output (GCC)"
assign-to-literal.cpp:4:5: error: lvalue required as left operand of assignment
```

(An _lvalue_ is, roughly, an expression that refers to an object in memory, such as a variable. A literal isn't one. You'll see the term properly in **Value categories: lvalues and rvalues**.) Using a name that was never declared, which you saw in **Forward declarations and multiple files**, belongs here too.

These feel like syntax errors when you hit them, since the build stops either way. The difference is that the grammar was fine. It was the meaning that didn't hold up.

### The ones it can't

Then there are programs that compile cleanly and are still wrong. The compiler has no idea what you _intended_, so it can't tell you that you got it wrong. Here's one that looks perfectly reasonable:

```cpp title="average.cpp"
#include <iostream>

int average(int a, int b)
{
    return (a + b) / 2;
}

int main()
{
    std::cout << average(3, 4) << '\n';
    return 0;
}
```

```output
3
```

The average of 3 and 4 is 3.5, but the program says 3. Both values are integers, so the division throws away the fraction. Nothing is broken from C++'s point of view. It did exactly what the code says, and the code says the wrong thing.

Some other common shapes these bugs take:

- The wrong operator, like `-` where you meant `+`, or `<` where you meant `<=`.
- Reading a variable before it has a value, which is undefined behavior (see **Uninitialized variables and undefined behavior**).
- Dividing by a value that turns out to be zero.
- Code that can never run because a `return` comes before it.

The division one can do worse than give a wrong answer. If `people` is read from the user and they type `0`, on Linux the program dies:

```cpp title="divide.cpp"
#include <iostream>

int main()
{
    int items{12};
    int people{};
    std::cin >> people;
    std::cout << items / people << '\n';
    return 0;
}
```

```output title="Output (GCC on Linux, run on Compiler Explorer, input 0)"
Program terminated with signal SIGFPE (8)
```

On Linux an integer division by zero kills the process with the signal `SIGFPE`. Your terminal usually shows it as `Floating point exception`, which is a confusing name, since no floating-point numbers are involved. The C++ standard itself just calls it undefined behavior, so other platforms can behave differently. On an Apple Silicon Mac, the same program doesn't crash at all. ARM's divide instruction quietly gives 0, so it prints `0` and carries on, which is arguably worse.

![Where each kind of error gets caught: syntax and some semantic errors at compile time, the rest only when the program runs.](diagram:error-kinds)

## Warnings help with some of the second kind

The compiler can't read your mind, but it can notice patterns that are _usually_ mistakes, and warn about them. That's the main reason **Setting up the compiler** turned warnings up so far.

Code after a `return` is a good example. This compiles, and the message never prints:

```cpp title="unreachable.cpp"
#include <iostream>

int discount(int price)
{
    return price;
    std::cout << "applying discount\n"; // never runs
}

int main()
{
    std::cout << discount(100) << '\n';
    return 0;
}
```

GCC compiles this without a word, even with `-Wall -Wextra`. Clang has a warning for it, but it isn't in `-Wall` either. You have to ask for it:

```output title="Compiler output (Clang, with -Wunreachable-code)"
unreachable.cpp:6:15: warning: code will never be executed [-Wunreachable-code]
```

So warnings narrow the gap, but they don't close it. Building with more than one compiler now and then, or running a static analyzer (see **Static analysis with clang-tidy**), catches more.

## So where does that leave you?

|                                     | Example                                          | Who finds it | When                              |
| ----------------------------------- | ------------------------------------------------ | ------------ | --------------------------------- |
| Syntax error                        | Missing `;` or `}`                               | The compiler | Compile time                      |
| Semantic error the compiler can see | Text into an `int`, assigning to `5`             | The compiler | Compile time                      |
| Semantic error it can't see         | Integer division, wrong operator, divide by zero | You          | When you run and test the program |

The first two rows are the easy part. The compiler hands you a file, a line and a message, and you fix it. The last row is where the time goes. The program runs, it just does the wrong thing, and nothing tells you where. The rest of this topic is about finding those: thinking about the problem systematically, adding print statements, stepping through the code in a debugger, and using tools that spot bugs you'd never find by reading.

## If it comes up in an interview

You may be asked to explain the difference between a syntax error and a semantic error, and to give an example of a semantic error the compiler catches and one it doesn't. Integer division in an average function is a good one to have ready. A follow-up is often "how would you find a bug that doesn't cause a compile error?", which is exactly what the next few pages answer.
