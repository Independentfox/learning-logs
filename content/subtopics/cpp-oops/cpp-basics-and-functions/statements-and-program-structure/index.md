---
subtopic: Statements and program structure
published: 2026-10-08
summary:
  - A statement is one instruction. Most end with a semicolon, and they run in order, top to bottom.
  - There are seven kinds of statement. The ones you'll use first are declarations, expression statements and return.
  - A function is a named group of statements. Every program has exactly one main(), where it starts running.
  - Syntax is C++'s grammar. Break it and the program won't compile, and the error is often reported on the line after the real mistake.
  - Comments are for people. Use // or /* */, never nest /* */, and explain why the code does something rather than what it does.
sources:
  - https://www.learncpp.com/cpp-tutorial/statements-and-the-structure-of-a-program/
  - https://www.learncpp.com/cpp-tutorial/comments/
---

You've already run a C++ program. Now it's time to read one properly. This page takes a program apart into its pieces: **statements**, the **functions** that hold them, the **syntax** rules that glue them together, and the **comments** you add for the humans who read it.

## Statements: one instruction at a time

A **statement** is a single instruction that makes the program do something. It's the smallest complete unit of work in C++, roughly what a sentence is in English. Most statements end with a **semicolon** (`;`), the way a sentence ends with a full stop.

```cpp title="statements.cpp"
#include <iostream>

int main()
{
    int apples = 3;                  // a statement
    apples = apples + 2;             // another statement
    std::cout << apples << '\n';     // and another
    return 0;                        // and the last one
}
```

```output
5
```

Statements run **in order, top to bottom**, one after the other. Each one may turn into many machine instructions once compiled, but you think in statements.

### The seven kinds of statement

C++ has seven kinds. You'll meet every one in this course, but you only need the first few right now:

| Kind                 | What it does                                       | Example                           | Covered in                              |
| -------------------- | -------------------------------------------------- | --------------------------------- | --------------------------------------- |
| **Declaration**      | Introduces a name, such as a variable              | `int apples = 3;`                 | Variables and initialization            |
| **Expression**       | Evaluates something, like a calculation or a print | `apples = apples + 2;`            | Literals, operators and expressions     |
| **Jump**             | Moves execution somewhere else                     | `return 0;` `break;`              | Functions, return values and parameters |
| **Compound** (block) | Groups statements in `{ }` to act as one           | `{ int a = 1; int b = 2; }`       | Blocks and nested scopes                |
| **Selection**        | Chooses what runs next                             | `if (...)`, `switch (...)`        | if statements and blocks                |
| **Iteration**        | Repeats statements                                 | `for`, `while`, `do`              | while loops                             |
| **Try block**        | Catches errors thrown while it runs                | `try { ... } catch (...) { ... }` | throw, try and catch                    |

![Every statement in C++ is one of these seven kinds.](diagram:statement-kinds)

## Functions, and the one called main

Statements don't float around loose. They live inside **functions**. A function is a named group of statements that runs from top to bottom when it's **called**. Programs are built from many small functions, each doing one job.

One function is special. Every C++ program must have exactly **one** function named **`main`**:

- When the program starts, the operating system calls `main`. Its first statement is the first thing your code does.
- When `main` reaches `return`, the program ends, and the returned number goes back to the operating system as the exit code (`0` means _success_).

Writers put `()` after a function's name, as in `main()`, to show they mean a function rather than a variable called `main`. Function names, like all names in C++, are called **identifiers**.

## Anatomy of a program

Here's a complete program. Every line has a job:

```cpp title="anatomy.cpp"
#include <iostream> // lets us use std::cout

int main()
{
    std::cout << "C++ runs statements in order.\n";
    std::cout << "This line prints second.\n";
    return 0;
}
```

```output
C++ runs statements in order.
This line prints second.
```

![The parts of a C++ program, line by line.](diagram:program-anatomy)

| Line                  | What it is                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#include <iostream>` | A **preprocessor directive**. Before compiling, it pastes in the standard library's input/output code, so `std::cout` exists. It isn't a statement, so there's no semicolon. |
| _(blank line)_        | Ignored by the compiler. It's there to make the code easier to read.                                                                                                         |
| `int main()`          | The **function header**: the return type `int`, the name `main`, and `()` for the (empty) parameter list.                                                                    |
| `{` … `}`             | The **function body**. Everything between the braces belongs to `main`.                                                                                                      |
| `std::cout << "…\n";` | Two **expression statements** that print text to the console. `\n` moves to a new line.                                                                                      |
| `return 0;`           | A **jump statement** that ends `main`, and with it the program, reporting success.                                                                                           |

### Characters and text

A **character** is a single symbol, like `a`, `7`, `?` or a space. A sequence of characters is called **text**, or a **string**. In the code above, `"C++ runs statements in order.\n"` is a string.

Some characters are invisible but still matter, like the newline at the end of each line or a tab. These are called **control characters**. Source files are **plain text**: just characters, with no fonts or formatting. That's why you write code in a code editor, not a word processor.

## Syntax: C++'s grammar

**Syntax** is the set of rules for how a program must be written: where semicolons go, how braces pair up, how a function header is shaped. The compiler enforces syntax strictly. Where a person would shrug at a missing full stop, the compiler stops and reports a **syntax error**.

```cpp title="broken.cpp"
#include <iostream>

int main()
{
    std::cout << "Missing a brace...\n";
    return 0;
```

```output title="Compiler output (GCC)"
broken.cpp: In function 'int main()':
broken.cpp:6:14: error: expected '}' at end of input
broken.cpp:4:1: note: to match this '{'
```

The compiler only notices the missing `}` when the file runs out, so it reports the problem at the very end. It then adds a **note** pointing at the `{` that was never closed. That's common: **the error is often reported later than the actual mistake**, so read the notes too, and look at the lines just before the one reported.

Compilers also try to suggest fixes. Swap two letters in `std::cout` and GCC guesses what you meant:

```output title="Compiler output (GCC), for std::cuot"
error: 'cuot' is not a member of 'std'; did you mean 'cout'?
```

The suggestion is only a guess, though, based on similar names. Type `std::cot` instead and GCC suggests `oct`, a different standard name that happens to be closer. Use the suggestion as a hint, not an answer.

> [!TIP]
> A great way to learn error messages is to break a working program on purpose. Delete a semicolon, a brace or a quote, compile, and read what happens. When you meet the same message in real code, you'll know straight away what it means.

## Comments: notes for humans

A **comment** is text the compiler ignores completely. It's there for whoever reads the code next, and that's often you, a few months later, with no memory of writing it. C++ has two styles.

**Single-line comments** start with `//` and run to the end of the line. Put them above the code they describe, or at the end of a short line:

```cpp title="single-line.cpp"
// Work out the total price, including 18% tax.
double price = 250.0;
double total = price * 1.18; // 1.18 = price plus 18%
```

**Multi-line comments** start with `/*` and end with `*/`, and can span many lines:

```cpp title="multi-line.cpp"
/* This program reads a list of scores
   and prints the highest one.
   Written for the week 1 practice set. */
```

### Never nest /* */ comments

A `/*` comment ends at the **first** `*/` the compiler sees. It doesn't count pairs, so an inner comment ends the outer one early:

```cpp title="nested.cpp"
/* outer comment starts here
   /* an inner comment */
   this line is no longer inside any comment */
```

![The compiler pairs /* with the first */ it finds, so the rest of the outer comment becomes code.](diagram:comment-nesting)

The last line is no longer inside a comment, so the compiler tries to read it as C++ and fails. With warnings on, GCC even flags the inner `/*` before the error:

```output title="Compiler output (GCC, with -Wall)"
nested.cpp:2:4: warning: "/*" within comment [-Wcomment]
nested.cpp:3:4: error: expected unqualified-id before 'this'
```

That's why `//` is the safer default, and why `/* */` is a poor tool for switching off code that might already contain one.

### What makes a good comment

Good comments explain what the **code can't say for itself**:

- **Above a file or function: what it does.** _"Returns the number of days between two dates."_ Then someone can use it without reading the code.
- **Inside a tricky piece of code: how it works.** _"Binary search: keep halving the range until it's one element wide."_
- **On a single line: why it's written that way.** This is the most valuable kind, because the code shows _what_ happens but never _why_.

```cpp title="comments-why.cpp"
// Bad: repeats what the code already says.
count = count + 1; // add 1 to count

// Good: explains a reason you can't see in the code.
retries = retries + 1; // the server drops the first request after a restart
```

If a statement needs a comment to explain _what_ it does, try making it clearer first: a better variable name, or splitting it into two simpler lines. A comment that just repeats the code is clutter, and it goes stale when the code changes.

### Commenting out code

Turning code into a comment is called **commenting it out**. It's handy for switching off a line while you test something, or while you hunt for which line causes a bug. Every editor has a shortcut that comments or uncomments the selected lines:

- **VS Code and CLion:** <kbd>Ctrl</kbd>+<kbd>/</kbd> (<kbd>Cmd</kbd>+<kbd>/</kbd> on a Mac)
- **Visual Studio:** <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>C</kbd> to comment, and <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>U</kbd> to uncomment
- **Code::Blocks:** <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> to comment, and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> to uncomment

These shortcuts add `//` to every line, so nesting is never a problem. Don't leave commented-out code lying around for long, though. Once you've finished testing, delete it, and version control will remember it if you ever need it back.

> [!NOTE]
> You'll also see comments that start with `///` or `/**`. These are **documentation comments**: tools like Doxygen read them and generate reference pages for your functions. To the compiler they're ordinary comments.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What is a statement, and what are the main kinds?**
> - **Why does every program need `main`, and what happens to the value it returns?**
> - **Is `#include` a statement?** No. It's a preprocessor directive, which is why it has no semicolon.
> - **What's the difference between `//` and `/* */`, and why can't you nest `/* */`?**
> - **What makes a good comment?** It explains _why_, not _what_.
