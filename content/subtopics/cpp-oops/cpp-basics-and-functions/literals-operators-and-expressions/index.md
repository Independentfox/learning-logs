---
subtopic: Literals, operators and expressions
published: 2026-10-08
summary:
  - A literal is a value written straight into the code, like 5, 3.14, 'a', "hi" or true.
  - "An operator computes a result from its operands. Unary operators take one operand, binary take two, and the ternary ?: takes three."
  - Operators return a value, and some also have side effects. = and << return their left operand, which is why a = b = 5 and cout << a << b work.
  - An expression is anything that evaluates to a value. Wherever a value is expected, any expression of the right type can go there.
  - An expression statement (an expression plus ;) runs it and throws the result away, so it only makes sense for its side effects.
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-literals-and-operators/
  - https://www.learncpp.com/cpp-tutorial/introduction-to-expressions/
---

So far you've stored values in variables and printed them. Now it's time to **compute** with them. This page introduces the three building blocks every calculation in C++ is made of: **literals** (fixed values), **operators** (the things that compute), and **expressions** (any combination of them that produces a value).

## Literals: values written into the code

A **literal** is a value typed directly into your source code:

| Literal              | Kind of value                        |
| -------------------- | ------------------------------------ |
| `5`, `42`, `1000000` | Whole numbers (integers)             |
| `3.14`, `0.5`        | Numbers with a decimal point         |
| `'a'`, `'7'`         | A single character, in single quotes |
| `"hello"`            | Text (a string), in double quotes    |
| `true`, `false`      | Boolean values                       |

A literal's value is fixed: `5` always means 5. Compare that with a variable, whose value lives in memory and can change while the program runs. Note that C++ has no negative number literals: `-12` is the literal `12` with the negation operator `-` in front of it. All the forms literals can take (`5u`, `0xFF`, `1'000'000`, `2.5f` and more) are covered in **Literals and literal suffixes**.

## Operators

An **operator** takes one or more inputs, called **operands**, and produces a result. You already know many from maths:

```cpp title="arithmetic.cpp"
#include <iostream>

int main()
{
    std::cout << 7 + 5 << '\n';       // addition
    std::cout << 7 - 5 << '\n';       // subtraction
    std::cout << 7 * 5 << '\n';       // multiplication
    std::cout << 7 / 2 << '\n';       // division of two ints: the fraction is dropped
    std::cout << 2 + 3 * 4 << '\n';   // * happens before +
    std::cout << (2 + 3) * 4 << '\n'; // parentheses go first
    return 0;
}
```

```output
12
2
35
3
14
20
```

Two things worth noticing:

- `7 / 2` gives `3`, not `3.5`. When both operands are integers, `/` throws the fraction away. More in **Arithmetic and integer division**.
- C++ follows the usual maths order: `*` and `/` before `+` and `-`, and anything in parentheses first. Every operator has a **precedence**, covered in **Precedence and associativity**. When in doubt, add parentheses.

### How many operands: arity

Operators are grouped by how many operands they take, which is called their **arity**:

![Unary operators take one operand, binary take two, and the conditional operator takes three.](diagram:operator-arity)

| Arity       | Operands | Examples                                                     |
| ----------- | -------- | ------------------------------------------------------------ |
| **Unary**   | 1        | `-x` (negate), `!done` (not), `++count`                      |
| **Binary**  | 2        | `a + b`, `a * b`, `a == b`, `x = 5`, `std::cout << x`        |
| **Ternary** | 3        | `isMember ? 5 : 10` (the only one: the conditional operator) |

Some symbols do different jobs depending on how they're used. `-` is binary in `a - b` (subtract) but unary in `-a` (negate). `<<` is a bit shift between two numbers, but "print" when its left side is `std::cout`. `*` multiplies, and later you'll see it also means something completely different next to pointers. The compiler always works out which one you mean from the context.

Most operators are symbols, but a few are **keywords**, such as `new`, `delete`, `sizeof` and `throw`. When people write about an operator as a thing, they often put `operator` in front: `operator+`, `operator<<`. You'll see that naming again when you learn to write your own in **Operator Overloading**.

### Return values and side effects

Every operator produces a result, called its **return value**: `2 + 3` returns `5`. Some operators also **change something** while they're at it. That's called a **side effect**:

- `x = 5` returns `x`, and as a side effect stores 5 in `x`;
- `++count` adds one to `count`;
- `std::cout << "hi"` returns `std::cout`, and as a side effect prints `hi`.

Those return values explain two patterns you've been using. **`=` and `<<` return their left-hand operand**, so you can chain them:

```cpp title="chaining.cpp"
#include <iostream>

int main()
{
    int a{};
    int b{};
    a = b = 5; // b = 5 runs first and returns b; then a = b
    std::cout << a << ' ' << b << '\n';
    return 0;
}
```

```output
5 5
```

![std::cout << "a = " << a << '\n' runs left to right; each << prints one thing and hands std::cout on to the next.](diagram:chaining-cout)

## Expressions

An **expression** is any piece of code that produces a value. It can be:

- a **literal**, like `5`, which produces itself;
- a **variable**, like `apples`, which produces the value it holds;
- an **operator** applied to operands, like `apples * 2`;
- a **function call**, like `std::sqrt(16.0)`, which produces whatever the function returns.

Working out an expression's value is called **evaluating** it, and the value is its **result**. Expressions nest: the operands of an operator can themselves be expressions, as deep as you like.

![x = 2 + 3 * y evaluated from the bottom up: 3 * y first, then 2 + 12, then the assignment.](diagram:expression-tree)

Some vocabulary for the pieces, using `x = 2 + 3 * y`:

- A **subexpression** is an expression used as an operand of another one: `3 * y`, `2 + 3 * y`, `2`, `x`…
- The **full expression** is the outermost one, which isn't part of anything bigger: the whole `x = 2 + 3 * y`.
- A **compound expression** contains more than one operator. This one has three: `=`, `+` and `*`.

**The most useful rule:** anywhere C++ expects a value, you can write _any_ expression that produces a value of the right type. All of these are fine:

```cpp title="anywhere.cpp"
int price{250};
int quantity{3};
int total{price * quantity + 40};             // an expression as an initializer
int perItem{(total - 40) / quantity};         // nested subexpressions
bool bigOrder{total > 500};                   // a comparison produces a bool
```

### Expression statements

An expression on its own isn't a statement, so it can't stand alone. Add a semicolon and it becomes an **expression statement**: the expression is evaluated, and its result is **thrown away**. That only makes sense if the expression has a side effect:

```cpp title="expression-statements.cpp"
#include <iostream>

int main()
{
    int x{};
    x = 2 + 3; // useful: the side effect stores 5 in x
    2 * 3;     // useless: computes 6, then throws it away
    std::cout << x << '\n';
    return 0;
}
```

```output title="Compiler output (GCC, with -Wall)"
expression-statements.cpp:7:7: warning: statement has no effect [-Wunused-value]
```

`x = 2 + 3;` is worth running for its side effect. `2 * 3;` does nothing visible, and the compiler warns you, because a statement with no effect is almost always a mistake, such as a typo in a variable name or a forgotten assignment.

### Expressions vs statements

The two get mixed up, so to keep them apart:

- An **expression** _computes a value_: `price * quantity`.
- A **statement** _does something_, and many statements contain expressions. `int total{price * quantity};` is a declaration statement with an expression inside. `x = 5;` is an expression statement.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What's the difference between an expression and a statement?**
> - **What do unary, binary and ternary mean?** Give an example of each.
> - **What is a side effect?** And why does `2 * 3;` produce a warning?
> - **Why does `a = b = 5;` work?** `=` returns its left operand, and it groups right to left: `a = (b = 5)`.
> - **Why can you chain `std::cout << a << b`?** Each `<<` returns `std::cout`.
