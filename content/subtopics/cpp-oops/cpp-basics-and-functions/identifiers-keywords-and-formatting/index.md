---
subtopic: Identifiers, keywords and formatting
published: 2026-10-08
summary:
  - An identifier (a name) may contain letters, digits and underscores, can't start with a digit, can't be a keyword, and is case-sensitive.
  - C++ reserves 90-odd keywords (int, return, class, new…). Names starting with an underscore are reserved too, so avoid them.
  - Name things for what they mean, make the name longer the more widely it's used, and include units when they matter.
  - Whitespace is mostly free, except inside strings. Newlines end // comments and preprocessor lines, and adjacent string literals join together.
  - Pick one style (indentation, braces, line length), stay consistent, and let a formatter like clang-format apply it for you.
sources:
  - https://www.learncpp.com/cpp-tutorial/keywords-and-naming-identifiers/
  - https://www.learncpp.com/cpp-tutorial/whitespace-and-basic-formatting/
---

Code is read far more often than it's written: by your teammates, by interviewers, and by you a few weeks later. Two small skills make a big difference to how readable it is: **naming** things well, and **laying out** the code consistently. This page covers the rules C++ enforces for both, and the conventions good C++ code follows.

## Identifiers: the rules

An **identifier** is any name you make up: a variable, a function, a type, a namespace. C++ has four hard rules:

1. Only **letters** (`a–z`, `A–Z`), **digits** (`0–9`) and the **underscore** (`_`) are allowed. No spaces, hyphens or other symbols.
2. It **can't start with a digit**.
3. It **can't be a keyword** (see below).
4. It's **case-sensitive**: `score`, `Score` and `SCORE` are three different names.

| Name           | Allowed? | Why                                             |
| -------------- | -------- | ----------------------------------------------- |
| `score`        | Yes      |                                                 |
| `player_score` | Yes      | Underscores are fine                            |
| `playerScore2` | Yes      | Digits are fine after the first character       |
| `2ndPlace`     | **No**   | Starts with a digit                             |
| `my-score`     | **No**   | `-` isn't allowed: it reads as "my minus score" |
| `high score`   | **No**   | No spaces                                       |
| `new`          | **No**   | It's a keyword                                  |

![The four rules an identifier must pass.](diagram:identifier-rules)

Break a rule and the compiler stops. Here's a keyword used as a name:

```cpp title="keyword-name.cpp"
int main()
{
    int new{5}; // new is a keyword
    return 0;
}
```

```output title="Compiler output (GCC)"
keyword-name.cpp:3:9: error: expected unqualified-id before 'new'
```

"Unqualified-id" is compiler-speak for _a plain name_. GCC expected a name, and found the keyword `new` instead. You'll see this message whenever a name is malformed.

Case-sensitivity is legal but easy to trip over:

```cpp title="case.cpp"
#include <iostream>

int main()
{
    int score{10};
    int Score{20}; // a completely different variable
    std::cout << score << ' ' << Score << '\n';
    return 0;
}
```

```output
10 20
```

Two names that differ only in capitalization are confusing to read, so don't do it on purpose.

## Keywords

C++ reserves over ninety **keywords**, words with a fixed meaning that you can't use as names. You already know some, and you'll meet the rest throughout the course:

| Group               | Some keywords                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Types               | `int` `double` `char` `bool` `void` `auto` `long` `short` `unsigned`                         |
| Control flow        | `if` `else` `switch` `case` `for` `while` `do` `break` `continue` `return` `goto`            |
| Values              | `true` `false` `nullptr`                                                                     |
| Classes and objects | `class` `struct` `public` `private` `protected` `this` `virtual` `friend`                    |
| Memory              | `new` `delete` `sizeof`                                                                      |
| Others              | `const` `constexpr` `static` `namespace` `using` `template` `typename` `try` `catch` `throw` |

A few surprises:

- `and`, `or` and `not` are keywords too. They're alternative spellings of `&&`, `||` and `!`.
- `main` is **not** a keyword. It's just the name the program starts from.
- `override`, `final`, `import` and `module` are **identifiers with special meaning**. They act like keywords only in particular places, so they're technically allowed as names, but using them as names is asking for confusion.

### Names you shouldn't use even though you can

The standard library and the compiler reserve certain names for themselves. Using them can clash with library internals in ways that are hard to diagnose:

- names that start with an **underscore followed by a capital letter**, like `_Count`;
- names that contain a **double underscore** anywhere, like `my__value`;
- names that start with an **underscore at global scope**, like `_total`.

The simple rule: **never start a name with an underscore, and never use `__`.**

## Naming conventions

The compiler doesn't care what style you use, but readers do. These conventions are common across C++ code:

| Kind of name                    | Common style                                 | Example                       |
| ------------------------------- | -------------------------------------------- | ----------------------------- |
| Variables and functions         | Start lowercase: `snake_case` or `camelCase` | `player_score`, `playerScore` |
| Types (classes, structs, enums) | Start uppercase: `PascalCase`                | `PlayerScore`                 |
| Macros                          | All caps with underscores                    | `MAX_PLAYERS`                 |

![Four naming styles, and what each is normally used for.](diagram:naming-styles)

The standard library uses `snake_case` (`std::string_view`, `push_back`). Many projects use `camelCase` for variables. Both are fine. What matters is **consistency**: choose one for your own code, and when you join an existing project, follow its style, even where you'd have chosen differently.

### Choosing good names

A good name tells the reader what a value **means**, so they don't need a comment to understand it.

| Instead of                                  | Prefer                   | Why                                          |
| ------------------------------------------- | ------------------------ | -------------------------------------------- |
| `int d;`                                    | `int daysUntilDeadline;` | Says what it holds                           |
| `int data2;`                                | `int retryCount;`        | Numbered names hide meaning                  |
| `int t;` (a timeout)                        | `int timeoutMs;`         | Units prevent a whole class of bugs          |
| `int nmPlyrs;`                              | `int playerCount;`       | Unclear abbreviations slow every reader down |
| `int theNumberOfPlayersCurrentlyInTheGame;` | `int playerCount;`       | Long isn't the same as clear                 |

**Make a name's length match its reach.** A loop counter used in three lines can be `i`. A variable used across a whole file, or a function used across a project, needs a descriptive name, because readers will meet it far from where it was defined.

When a name can't carry everything, such as units, ranges or what's included, add a short comment where the variable is defined:

```cpp title="units.cpp"
int maxUploadSize{10}; // in megabytes; files above this are rejected
```

## Whitespace

**Whitespace** means spaces, tabs and newlines. The compiler mostly ignores it, with a few exceptions you need to know.

**Sometimes it's required**, to separate words: `int x` is a definition, but `intx` is a single name. How much whitespace doesn't matter, so `int     x` means exactly the same.

**Newlines end some things.** A `//` comment runs until the end of the line, and a preprocessor directive like `#include` must sit on a line of its own.

**Inside quotes, it's kept exactly.** `"Hello   world"` prints three spaces. But a string literal **can't contain a raw line break**:

```cpp title="broken-string.cpp"
#include <iostream>

int main()
{
    std::cout << "Hello,
 world";
    return 0;
}
```

```output title="Compiler output (GCC)"
broken-string.cpp:5:18: error: missing terminating " character
```

Use `\n` for a line break inside a string instead. And if a long string needs splitting across lines in your source code, rely on the fact that **adjacent string literals are joined into one**:

```cpp title="joined.cpp"
#include <iostream>

int main()
{
    std::cout << "Hello, "
                 "world!\n"; // two literals, joined into one
    return 0;
}
```

```output
Hello, world!
```

## Formatting your code

Because the compiler ignores most whitespace, C++ lets you lay code out however you like, and that freedom is exactly why you need a consistent style. These are the decisions that matter.

**Indentation.** Indent each level of nesting by one step, conventionally **4 spaces** (this course's style), sometimes 2. Spaces or tabs are both fine as long as you're consistent. Set your editor to insert spaces when you press Tab, and the code will look the same in every editor.

**Brace placement.** The two main styles:

![The same function in Allman style and K&R style.](diagram:brace-styles)

This course puts braces on their own line (Allman style), which makes pairs easy to match by eye. K&R style, with the opening brace on the same line, is just as common. Either is fine, as long as you're consistent.

**Line length.** Keep lines to around **80–100 characters**. Long lines are hard to read side by side and in code review. When an expression is too long, break it, and **start the continuation line with the operator**, so it's obvious the line continues:

```cpp title="wrapping.cpp"
int basePrice{500};
int shippingCost{40};
int taxAmount{90};
int discount{25};

int total{ basePrice
           + shippingCost
           + taxAmount
           - discount };
```

**Alignment.** Lining up related lines can make patterns jump out:

```cpp title="alignment.cpp"
int width{1920};   // pixels
int height{1080};  // pixels
int fps{60};       // frames per second
```

### Let a tool do it

Don't format by hand. Every editor has a **Format Document** command (<kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd> in VS Code, <kbd>Ctrl</kbd>+<kbd>K</kbd>, <kbd>Ctrl</kbd>+<kbd>D</kbd> in Visual Studio, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>L</kbd> in CLion). Most of them can use **clang-format**, a formatter configured by a `.clang-format` file in your project folder:

```yaml title=".clang-format"
BasedOnStyle: LLVM
IndentWidth: 4
BreakBeforeBraces: Allman
ColumnLimit: 100
```

With that file in place, everyone on the team gets identical formatting, and style never comes up in code review again. For naming and other conventions, well-known style guides include the **C++ Core Guidelines** and **Google's C++ Style Guide**.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What are the rules for a valid C++ identifier?** Letters, digits and underscores, no leading digit, not a keyword, and case-sensitive.
> - **Is `main` a keyword?** No. Are `override` and `final`? No: they're identifiers with special meaning in context.
> - **Why should you avoid names that start with an underscore?** They're reserved for the compiler and standard library.
> - **What happens with `"Hello, " "world"`?** Adjacent string literals are joined into one.
> - **How do you keep formatting consistent across a team?** Agree on a style, and enforce it with clang-format.
