---
subtopic: Functions, return values and parameters
published: 2026-10-08
summary:
  - A function is a named, reusable block of statements. Calling it pauses the caller, runs the function, then picks up right after the call.
  - The return type says what comes back. return sends one value back to the caller, and void means nothing comes back.
  - A non-void function must return a value on every path, or it's undefined behavior. main is the exception, since it returns 0 if you leave it out.
  - Parameters are the function's inputs, declared in its header. Arguments are the values passed in a call, and each parameter gets a copy (pass by value).
  - Because parameters are copies, changing one inside a function never changes the caller's variable.
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-functions/
  - https://www.learncpp.com/cpp-tutorial/function-return-values-value-returning-functions/
  - https://www.learncpp.com/cpp-tutorial/void-functions-non-value-returning-functions/
  - https://www.learncpp.com/cpp-tutorial/introduction-to-function-parameters-and-arguments/
---

Every program so far has lived inside one function, `main`. That stops working fast: real programs do hundreds of different jobs, and some of them many times over. **Functions** let you package a job under a name, give it inputs, get a result back, and use it as often as you like. This page covers defining and calling functions, returning values, `void` functions, and parameters.

## What a function is

A **function** is a named, reusable sequence of statements that does one job. You've already written one, `main`, and used some written by others: every `std::cout <<` and `std::cin >>` calls a standard library function behind the scenes. Writing your own pays off quickly:

- **Organization.** A big program becomes small, named pieces you can understand one at a time.
- **Reuse.** Write a job once, then use it anywhere. This is the **DRY** principle: _Don't Repeat Yourself_. Duplicated code means duplicated bugs, and duplicated fixes.
- **Testing.** A small function can be checked on its own before you rely on it.

## Defining and calling a function

```cpp title="greet.cpp"
#include <iostream>

void greet() // the function header
{            // the function body starts
    std::cout << "Hello!\n";
}            // the function body ends

int main()
{
    std::cout << "Before\n";
    greet(); // call it
    greet(); // and again
    std::cout << "After\n";
    return 0;
}
```

```output
Before
Hello!
Hello!
After
```

A **definition** has two parts:

- **The header:** the return type (`void` here, meaning "returns nothing"), the name `greet`, and parentheses `()`, which hold the parameters (none yet).
- **The body:** the statements between `{` and `}`.

You **call** a function by writing its name followed by parentheses: `greet();`. When the call runs, the calling function, the **caller**, pauses at that line as if you'd put in a bookmark. Control jumps to the **callee** (`greet`), which runs its body top to bottom. Then control returns to the bookmark, and the caller continues from the very next statement.

![main pauses at each call, greet runs, and execution returns to just after the call.](diagram:call-flow)

### A few rules

**Define it before you call it.** The compiler reads a file top to bottom, so a call to a function it hasn't seen yet is an error:

```cpp title="too-early.cpp"
#include <iostream>

int main()
{
    greet(); // greet hasn't been seen yet
    return 0;
}

void greet()
{
    std::cout << "Hello!\n";
}
```

```output title="Compiler output (GCC)"
too-early.cpp:5:5: error: 'greet' was not declared in this scope
```

Moving `greet` above `main` fixes it. **Forward declarations and multiple files** shows a way to call functions defined further down, or in other files.

**Functions can call functions.** `main` calls `greet`, `greet` could call `printLine`, and so on. Each call returns to its own caller.

**Functions can't be defined inside other functions.** Every function definition sits at the outermost level of the file:

```output title="Compiler output (GCC), for a function defined inside main"
error: a function-definition is not allowed here before '{' token
```

> [!NOTE]
> In examples and documentation you'll often see the names `foo` and `bar`. They're placeholder names, used when the name doesn't matter. Real code should always use descriptive names.

## Returning a value

A function can send a value back to its caller. The **return type** before the name says what type of value. A **`return` statement** says which value, and ends the function:

```cpp title="read-number.cpp"
#include <iostream>

int readNumber() // returns an int
{
    std::cout << "Enter a number: ";
    int n{};
    std::cin >> n;
    return n; // send n's value back to the caller
}

int main()
{
    int x{readNumber()}; // the call is replaced by the value it returns
    std::cout << x << " doubled is " << x * 2 << '\n';

    int y{readNumber()}; // reuse: no duplicated code
    std::cout << "Their sum is " << x + y << '\n';
    return 0;
}
```

```output title="terminal"
Enter a number: 4
4 doubled is 8
Enter a number: 10
Their sum is 14
```

A function call is an expression: it **evaluates to the value the function returns**. So `readNumber()` can go anywhere an `int` is expected: in an initializer, in a calculation, or passed straight to `std::cout`.

The value is **returned by value**: a copy of it goes back to the caller. The variable `n` disappears when `readNumber` ends, but the copy of its value lives on in `x`.

A function returns **exactly one value** per call. Ways to return several values together, like a `struct` or `std::pair`, come later.

### Every path must return

If a function's return type isn't `void`, it **must** reach a `return` with a value **every** time it runs. Falling off the end is **undefined behavior**: the caller gets garbage, or worse. Here, a negative `x` reaches the end without returning anything:

```cpp title="missing-return.cpp"
int getValue(int x)
{
    if (x > 0)
        return x;
}

int main()
{
    return getValue(1);
}
```

```output title="Compiler output (GCC, with -Wall)"
missing-return.cpp:5:1: warning: control reaches end of non-void function [-Wreturn-type]
```

It's only a warning by default, which is one more reason to compile with `-Werror`.

### main's return value

`main` is special:

- It **must** return `int`, and you never call it yourself; the operating system does.
- Its return value is the program's **status code**: `0` means success, anything else means failure. `<cstdlib>` defines `EXIT_SUCCESS` and `EXIT_FAILURE`, if you prefer names to numbers.
- It's the **only** function allowed to skip its `return`. If `main` ends without one, it returns `0` automatically. Writing `return 0;` anyway makes the intent clear.

You saw status codes from the outside in **Compiling from the command line**, with `echo $?`.

## void functions: nothing to return

A function that does a job without producing a value has the return type **`void`**. It returns to its caller automatically when it reaches the closing brace. You can still use a bare `return;` to **leave early**:

```cpp title="early-return.cpp"
#include <iostream>

void printIfPositive(int x)
{
    if (x <= 0)
        return; // nothing to print: leave now
    std::cout << x << " is positive\n";
}

int main()
{
    printIfPositive(5);
    printIfPositive(-3);
    return 0;
}
```

```output
5 is positive
```

Don't put a `return;` at the very end of a `void` function. It's already about to return, so it just adds noise.

Two mistakes are compile errors, because `void` really does mean _no value_:

```output title="Compiler output (GCC), for int x{greet()}; where greet is void"
error: void value not ignored as it ought to be
```

```output title="Compiler output (GCC), for return 5; inside a void function"
error: return-statement with a value, in function returning 'void' [-fpermissive]
```

## Parameters and arguments

So far, functions couldn't receive any input from their caller. **Parameters** fix that. They're variables declared inside the header's parentheses, and the caller supplies their values, the **arguments**, in the call:

```cpp title="add.cpp"
#include <iostream>

int add(int a, int b) // a and b are parameters
{
    return a + b;
}

int main()
{
    std::cout << add(2, 3) << '\n';        // 2 and 3 are arguments
    std::cout << add(10, add(1, 1)) << '\n'; // an argument can be any expression
    return 0;
}
```

```output
5
12
```

![The anatomy of a function, and how a call's arguments become its parameters.](diagram:function-anatomy)

- **Parameter:** the variable in the function's header (`a`, `b`).
- **Argument:** the value passed in at a call (`2`, `3`).

When the call runs, each parameter is created and **initialized with a copy of its argument**, matched by position: `a` gets `2` and `b` gets `3`. Arguments can be any expressions, including other function calls. `add(10, add(1, 1))` evaluates the inner call first, then passes its result `2` along.

The number of arguments must match the number of parameters:

```output title="Compiler output (GCC), for add(2)"
error: too few arguments to function 'int add(int, int)'
```

### Pass by value: parameters are copies

Copying arguments into parameters is called **pass by value**, and it has an important consequence: **changing a parameter doesn't change the caller's variable**.

```cpp title="pass-by-value.cpp"
#include <iostream>

void addOne(int n)
{
    n = n + 1; // changes the copy only
    std::cout << "inside:  " << n << '\n';
}

int main()
{
    int score{10};
    addOne(score);
    std::cout << "outside: " << score << '\n';
    return 0;
}
```

```output
inside:  11
outside: 10
```

![score's value is copied into n; addOne changes the copy, and score is untouched.](diagram:pass-by-value)

That's usually what you want: a function can't accidentally damage your data. When a function _should_ change the caller's variable, or the copy would be expensive, C++ has **references**, covered in **Pass by reference**.

### Parameters you don't use

A parameter that the body never uses gets a warning with `-Wall -Wextra` (in GCC, `-Wextra` alone isn't enough). That's often a sign of a bug:

```cpp title="unused-parameter.cpp"
#include <iostream>

void printScore(int score, int attempts)
{
    std::cout << score << '\n';
}

int main()
{
    printScore(90, 3);
    return 0;
}
```

```output title="Compiler output (GCC, with -Wall -Wextra)"
unused-parameter.cpp:3:32: warning: unused parameter 'attempts' [-Wunused-parameter]
```

If the parameter really has to be there but isn't needed, which happens when a function must match a fixed shape, you can **leave out its name**: `void printScore(int score, int /*attempts*/)`. The comment keeps the meaning, and the compiler stops warning.

## Putting it together

```cpp title="average.cpp"
#include <iostream>

int readNumber()
{
    std::cout << "Enter a number: ";
    int n{};
    std::cin >> n;
    return n;
}

double average(int a, int b)
{
    return (a + b) / 2.0; // 2.0, not 2, to keep the fraction
}

void printResult(double value)
{
    std::cout << "The average is " << value << '\n';
}

int main()
{
    int first{readNumber()};
    int second{readNumber()};
    printResult(average(first, second));
    return 0;
}
```

```output title="terminal"
Enter a number: 7
Enter a number: 8
The average is 7.5
```

Each function has one job, and `main` reads almost like a plain description of the program.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **Parameter vs argument:** what's the difference?
> - **What is pass by value?** What happens to the caller's variable if the function changes its parameter?
> - **What happens if a non-void function doesn't return a value?** Undefined behavior. Which function is the exception? `main`.
> - **Can a function return more than one value?** Not directly. You'd use a struct, `std::pair`/`std::tuple`, or output parameters.
> - **Can you define a function inside another function?** No, though lambdas, which you'll meet later, come close.
