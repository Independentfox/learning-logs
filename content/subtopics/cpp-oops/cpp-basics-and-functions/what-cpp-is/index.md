---
subtopic: What C++ is
published: 2026-10-08
summary:
  - A CPU only ever runs machine code. Every programming language is just a more convenient way of producing it.
  - C++ is compiled ahead of time into native machine code, so nothing sits between your program and the CPU.
  - 'It grew out of C: Bjarne Stroustrup started "C with Classes" in 1979, and it was renamed C++ in 1983.'
  - C++ is an ISO standard, not a product. A new version ships every three years, and GCC, Clang and MSVC implement it.
  - Its core promise is zero-overhead abstraction. High-level features cost nothing at run time if you don't use them.
sources:
  - https://www.learncpp.com/cpp-tutorial/introduction-to-these-tutorials/
  - https://www.learncpp.com/cpp-tutorial/introduction-to-programming-languages/
  - https://www.learncpp.com/cpp-tutorial/introduction-to-cplusplus/
questions:
  - title: Say "Hello, World!" With C++
    url: https://www.hackerrank.com/challenges/cpp-hello-world/problem
    difficulty: easy
---

Before you write a single line of C++, it helps to know what problem a programming language actually solves, and where C++ sits among the hundreds of languages out there. This page builds that picture from the bottom up. First, what a computer really runs. Then, how the code people write gets turned into that. Last, why a language from the 1980s still powers game engines, browsers and trading systems today.

## A program is a list of instructions

A processor (CPU) is fast, but it isn't clever. On its own it can only do tiny, simple steps:

- copy a number from one place to another
- add, subtract, multiply or compare two numbers
- jump to a different instruction, depending on the result of a comparison

A **program** is a long, ordered list of these steps. Anything a computer does, whether it's playing a video, running a game or showing this page, comes down to billions of these small steps per second.

So the real question behind every programming language is: _how do we write that list of steps without losing our minds?_

## The only language a CPU understands: machine code

The CPU reads its instructions as **machine code**: patterns of bits (1s and 0s) that the hardware is wired to recognise. On an x86 processor, the kind in most laptops and desktops, these two bytes

`10110000 01100001`

mean "put the number 97 into a small storage slot called `AL`". Machine code has two big problems:

1. **People can't read it.** Writing or debugging a program as raw bits is painfully slow and very easy to get wrong.
2. **It isn't portable.** Each CPU family has its own instruction set. Machine code built for an x86 chip means nothing to the ARM chip in a phone or an Apple Silicon Mac.

## Assembly: machine code with names

**Assembly language** gives every instruction a short, readable name (a _mnemonic_) such as `mov`, `add` or `jmp`. A program called an **assembler** turns each line into the matching machine instruction, one for one.

```text title="Assembly (x86-64)"
mov eax, 5      ; put 5 into the register eax
add eax, 3      ; eax = eax + 3, so eax now holds 8
```

That's far easier to read than bits, but it is still one tiny step per line, and still tied to a single CPU family. Rewriting a program for a different processor means rewriting the assembly.

## High-level languages: say what you mean

A **high-level language** lets you describe _what_ you want and leaves the CPU-level details to a tool. The two lines of assembly above become:

```cpp title="snippet.cpp"
int total = 5 + 3;
```

One line of high-level code often turns into many machine instructions. And because the source isn't tied to any one CPU, the same code can be built for x86, ARM or anything else a tool supports. C, C++, Java, Python, Go and Rust are all high-level languages. Where they differ is how much control over the hardware they still give you, and C++ gives you a lot.

![Each step up the ladder is easier for people to write; each step down is closer to what the CPU actually runs.](diagram:language-ladder)

## Turning source code into machine code

The CPU still only runs machine code, so high-level code has to be translated. There are two main ways to do it.

**Compiling.** A **compiler** reads your whole program _before_ it runs and translates it into an **executable**: a file of machine code for a particular kind of computer. You then run that file directly. The compiler's job is done, and it doesn't need to be installed where the program runs.

**Interpreting.** An **interpreter** reads your source code _while_ the program runs and carries out each statement as it reaches it. Nothing is translated ahead of time, so the interpreter has to be present every time the program runs.

![A compiled program is translated once and then runs on its own; an interpreted program is translated every time it runs.](diagram:compile-vs-interpret)

|                           | Compiled (C++)                          | Interpreted (Python)                         |
| ------------------------- | --------------------------------------- | -------------------------------------------- |
| When translation happens  | Once, before the program runs           | Every time it runs, as it goes               |
| What you ship             | An executable of machine code           | The source code, plus an interpreter         |
| Speed                     | Fast: the CPU runs native code directly | Slower: translation work happens at run time |
| Portability               | Rebuild once for each kind of machine   | Runs anywhere the interpreter is installed   |
| Many mistakes are caught… | At compile time, before anyone runs it  | Only when that line actually runs            |

Plenty of languages sit in between. Java and C# compile to _bytecode_, which a virtual machine runs and compiles further on the fly (just-in-time, or JIT). Python's standard interpreter also turns your code into bytecode first, then interprets that.

**C++ is compiled ahead of time, straight to native machine code.** Nothing sits between your program and the processor, and that's one of the biggest reasons C++ is fast.

> [!NOTE]
> "Compiled" and "interpreted" describe how a language is _usually run_, not something carved into the language itself. C++ interpreters exist, for example, but nobody ships real C++ software that way.

## Where C++ came from

C++ didn't appear from nowhere. It grew out of another language, **C**.

- **1972, C.** Dennis Ritchie created C at Bell Labs to write the Unix operating system. C was small, fast and close to the hardware, but it had little support for organising very large programs.
- **1979, "C with Classes".** Bjarne Stroustrup, also at Bell Labs, wanted C's speed _and_ a way to structure big programs. He borrowed the idea of _classes_ from a language called Simula and bolted it onto C.
- **1983, renamed C++.** In C, `++` is the operator that adds one to a variable, so the name is a programmer's joke: _one step beyond C_.
- **1985, first commercial release**, alongside Stroustrup's book _The C++ Programming Language_.
- **1998, the first official ISO standard**, C++98.

![C++ grew out of C, and since 2011 a new standard has shipped every three years.](diagram:cpp-timeline)

## C++ is a standard, not a product

No single company owns C++. The language is defined by an **ISO standard**, written by an international committee. **Compilers** are separate products that implement that standard; the big three are **GCC**, **Clang** and **Microsoft's MSVC**. Since 2011, a new version of the standard has come out every three years:

| Standard | Year | Remembered for                                                                              |
| -------- | ---- | ------------------------------------------------------------------------------------------- |
| C++98    | 1998 | The first official standard, including the STL's containers and algorithms                  |
| C++03    | 2003 | A bug-fix release                                                                           |
| C++11    | 2011 | "Modern C++": `auto`, lambdas, move semantics, smart pointers, range-based `for`, threads   |
| C++14    | 2014 | Polish on top of C++11, such as generic lambdas and `std::make_unique`                      |
| C++17    | 2017 | `std::optional`, `std::variant`, `std::string_view`, structured bindings, `std::filesystem` |
| C++20    | 2020 | Concepts, ranges, coroutines, modules, the `<=>` operator, `std::format`                    |
| C++23    | 2023 | `std::expected`, `std::print`, and more ranges                                              |
| C++26    | Next | Static reflection and contracts are among its headline features                             |

The committee works hard to keep old code compiling, so C++ written in the 1990s usually still builds today. The upside is stability. The downside is that C++ often has an old way _and_ a modern way to do the same thing. This course teaches the modern way first, and points out the older styles you'll still meet in existing code.

> [!TIP]
> You choose which standard your code is compiled against with a compiler flag, for example `-std=c++20` with GCC or Clang. Setting this up is covered in **Setting up the compiler**.

## What makes C++ _C++_

A few ideas explain most of the language's design. Keep them in mind and a lot of C++ will make sense.

**Zero-overhead abstraction.** C++ gives you high-level tools like classes, templates and containers, but with two rules. A feature you don't use costs you nothing. And a feature you _do_ use should be about as fast as anything you could reasonably write by hand. That's how C++ manages to be expressive _and_ fast.

**You're in control, and responsible.** C++ lets you manage memory yourself and work close to the hardware, and it won't stop you from doing something dangerous. Read past the end of an array and you won't get a polite error message: the result is **undefined behavior**, meaning the program may do anything at all. That's the price of speed and control. You'll learn to avoid it in **Uninitialized variables and undefined behavior**.

**More than one style of programming.** C++ supports _procedural_ code (plain functions), _object-oriented_ code (classes and inheritance), _generic_ code (templates that work for any type) and a good amount of _functional_ style (lambdas and algorithms). You can mix them in the same program.

**Close to C.** Most C code is also valid C++, and C++ can call C libraries directly. It isn't a perfect superset, though: a few C programs won't compile as C++.

## Where C++ is used

C++ shows up wherever speed, control over memory or direct access to the hardware matters:

- **Game engines:** Unreal Engine is written in C++, as are most big-budget games.
- **Web browsers:** Chrome (and the Chromium engine behind Edge, Brave and Opera) and large parts of Firefox.
- **Databases and storage:** MySQL, MongoDB and RocksDB.
- **Compilers and developer tools:** LLVM and the Clang compiler.
- **Machine learning:** the cores of PyTorch and TensorFlow. You write Python, but the heavy maths runs in C++.
- **Finance:** high-frequency trading systems, where microseconds matter.
- **Embedded systems and robotics:** from cars to drones to medical devices.
- **Competitive programming:** C++ is the default choice on Codeforces, CodeChef and AtCoder, thanks to its speed and its standard library.

## How C++ compares

|                     | C                   | C++                                               | Java                | Python                     |
| ------------------- | ------------------- | ------------------------------------------------- | ------------------- | -------------------------- |
| Runs as             | Native machine code | Native machine code                               | Bytecode on the JVM | Bytecode in an interpreter |
| Memory              | Manual              | Manual, or automatic with RAII and smart pointers | Garbage collected   | Garbage collected          |
| Classes and objects | No                  | Yes                                               | Yes                 | Yes                        |
| Types are checked   | At compile time     | At compile time                                   | At compile time     | While the program runs     |
| Typical speed       | Very fast           | Very fast                                         | Fast                | Slower                     |

## Your first look at C++

Here is a complete C++ program, along with what it prints. Press **Edit** to change it, or **Copy** to paste it into your own compiler and run it there.

```cpp title="hello.cpp"
#include <iostream>

int main()
{
    std::cout << "Hello, world!\n";
    return 0;
}
```

```text title="Output"
Hello, world!
```

What each part does, in one line each:

- `#include <iostream>` brings in the part of the standard library that handles input and output.
- `int main()` is where every C++ program starts running.
- `std::cout << "Hello, world!\n";` prints the text, and `\n` moves to a new line.
- `return 0;` tells the operating system the program finished successfully.

Every one of these gets its own subtopic soon. For now, the point is how _little_ it takes to get a real, compiled program running.

## Common questions

**Do I need to learn C first?** No. Modern C++ is best learned directly. Learning C first tends to build habits, like manual memory juggling and C-style strings, that modern C++ gives you better tools for.

**Is C++ outdated?** No. It gets a new standard every three years, and it remains one of the most-used languages in the world for performance-critical software.

**Is C++ hard?** It's a _big_ language, and it trusts you more than most. But you don't need all of it at once. This course builds it up one subtopic at a time, modern features first.

> [!IMPORTANT]
> **Interview corner.** Be ready to explain:
>
> - the difference between a compiled and an interpreted language, and where C++ fits;
> - why C++ is fast: native code, no interpreter or garbage collector in the way, and zero-overhead abstractions;
> - how C++ differs from C: classes, templates, references, RAII and a much larger standard library.
