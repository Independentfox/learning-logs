---
subtopic: Reading compiler error messages
published: 2026-10-19
summary:
  - "A diagnostic reads file:line:column, then error or warning, then the message, then the source line with a caret under the problem."
  - Fix the first error and rebuild. One mistake often triggers a cascade of later errors that disappear on their own.
  - Notes under an error point at related code, such as the declaration your call didn't match.
  - A huge error, often from templates, still has one key line. Find the first "error:" and read its operand types.
  - Link errors point at object files, not your source, and can show mangled names. c++filt turns _Z3addii back into add(int, int).
sources:
  - https://www.learncpp.com/cpp-tutorial/syntax-and-semantic-errors/
  - https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/
  - https://gcc.gnu.org/onlinedocs/gcc/Diagnostic-Message-Formatting-Options.html
---

Compiler errors have a reputation for being unreadable, and some of them are. But most follow the same layout, and once you know where to look, even a long one usually comes down to a single line that tells you what's wrong. This page is about reading them quickly.

## What one error is made of

Here's a typo, `itn` instead of `int`:

```cpp title="typo.cpp"
#include <iostream>

int main()
{
    itn count{5};
    count = count + 1;
    std::cout << count << '\n';
    return 0;
}
```

GCC's first error for it looks like this:

```output title="Compiler output (GCC)"
typo.cpp: In function 'int main()':
typo.cpp:5:5: error: 'itn' was not declared in this scope; did you mean 'int'?
    5 |     itn count{5};
      |     ^~~
      |     int
```

Read it top to bottom:

The first line gives context. The problem is somewhere inside `main`.

Then the important line. `typo.cpp:5:5` is the file, line and column. `error` is the severity (it could also be `warning` or `note`). After that comes the message itself, and here GCC even guesses what you meant.

Below that, GCC prints the offending source line, with `^~~` marking the exact spot. Sometimes, as here, there's an extra line underneath with a suggested fix, called a **fix-it hint**.

Warnings and errors from GCC and Clang follow this same shape. Your editor reads the `file:line:column` part too, which is why you can click an error and jump straight to the code.

![The parts of a GCC diagnostic, top to bottom.](diagram:diagnostic-anatomy)

## The first error matters most

That typo didn't produce just one error. GCC also printed a second:

```output title="Compiler output (GCC), the second error"
typo.cpp:6:5: error: 'count' was not declared in this scope
    6 |     count = count + 1;
      |     ^~~~~
```

Line 6 is fine. It's complaining because the line before failed, so `count` never got declared. This is a **cascade**: one real mistake, then follow-on errors that only exist because of it. Different compilers cascade differently. For this same file, Clang reports one error, GCC two, and Microsoft's compiler six:

```output title="Compiler output (MSVC)"
typo.cpp(5): error C2065: 'itn': undeclared identifier
typo.cpp(5): error C2146: syntax error: missing ';' before identifier 'count'
typo.cpp(5): error C2065: 'count': undeclared identifier
typo.cpp(6): error C2065: 'count': undeclared identifier
typo.cpp(6): error C2065: 'count': undeclared identifier
typo.cpp(7): error C2065: 'count': undeclared identifier
```

So the habit is simple: **fix the first error, then rebuild.** Don't try to work through a list of 40 errors in order. Often half of them were never real.

If a long list is distracting, you can tell the compiler to stop early. `-fmax-errors=1` does it in GCC and `-ferror-limit=1` in Clang. GCC then ends with `compilation terminated due to -fmax-errors=1.`

MSVC's format looks different, `file(line): error C2065: …`, but it holds the same information. The code (`C2065`) is handy, because searching for it brings up Microsoft's page for that exact error.

## Notes point somewhere else

Some errors come with **notes**: extra lines that point at other code related to the problem. Calling a function with the wrong number of arguments is the classic case:

```cpp title="too-few.cpp"
int add(int x, int y)
{
    return x + y;
}

int main()
{
    return add(2);
}
```

```output title="Compiler output (GCC)"
too-few.cpp: In function 'int main()':
too-few.cpp:8:15: error: too few arguments to function 'int add(int, int)'
    8 |     return add(2);
      |            ~~~^~~
too-few.cpp:1:5: note: declared here
    1 | int add(int x, int y)
      |     ^~~
```

The error is about your call on line 8. The note takes you to line 1, where `add` is declared, so you can compare the two without hunting for it. When the error is about a mismatch between two places, the note is usually the other place.

## Long errors

Sooner or later you'll do something like this:

```cpp title="print-vector.cpp"
#include <iostream>
#include <vector>

int main()
{
    std::vector<int> scores{90, 85, 77};
    std::cout << scores << '\n';
    return 0;
}
```

`std::cout` doesn't know how to print a whole vector, and GCC responds with **344 lines** of output: two errors and more than a hundred notes. It's easy to scroll through that and give up. Don't. The first error line already says everything you need:

```output title="Compiler output (GCC), the first error of 344 lines"
print-vector.cpp:7:15: error: no match for 'operator<<' (operand types are 'std::ostream' {aka 'std::basic_ostream<char>'} and 'std::vector<int>')
```

"No match for `operator<<`" means nobody has written a way to `<<` these two types together. The operand types say which two: a stream on the left and a `std::vector<int>` on the right. All the notes after it are GCC listing every `<<` it _does_ know about and explaining why each one doesn't fit. You can ignore them. The fix is to print the elements one by one, which you'll do with loops in **Range-based for loops**.

Errors like this come from **templates**, which most of the standard library is built from. They're long because the compiler shows you everything it tried. You can almost always skip to the first `error:` and read the types.

> [!TIP]
> If you can't work out what an error means, paste the message (without your file paths) into a search engine. You're almost never the first person to hit it. Clang's wording is also often clearer, so compiling the same file with a second compiler can help.

## Link errors look different

Errors from the **linker** (see **From source code to a running program**) look different, because the linker works on object files, not your source code. Without debug info, all it can point at is a function and an offset, like `main.cpp:(.text+0xf)`. In a debug build (`-g`), GNU ld reads the debug info and adds a line number, `main.cpp:5:(.text+0xf)`, but there's never a column or a caret. Inside object files, functions are stored under the compiler's internal encoding, called **mangled names**. The linker usually decodes them for you (`undefined reference to 'add(int, int)'`), but sometimes, in tools or older output, you'll see the raw form, `_Z3addii`. The `c++filt` tool turns it back:

```bash title="terminal"
c++filt _Z3addii
```

```output
add(int, int)
```

On macOS, symbols carry an extra leading underscore, so it's `c++filt __Z3addii` there.

## A routine that works

When the build fails:

1. Read the first `error:` line in full, including the types.
2. Jump to that file and line. If it looks fine, check the line just before it.
3. Read any notes, which point at the other half of the problem.
4. Fix that one thing and rebuild. Don't fix ten things at once.
5. Still stuck? Search the message, or cut the code down to the smallest example that still shows the error.

## If it comes up in an interview

You might be asked what you do when a build prints a wall of errors. The good answer is to fix the first one and rebuild, because later errors are often a cascade from it. Another common one is how a compile error differs from a link error: link errors don't point at your source the way compile errors do, and they're about missing or duplicate definitions, not code that breaks the language rules. Knowing that `c++filt` exists, and what a mangled name is, tends to go down well too.
