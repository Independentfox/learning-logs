---
subtopic: Namespaces
published: 2026-10-08
summary:
  - Two things with the same name in the same scope collide. In one file that's a compile error; across files it's a link error.
  - "A namespace is a named scope region: audio::volume and video::volume are different names, so they can't collide."
  - Everything in the standard library lives in the namespace std, which is why it's std::cout and not just cout.
  - ":: is the scope resolution operator. std::cout means cout inside std, and ::name means name in the global namespace."
  - Avoid using namespace std; it pulls every standard name into your code, and one of them will eventually clash with yours.
sources:
  - https://www.learncpp.com/cpp-tutorial/naming-collisions-and-an-introduction-to-namespaces/
---

You've been writing `std::` in front of `cout` and `cin` since the first program. This page explains what that prefix is: a **namespace**, C++'s way of stopping names from different parts of a program, or different libraries, from clashing with each other.

## Naming collisions

C++ needs every name to be unambiguous. If two things with the same name are visible in the same place, the compiler or linker can't tell which one you mean. That's a **naming collision**, and it shows up in one of two ways:

- **In one file**, the compiler catches it: `redefinition of 'int add(int, int)'`, as you saw in **Forward declarations and multiple files**.
- **Across files**, each file compiles fine on its own, and the linker catches it when it combines them: `multiple definition of 'add(int, int)'`.

In a small program you can just pick different names. But big programs pull in libraries written by other people, and you can't rename _their_ functions. Two libraries that both have a `print` function, or a library that has a function with the same name as one of yours, would make the program impossible to build. Namespaces exist to stop that from happening.

## Scope regions, and namespaces

A **scope region** is an area of code where names live. A name must be unique _within_ its region, but the same name in two different regions is fine. You already know one kind: every function body is its own scope region, which is why two functions can both have a local `x` without clashing.

A **namespace** is a scope region with a name, which you create on purpose to hold related declarations:

```cpp title="two-namespaces.cpp"
#include <iostream>

namespace audio
{
    int volume() { return 7; }
}

namespace video
{
    int volume() { return 3; }
}

int main()
{
    std::cout << "audio: " << audio::volume() << '\n';
    std::cout << "video: " << video::volume() << '\n';
    return 0;
}
```

```output
audio: 7
video: 3
```

There are two functions called `volume`, and no collision, because their **full names** are different: `audio::volume` and `video::volume`.

![Namespaces give each name a full name, so identical short names in different namespaces never collide.](diagram:namespace-regions)

A namespace can only contain **declarations and definitions**: functions, variables, types and other namespaces. Statements that _do_ something, like an assignment, must live inside a function:

```output title="Compiler output (GCC), for x = 6; written directly inside a namespace"
error: 'x' does not name a type
```

Writing your own namespaces, nesting them and splitting them across files is covered in **User-defined namespaces**. For now, the most important namespace is the one you've been using all along.

## The global namespace

Anything declared outside every function, class and namespace lives in the **global namespace**. `main` is there, and so is every function you've written so far. A global name is visible from its declaration to the end of the file.

You can name the global namespace explicitly with a `::` that has nothing before it: `::add(2, 3)` means "the `add` in the global namespace". That's rarely needed, but useful when a local name hides a global one.

> [!NOTE]
> Global _variables_, especially ones that can be changed, cause hard-to-trace bugs, because any function anywhere can modify them. You'll see why in **Why mutable globals are risky**. Global _functions_ are fine.

## The std namespace

Everything in the C++ standard library (`cout`, `cin`, `string`, `vector`, `sort`, thousands of names) lives inside one namespace called **`std`**. So the full name of the object you print with is `std::cout`. Its own name is just `cout`, and it lives in `std`.

That's what protects your code. The standard library uses common words like `count`, `size`, `max`, `distance` and `data` as names, and because they all live inside `std`, you're free to use the same words for your own variables and functions.

### The scope resolution operator ::

`::` is the **scope resolution operator**. It means "look up the name on the right, inside the scope on the left":

| Written           | Means                                |
| ----------------- | ------------------------------------ |
| `std::cout`       | `cout`, from the namespace `std`     |
| `audio::volume()` | `volume`, from the namespace `audio` |
| `::add(2, 3)`     | `add`, from the global namespace     |

A name written with its namespace in front, like `std::cout`, is a **qualified name**. Using qualified names is the clearest and safest way to refer to something in a namespace. There's never any doubt about which one you mean.

## Why not just write `using namespace std;`?

You'll see this line in a lot of code online:

```cpp title="using-directive.cpp"
#include <iostream>

using namespace std; // makes every std name usable without std::

int main()
{
    cout << "Hello\n"; // no std:: needed
    return 0;
}
```

It's called a **using-directive**. It tells the compiler to also look inside `std` whenever it meets an unqualified name, so `cout` works without the `std::`. That saves five characters, and it **switches off the protection namespaces were created for**. Here's the problem in action:

```cpp title="ambiguous.cpp"
#include <algorithm>
#include <iostream>

using namespace std;

int count{0}; // our own variable, called count

int main()
{
    cout << count << '\n';
    return 0;
}
```

```output title="Compiler output (GCC, notes trimmed)"
ambiguous.cpp:10:13: error: reference to 'count' is ambiguous
note: candidates are: ... std::count(...)
ambiguous.cpp:6:5: note:                 'int count'
```

The standard library has an algorithm called `std::count`. With the using-directive, the compiler can see both that and our `count`, and can't decide between them. Remove `using namespace std;`, write `std::cout`, and the program compiles and prints `0`. The worst part is that code which compiles today can break tomorrow, when a newer standard adds a name to `std` that happens to match one of yours.

![using namespace std pulls every standard name into view, where one can collide with yours.](diagram:using-namespace-std)

> [!IMPORTANT]
> **Write `std::` explicitly.** Avoid `using namespace std;`, and **never** put it in a header file, where it would quietly affect every file that includes that header. If writing `std::` really bothers you somewhere, a narrower **using-declaration** such as `using std::cout;` brings in just one name. That's covered in **using declarations and directives**.

> [!TIP]
> In competitive programming you'll often see `using namespace std;` together with `#include <bits/stdc++.h>`. That's a speed trick for throwaway, single-file programs, and it isn't portable. `bits/stdc++.h` is GCC-specific. Don't carry the habit into real projects.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **What problem do namespaces solve?** Naming collisions, especially between libraries.
> - **What does `::` do?** And what does a leading `::` with nothing before it mean?
> - **Why is `using namespace std;` considered bad practice, and why is it worse in a header?**
> - **What's in the `std` namespace?** The entire standard library.
> - **What's the global namespace?**
