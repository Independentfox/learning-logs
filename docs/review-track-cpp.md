# C++ & OOPs track: review checklist

Every subtopic on the site, with the sources to check its page against. Our pages are written
in our own words; this file is only for reviewing that nothing was missed. It isn't shown on the site.

- **learncpp** — the lessons the subtopic covers. Read them alongside our page.
- **Related** — when learncpp has no lesson for the subtopic, the nearest ones that touch it.
- **Reference** — official docs (cppreference, GCC, Clang…) for material learncpp doesn't cover.
- ✅ = page is live (link opens it) · ⏳ = not written yet

**8 of 390 subtopics live.** 299 subtopics map to learncpp lessons; 91 go beyond learncpp and are checked against reference docs instead.

Every learncpp lesson is covered by at least one subtopic, except: [A.4 C++ FAQ](https://www.learncpp.com/cpp-tutorial/cpp-faq/).

_Regenerate after each new page: `python3 docs/gen_review.py` (it also fails if a subtopic is missing from the map)._

## 01 · C++ Basics & Functions

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions) · 8/18 live

- **01 · What C++ is** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/what-cpp-is)
  - learncpp: [0.1 Introduction to these tutorials](https://www.learncpp.com/cpp-tutorial/introduction-to-these-tutorials/) · [0.2 Introduction to programs and programming languages](https://www.learncpp.com/cpp-tutorial/introduction-to-programming-languages/) · [0.3 Introduction to C/C++](https://www.learncpp.com/cpp-tutorial/introduction-to-cplusplus/)
- **02 · From source code to a running program** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/from-source-code-to-a-running-program)
  - learncpp: [0.4 Introduction to C++ development](https://www.learncpp.com/cpp-tutorial/introduction-to-cpp-development/) · [0.5 Introduction to the compiler, linker, and libraries](https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/) · [0.7 Compiling your first program](https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/) · [0.8 A few common C++ problems](https://www.learncpp.com/cpp-tutorial/a-few-common-cpp-problems/)
- **03 · Setting up the compiler** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/setting-up-the-compiler)
  - learncpp: [0.6 Installing an Integrated Development Environment (IDE)](https://www.learncpp.com/cpp-tutorial/installing-an-integrated-development-environment-ide/) · [0.9 Configuring your compiler: Build configurations](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-build-configurations/) · [0.10 Configuring your compiler: Compiler extensions](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-compiler-extensions/) · [0.11 Configuring your compiler: Warning and error levels](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/) · [0.12 Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/) · [0.13 What language standard is my compiler using?](https://www.learncpp.com/cpp-tutorial/what-language-standard-is-my-compiler-using/) · [0.7 Compiling your first program](https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/)
- **04 · Compiling from the command line** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/compiling-from-the-command-line)
  - Related: [0.5 Introduction to the compiler, linker, and libraries](https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/) · [0.7 Compiling your first program](https://www.learncpp.com/cpp-tutorial/compiling-your-first-program/) · [0.9 Configuring your compiler: Build configurations](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-build-configurations/) · [0.11 Configuring your compiler: Warning and error levels](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/) · [0.12 Configuring your compiler: Choosing a language standard](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-choosing-a-language-standard/) · [2.8 Programs with multiple code files](https://www.learncpp.com/cpp-tutorial/programs-with-multiple-code-files/) · [A.1 Static and dynamic libraries](https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/)
  - Reference: [GCC manual: Invoking GCC](https://gcc.gnu.org/onlinedocs/gcc/Invoking-GCC.html) · [GCC: Overall options (-c, -o, -E, -S)](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- **05 · Statements and program structure** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/statements-and-program-structure)
  - learncpp: [1.1 Statements and the structure of a program](https://www.learncpp.com/cpp-tutorial/statements-and-the-structure-of-a-program/) · [1.2 Comments](https://www.learncpp.com/cpp-tutorial/comments/)
- **06 · Variables and initialization** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/variables-and-initialization)
  - learncpp: [1.3 Introduction to objects and variables](https://www.learncpp.com/cpp-tutorial/introduction-to-objects-and-variables/) · [1.4 Variable assignment and initialization](https://www.learncpp.com/cpp-tutorial/variable-assignment-and-initialization/)
- **07 · Console input and output** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/console-input-and-output)
  - learncpp: [1.5 Introduction to iostream: cout, cin, and endl](https://www.learncpp.com/cpp-tutorial/introduction-to-iostream-cout-cin-and-endl/)
- **08 · Uninitialized variables and undefined behavior** · ✅ [live](https://thelearninglogs.vercel.app/learning/cpp-oops/cpp-basics-and-functions/uninitialized-variables-and-undefined-behavior)
  - learncpp: [1.6 Uninitialized variables and undefined behavior](https://www.learncpp.com/cpp-tutorial/uninitialized-variables-and-undefined-behavior/)
- **09 · Identifiers, keywords and formatting** · ⏳
  - learncpp: [1.7 Keywords and naming identifiers](https://www.learncpp.com/cpp-tutorial/keywords-and-naming-identifiers/) · [1.8 Whitespace and basic formatting](https://www.learncpp.com/cpp-tutorial/whitespace-and-basic-formatting/)
- **10 · Literals, operators and expressions** · ⏳
  - learncpp: [1.9 Introduction to literals and operators](https://www.learncpp.com/cpp-tutorial/introduction-to-literals-and-operators/) · [1.10 Introduction to expressions](https://www.learncpp.com/cpp-tutorial/introduction-to-expressions/)
- **11 · Functions, return values and parameters** · ⏳
  - learncpp: [2.1 Introduction to functions](https://www.learncpp.com/cpp-tutorial/introduction-to-functions/) · [2.2 Function return values (value-returning functions)](https://www.learncpp.com/cpp-tutorial/function-return-values-value-returning-functions/) · [2.3 Void functions (non-value returning functions)](https://www.learncpp.com/cpp-tutorial/void-functions-non-value-returning-functions/) · [2.4 Introduction to function parameters and arguments](https://www.learncpp.com/cpp-tutorial/introduction-to-function-parameters-and-arguments/)
- **12 · Local scope and using functions well** · ⏳
  - learncpp: [2.5 Introduction to local scope](https://www.learncpp.com/cpp-tutorial/introduction-to-local-scope/) · [2.6 Why functions are useful, and how to use them effectively](https://www.learncpp.com/cpp-tutorial/why-functions-are-useful-and-how-to-use-them-effectively/)
- **13 · Forward declarations and multiple files** · ⏳
  - learncpp: [2.7 Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/) · [2.8 Programs with multiple code files](https://www.learncpp.com/cpp-tutorial/programs-with-multiple-code-files/)
- **14 · Namespaces** · ⏳
  - learncpp: [2.9 Naming collisions and an introduction to namespaces](https://www.learncpp.com/cpp-tutorial/naming-collisions-and-an-introduction-to-namespaces/)
- **15 · Preprocessor, headers and header guards** · ⏳
  - learncpp: [2.10 Introduction to the preprocessor](https://www.learncpp.com/cpp-tutorial/introduction-to-the-preprocessor/) · [2.11 Header files](https://www.learncpp.com/cpp-tutorial/header-files/) · [2.12 Header guards](https://www.learncpp.com/cpp-tutorial/header-guards/)
- **16 · Static and dynamic libraries** · ⏳
  - learncpp: [A.1 Static and dynamic libraries](https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/) · [A.2 Using libraries with Visual Studio](https://www.learncpp.com/cpp-tutorial/a2-using-libraries-with-visual-studio-2005-express/) · [A.3 Using libraries with Code::Blocks](https://www.learncpp.com/cpp-tutorial/a3-using-libraries-with-codeblocks/)
- **17 · Build systems: Make and CMake** · ⏳
  - Related: [A.1 Static and dynamic libraries](https://www.learncpp.com/cpp-tutorial/a1-static-and-dynamic-libraries/)
  - Reference: [GNU Make manual](https://www.gnu.org/software/make/manual/make.html) · [CMake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html)
- **18 · Designing your first programs** · ⏳
  - learncpp: [1.11 Developing your first program](https://www.learncpp.com/cpp-tutorial/developing-your-first-program/) · [2.13 How to design your first programs](https://www.learncpp.com/cpp-tutorial/how-to-design-your-first-programs/) · [1.x Chapter 1 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-1-summary-and-quiz/) · [2.x Chapter 2 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-2-summary-and-quiz/)

## 02 · Debugging

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/debugging) · 0/13 live

- **01 · Syntax errors vs semantic errors** · ⏳
  - learncpp: [3.1 Syntax and semantic errors](https://www.learncpp.com/cpp-tutorial/syntax-and-semantic-errors/)
- **02 · Reading compiler error messages** · ⏳
  - Related: [3.1 Syntax and semantic errors](https://www.learncpp.com/cpp-tutorial/syntax-and-semantic-errors/) · [0.11 Configuring your compiler: Warning and error levels](https://www.learncpp.com/cpp-tutorial/configuring-your-compiler-warning-and-error-levels/)
  - Reference: [GCC: Diagnostic message formatting](https://gcc.gnu.org/onlinedocs/gcc/Diagnostic-Message-Formatting-Options.html)
- **03 · A systematic debugging process** · ⏳
  - learncpp: [3.2 The debugging process](https://www.learncpp.com/cpp-tutorial/the-debugging-process/) · [3.3 A strategy for debugging](https://www.learncpp.com/cpp-tutorial/a-strategy-for-debugging/)
- **04 · Print debugging and logging** · ⏳
  - learncpp: [3.4 Basic debugging tactics](https://www.learncpp.com/cpp-tutorial/basic-debugging-tactics/) · [3.5 More debugging tactics](https://www.learncpp.com/cpp-tutorial/more-debugging-tactics/)
- **05 · Stepping through code** · ⏳
  - learncpp: [3.6 Using an integrated debugger: Stepping](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-stepping/)
- **06 · Breakpoints and run-to-cursor** · ⏳
  - learncpp: [3.7 Using an integrated debugger: Running and breakpoints](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-running-and-breakpoints/)
- **07 · Watching variables** · ⏳
  - learncpp: [3.8 Using an integrated debugger: Watching variables](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-watching-variables/)
- **08 · Reading the call stack** · ⏳
  - learncpp: [3.9 Using an integrated debugger: The call stack](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-the-call-stack/)
- **09 · Debugging with gdb and lldb** · ⏳
  - Related: [3.6 Using an integrated debugger: Stepping](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-stepping/) · [3.7 Using an integrated debugger: Running and breakpoints](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-running-and-breakpoints/) · [3.8 Using an integrated debugger: Watching variables](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-watching-variables/) · [3.9 Using an integrated debugger: The call stack](https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-the-call-stack/)
  - Reference: [GDB manual](https://sourceware.org/gdb/current/onlinedocs/gdb.html/) · [LLDB tutorial](https://lldb.llvm.org/use/tutorial.html)
- **10 · AddressSanitizer and UBSan** · ⏳
  - Related: [1.6 Uninitialized variables and undefined behavior](https://www.learncpp.com/cpp-tutorial/uninitialized-variables-and-undefined-behavior/)
  - Reference: [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) · [Clang: UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html)
- **11 · Finding memory leaks with Valgrind** · ⏳
  - Related: [19.1 Dynamic memory allocation with new and delete](https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/)
  - Reference: [Valgrind quick start](https://valgrind.org/docs/manual/quick-start.html)
- **12 · Static analysis with clang-tidy** · ⏳
  - Related: [3.10 Finding issues before they become problems](https://www.learncpp.com/cpp-tutorial/finding-issues-before-they-become-problems/)
  - Reference: [clang-tidy docs](https://clang.llvm.org/extra/clang-tidy/)
- **13 · Defensive habits that prevent bugs** · ⏳
  - learncpp: [3.10 Finding issues before they become problems](https://www.learncpp.com/cpp-tutorial/finding-issues-before-they-become-problems/) · [3.x Chapter 3 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-3-summary-and-quiz/)

## 03 · Data Types, Constants & Strings

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/data-types-constants-and-strings) · 0/24 live

- **01 · The fundamental types at a glance** · ⏳
  - learncpp: [4.1 Introduction to fundamental data types](https://www.learncpp.com/cpp-tutorial/introduction-to-fundamental-data-types/)
- **02 · void** · ⏳
  - learncpp: [4.2 Void](https://www.learncpp.com/cpp-tutorial/void/)
- **03 · Object sizes and sizeof** · ⏳
  - learncpp: [4.3 Object sizes and the sizeof operator](https://www.learncpp.com/cpp-tutorial/object-sizes-and-the-sizeof-operator/)
- **04 · Signed integers and overflow** · ⏳
  - learncpp: [4.4 Signed integers](https://www.learncpp.com/cpp-tutorial/signed-integers/)
- **05 · Unsigned integers and their traps** · ⏳
  - learncpp: [4.5 Unsigned integers, and why to avoid them](https://www.learncpp.com/cpp-tutorial/unsigned-integers-and-why-to-avoid-them/)
- **06 · Fixed-width integers and size_t** · ⏳
  - learncpp: [4.6 Fixed-width integers and size_t](https://www.learncpp.com/cpp-tutorial/fixed-width-integers-and-size-t/)
- **07 · Type limits with std::numeric_limits** · ⏳
  - Related: [4.3 Object sizes and the sizeof operator](https://www.learncpp.com/cpp-tutorial/object-sizes-and-the-sizeof-operator/) · [4.4 Signed integers](https://www.learncpp.com/cpp-tutorial/signed-integers/)
  - Reference: [cppreference: std::numeric_limits](https://en.cppreference.com/cpp/types/numeric_limits)
- **08 · Scientific notation** · ⏳
  - learncpp: [4.7 Introduction to scientific notation](https://www.learncpp.com/cpp-tutorial/introduction-to-scientific-notation/)
- **09 · Floating-point numbers and precision** · ⏳
  - learncpp: [4.8 Floating point numbers](https://www.learncpp.com/cpp-tutorial/floating-point-numbers/)
- **10 · Booleans and a first look at if** · ⏳
  - learncpp: [4.9 Boolean values](https://www.learncpp.com/cpp-tutorial/boolean-values/) · [4.10 Introduction to if statements](https://www.learncpp.com/cpp-tutorial/introduction-to-if-statements/)
- **11 · Characters and char** · ⏳
  - learncpp: [4.11 Chars](https://www.learncpp.com/cpp-tutorial/chars/)
- **12 · Converting types with static_cast** · ⏳
  - learncpp: [4.12 Introduction to type conversion and static_cast](https://www.learncpp.com/cpp-tutorial/introduction-to-type-conversion-and-static_cast/) · [4.x Chapter 4 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-4-summary-and-quiz/)
- **13 · Const variables** · ⏳
  - learncpp: [5.1 Constant variables (named constants)](https://www.learncpp.com/cpp-tutorial/constant-variables-named-constants/)
- **14 · Literals and literal suffixes** · ⏳
  - learncpp: [5.2 Literals](https://www.learncpp.com/cpp-tutorial/literals/)
- **15 · Binary, octal and hexadecimal** · ⏳
  - learncpp: [5.3 Numeral systems (decimal, binary, hexadecimal, and octal)](https://www.learncpp.com/cpp-tutorial/numeral-systems-decimal-binary-hexadecimal-and-octal/)
- **16 · The as-if rule and optimization** · ⏳
  - learncpp: [5.4 The as-if rule and compile-time optimization](https://www.learncpp.com/cpp-tutorial/the-as-if-rule-and-compile-time-optimization/)
- **17 · Constant expressions** · ⏳
  - learncpp: [5.5 Constant expressions](https://www.learncpp.com/cpp-tutorial/constant-expressions/)
- **18 · constexpr variables** · ⏳
  - learncpp: [5.6 Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)
- **19 · std::string basics** · ⏳
  - learncpp: [5.7 Introduction to std::string](https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring/)
- **20 · Working with std::string** · ⏳
  - learncpp: [D.22.1 std::string and std::wstring (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-and-stdwstring/) · [D.22.2 std::string construction and destruction (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-construction-and-destruction/) · [D.22.3 std::string length and capacity (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-length-and-capacity/) · [D.22.4 std::string character access and conversion to C-style arrays (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-character-access-and-conversion-to-c-style-arrays/) · [D.22.5 std::string assignment and swapping (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-assignment-and-swapping/) · [D.22.6 std::string appending (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-appending/) · [D.22.7 std::string inserting (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-inserting/)
  - Reference: [cppreference: std::basic_string](https://en.cppreference.com/cpp/string/basic_string)
- **21 · std::string_view** · ⏳
  - learncpp: [5.8 Introduction to std::string_view](https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring_view/) · [5.9 std::string_view (part 2)](https://www.learncpp.com/cpp-tutorial/stdstring_view-part-2/) · [5.x Chapter 5 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-5-summary-and-quiz/)
- **22 · Converting between strings and numbers** · ⏳
  - Related: [5.7 Introduction to std::string](https://www.learncpp.com/cpp-tutorial/introduction-to-stdstring/)
  - Reference: [cppreference: std::stoi / std::stol](https://en.cppreference.com/cpp/string/basic_string/stol) · [cppreference: std::to_string](https://en.cppreference.com/cpp/string/basic_string/to_string) · [cppreference: std::from_chars](https://en.cppreference.com/cpp/utility/from_chars)
- **23 · Character handling with <cctype>** · ⏳
  - Related: [4.11 Chars](https://www.learncpp.com/cpp-tutorial/chars/)
  - Reference: [cppreference: <cctype>](https://en.cppreference.com/cpp/header/cctype)
- **24 · Unicode and wide character types** · ⏳
  - Related: [4.11 Chars](https://www.learncpp.com/cpp-tutorial/chars/) · [D.22.1 std::string and std::wstring (archived)](https://www.learncpp.com/cpp-tutorial/stdstring-and-stdwstring/)
  - Reference: [cppreference: fundamental types (character types)](https://en.cppreference.com/cpp/language/types)

## 04 · Operators & Bit Manipulation

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/operators-and-bit-manipulation) · 0/14 live

- **01 · Precedence and associativity** · ⏳
  - learncpp: [6.1 Operator precedence and associativity](https://www.learncpp.com/cpp-tutorial/operator-precedence-and-associativity/)
- **02 · Arithmetic and integer division** · ⏳
  - learncpp: [6.2 Arithmetic operators](https://www.learncpp.com/cpp-tutorial/arithmetic-operators/)
- **03 · Remainder and exponentiation** · ⏳
  - learncpp: [6.3 Remainder and Exponentiation](https://www.learncpp.com/cpp-tutorial/remainder-and-exponentiation/)
- **04 · Increment, decrement and side effects** · ⏳
  - learncpp: [6.4 Increment/decrement operators, and side effects](https://www.learncpp.com/cpp-tutorial/increment-decrement-operators-and-side-effects/)
- **05 · Order of evaluation pitfalls** · ⏳
  - Related: [6.1 Operator precedence and associativity](https://www.learncpp.com/cpp-tutorial/operator-precedence-and-associativity/) · [6.4 Increment/decrement operators, and side effects](https://www.learncpp.com/cpp-tutorial/increment-decrement-operators-and-side-effects/)
  - Reference: [cppreference: order of evaluation](https://en.cppreference.com/cpp/language/eval_order)
- **06 · The comma operator** · ⏳
  - learncpp: [6.5 The comma operator](https://www.learncpp.com/cpp-tutorial/the-comma-operator/)
- **07 · The conditional operator ?:** · ⏳
  - learncpp: [6.6 The conditional operator](https://www.learncpp.com/cpp-tutorial/the-conditional-operator/)
- **08 · Comparisons and floating-point pitfalls** · ⏳
  - learncpp: [6.7 Relational operators and floating point comparisons](https://www.learncpp.com/cpp-tutorial/relational-operators-and-floating-point-comparisons/)
- **09 · Logical operators and short-circuiting** · ⏳
  - learncpp: [6.8 Logical operators](https://www.learncpp.com/cpp-tutorial/logical-operators/) · [6.x Chapter 6 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-6-summary-and-quiz/)
- **10 · Bit flags with std::bitset** · ⏳
  - learncpp: [O.1 Bit flags and bit manipulation via std::bitset](https://www.learncpp.com/cpp-tutorial/bit-flags-and-bit-manipulation-via-stdbitset/)
- **11 · Bitwise operators** · ⏳
  - learncpp: [O.2 Bitwise operators](https://www.learncpp.com/cpp-tutorial/bitwise-operators/)
- **12 · Bit masks** · ⏳
  - learncpp: [O.3 Bit manipulation with bitwise operators and bit masks](https://www.learncpp.com/cpp-tutorial/bit-manipulation-with-bitwise-operators-and-bit-masks/)
- **13 · Binary to decimal and back** · ⏳
  - learncpp: [O.4 Converting integers between binary and decimal representation](https://www.learncpp.com/cpp-tutorial/converting-integers-between-binary-and-decimal-representation/)
- **14 · The <bit> header (C++20)** · ⏳
  - Related: [O.1 Bit flags and bit manipulation via std::bitset](https://www.learncpp.com/cpp-tutorial/bit-flags-and-bit-manipulation-via-stdbitset/) · [O.2 Bitwise operators](https://www.learncpp.com/cpp-tutorial/bitwise-operators/) · [O.3 Bit manipulation with bitwise operators and bit masks](https://www.learncpp.com/cpp-tutorial/bit-manipulation-with-bitwise-operators-and-bit-masks/)
  - Reference: [cppreference: <bit>](https://en.cppreference.com/cpp/header/bit)

## 05 · Scope, Duration & Linkage

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/scope-duration-and-linkage) · 0/18 live

- **01 · Blocks and nested scopes** · ⏳
  - learncpp: [7.1 Compound statements (blocks)](https://www.learncpp.com/cpp-tutorial/compound-statements-blocks/)
- **02 · User-defined namespaces** · ⏳
  - learncpp: [7.2 User-defined namespaces and the scope resolution operator](https://www.learncpp.com/cpp-tutorial/user-defined-namespaces-and-the-scope-resolution-operator/)
- **03 · Local variables: scope and lifetime** · ⏳
  - learncpp: [7.3 Local variables](https://www.learncpp.com/cpp-tutorial/local-variables/)
- **04 · Global variables** · ⏳
  - learncpp: [7.4 Introduction to global variables](https://www.learncpp.com/cpp-tutorial/introduction-to-global-variables/)
- **05 · Variable shadowing** · ⏳
  - learncpp: [7.5 Variable shadowing (name hiding)](https://www.learncpp.com/cpp-tutorial/variable-shadowing-name-hiding/)
- **06 · Internal linkage** · ⏳
  - learncpp: [7.6 Internal linkage](https://www.learncpp.com/cpp-tutorial/internal-linkage/)
- **07 · External linkage and extern** · ⏳
  - learncpp: [7.7 External linkage and variable forward declarations](https://www.learncpp.com/cpp-tutorial/external-linkage-and-variable-forward-declarations/)
- **08 · Why mutable globals are risky** · ⏳
  - learncpp: [7.8 Why (non-const) global variables are evil](https://www.learncpp.com/cpp-tutorial/why-non-const-global-variables-are-evil/)
- **09 · The One Definition Rule** · ⏳
  - Related: [2.7 Forward declarations and definitions](https://www.learncpp.com/cpp-tutorial/forward-declarations/) · [7.9 Inline functions and variables](https://www.learncpp.com/cpp-tutorial/inline-functions-and-variables/)
  - Reference: [cppreference: definitions and the ODR](https://en.cppreference.com/cpp/language/definition)
- **10 · Inline functions and variables** · ⏳
  - learncpp: [7.9 Inline functions and variables](https://www.learncpp.com/cpp-tutorial/inline-functions-and-variables/)
- **11 · Sharing constants across files** · ⏳
  - learncpp: [7.10 Sharing global constants across multiple files (using inline variables)](https://www.learncpp.com/cpp-tutorial/sharing-global-constants-across-multiple-files-using-inline-variables/)
- **12 · Static local variables** · ⏳
  - learncpp: [7.11 Static local variables](https://www.learncpp.com/cpp-tutorial/static-local-variables/)
- **13 · Static initialization order** · ⏳
  - Related: [7.8 Why (non-const) global variables are evil](https://www.learncpp.com/cpp-tutorial/why-non-const-global-variables-are-evil/)
  - Reference: [cppreference: static initialization order fiasco](https://en.cppreference.com/cpp/language/siof)
- **14 · thread_local variables** · ⏳
  - Related: [7.12 Scope, duration, and linkage summary](https://www.learncpp.com/cpp-tutorial/scope-duration-and-linkage-summary/)
  - Reference: [cppreference: storage duration](https://en.cppreference.com/cpp/language/storage_duration)
- **15 · using declarations and directives** · ⏳
  - learncpp: [7.13 Using declarations and using directives](https://www.learncpp.com/cpp-tutorial/using-declarations-and-using-directives/)
- **16 · Unnamed and inline namespaces** · ⏳
  - learncpp: [7.14 Unnamed and inline namespaces](https://www.learncpp.com/cpp-tutorial/unnamed-and-inline-namespaces/)
- **17 · Name mangling and extern "C"** · ⏳
  - Related: [7.7 External linkage and variable forward declarations](https://www.learncpp.com/cpp-tutorial/external-linkage-and-variable-forward-declarations/)
  - Reference: [cppreference: language linkage](https://en.cppreference.com/cpp/language/language_linkage)
- **18 · Scope, duration and linkage recap** · ⏳
  - learncpp: [7.12 Scope, duration, and linkage summary](https://www.learncpp.com/cpp-tutorial/scope-duration-and-linkage-summary/) · [7.x Chapter 7 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-7-summary-and-quiz/)

## 06 · Control Flow & Error Handling

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/control-flow-and-error-handling) · 0/23 live

- **01 · How control flow works** · ⏳
  - learncpp: [8.1 Control flow introduction](https://www.learncpp.com/cpp-tutorial/control-flow-introduction/)
- **02 · if statements and blocks** · ⏳
  - learncpp: [8.2 If statements and blocks](https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/)
- **03 · Common if-statement mistakes** · ⏳
  - learncpp: [8.3 Common if statement problems](https://www.learncpp.com/cpp-tutorial/common-if-statement-problems/)
- **04 · if and switch with initializers** · ⏳
  - Related: [8.2 If statements and blocks](https://www.learncpp.com/cpp-tutorial/if-statements-and-blocks/) · [8.5 Switch statement basics](https://www.learncpp.com/cpp-tutorial/switch-statement-basics/)
  - Reference: [cppreference: if statement](https://en.cppreference.com/cpp/language/if) · [cppreference: switch statement](https://en.cppreference.com/cpp/language/switch)
- **05 · if constexpr** · ⏳
  - learncpp: [8.4 Constexpr if statements](https://www.learncpp.com/cpp-tutorial/constexpr-if-statements/)
- **06 · switch statements** · ⏳
  - learncpp: [8.5 Switch statement basics](https://www.learncpp.com/cpp-tutorial/switch-statement-basics/)
- **07 · Fallthrough and scope in switch** · ⏳
  - learncpp: [8.6 Switch fallthrough and scoping](https://www.learncpp.com/cpp-tutorial/switch-fallthrough-and-scoping/)
- **08 · goto, and why to avoid it** · ⏳
  - learncpp: [8.7 Goto statements](https://www.learncpp.com/cpp-tutorial/goto-statements/)
- **09 · while loops** · ⏳
  - learncpp: [8.8 Introduction to loops and while statements](https://www.learncpp.com/cpp-tutorial/introduction-to-loops-and-while-statements/)
- **10 · do-while loops** · ⏳
  - learncpp: [8.9 Do while statements](https://www.learncpp.com/cpp-tutorial/do-while-statements/)
- **11 · for loops** · ⏳
  - learncpp: [8.10 For statements](https://www.learncpp.com/cpp-tutorial/for-statements/)
- **12 · break and continue** · ⏳
  - learncpp: [8.11 Break and continue](https://www.learncpp.com/cpp-tutorial/break-and-continue/)
- **13 · Exiting early: exit, abort, terminate** · ⏳
  - learncpp: [8.12 Halts (exiting your program early)](https://www.learncpp.com/cpp-tutorial/halts-exiting-your-program-early/)
- **14 · Random number generation** · ⏳
  - learncpp: [8.13 Introduction to random number generation](https://www.learncpp.com/cpp-tutorial/introduction-to-random-number-generation/)
- **15 · The Mersenne Twister** · ⏳
  - learncpp: [8.14 Generating random numbers using Mersenne Twister](https://www.learncpp.com/cpp-tutorial/generating-random-numbers-using-mersenne-twister/)
- **16 · A reusable random number helper** · ⏳
  - learncpp: [8.15 Global random numbers (Random.h)](https://www.learncpp.com/cpp-tutorial/global-random-numbers-random-h/) · [8.x Chapter 8 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-8-summary-and-quiz/)
- **17 · Testing your code** · ⏳
  - learncpp: [9.1 Introduction to testing your code](https://www.learncpp.com/cpp-tutorial/introduction-to-testing-your-code/)
- **18 · Code coverage** · ⏳
  - learncpp: [9.2 Code coverage](https://www.learncpp.com/cpp-tutorial/code-coverage/)
- **19 · Common semantic errors** · ⏳
  - learncpp: [9.3 Common semantic errors in C++](https://www.learncpp.com/cpp-tutorial/common-semantic-errors-in-c/)
- **20 · Detecting and handling errors** · ⏳
  - learncpp: [9.4 Detecting and handling errors](https://www.learncpp.com/cpp-tutorial/detecting-and-handling-errors/)
- **21 · Handling invalid input from std::cin** · ⏳
  - learncpp: [9.5 std::cin and handling invalid input](https://www.learncpp.com/cpp-tutorial/stdcin-and-handling-invalid-input/)
- **22 · assert and static_assert** · ⏳
  - learncpp: [9.6 Assert and static_assert](https://www.learncpp.com/cpp-tutorial/assert-and-static_assert/) · [9.x Chapter 9 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-9-summary-and-quiz/)
- **23 · Unit testing with GoogleTest and Catch2** · ⏳
  - Related: [9.1 Introduction to testing your code](https://www.learncpp.com/cpp-tutorial/introduction-to-testing-your-code/)
  - Reference: [GoogleTest primer](https://google.github.io/googletest/primer.html) · [Catch2 tutorial](https://github.com/catchorg/Catch2/blob/devel/docs/tutorial.md)

## 07 · Type Conversion & Deduction

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/type-conversion-and-deduction) · 0/12 live

- **01 · Implicit type conversion** · ⏳
  - learncpp: [10.1 Implicit type conversion](https://www.learncpp.com/cpp-tutorial/implicit-type-conversion/)
- **02 · Numeric promotions** · ⏳
  - learncpp: [10.2 Floating-point and integral promotion](https://www.learncpp.com/cpp-tutorial/floating-point-and-integral-promotion/)
- **03 · Numeric conversions** · ⏳
  - learncpp: [10.3 Numeric conversions](https://www.learncpp.com/cpp-tutorial/numeric-conversions/)
- **04 · Narrowing and brace initialization** · ⏳
  - learncpp: [10.4 Narrowing conversions, list initialization, and constexpr initializers](https://www.learncpp.com/cpp-tutorial/narrowing-conversions-list-initialization-and-constexpr-initializers/)
- **05 · The usual arithmetic conversions** · ⏳
  - learncpp: [10.5 Arithmetic conversions](https://www.learncpp.com/cpp-tutorial/arithmetic-conversions/)
- **06 · Explicit casts with static_cast** · ⏳
  - learncpp: [10.6 Explicit type conversion (casting) and static_cast](https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/)
- **07 · const_cast and reinterpret_cast** · ⏳
  - Related: [10.6 Explicit type conversion (casting) and static_cast](https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/)
  - Reference: [cppreference: const_cast](https://en.cppreference.com/cpp/language/const_cast) · [cppreference: reinterpret_cast](https://en.cppreference.com/cpp/language/reinterpret_cast)
- **08 · Why to avoid C-style casts** · ⏳
  - learncpp: [10.6 Explicit type conversion (casting) and static_cast](https://www.learncpp.com/cpp-tutorial/explicit-type-conversion-casting-and-static-cast/)
  - Reference: [cppreference: explicit type conversion](https://en.cppreference.com/cpp/language/explicit_cast)
- **09 · typedefs and type aliases** · ⏳
  - learncpp: [10.7 Typedefs and type aliases](https://www.learncpp.com/cpp-tutorial/typedefs-and-type-aliases/)
- **10 · auto for variables** · ⏳
  - learncpp: [10.8 Type deduction for objects using the auto keyword](https://www.learncpp.com/cpp-tutorial/type-deduction-for-objects-using-the-auto-keyword/)
- **11 · auto and trailing return types** · ⏳
  - learncpp: [10.9 Type deduction for functions](https://www.learncpp.com/cpp-tutorial/type-deduction-for-functions/) · [10.x Chapter 10 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-10-summary-and-quiz/)
- **12 · decltype and decltype(auto)** · ⏳
  - Related: [10.8 Type deduction for objects using the auto keyword](https://www.learncpp.com/cpp-tutorial/type-deduction-for-objects-using-the-auto-keyword/) · [10.9 Type deduction for functions](https://www.learncpp.com/cpp-tutorial/type-deduction-for-functions/)
  - Reference: [cppreference: decltype](https://en.cppreference.com/cpp/language/decltype)

## 08 · Overloading, Templates & constexpr

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/overloading-templates-and-constexpr) · 0/15 live

- **01 · Function overloading** · ⏳
  - learncpp: [11.1 Introduction to function overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-function-overloading/)
- **02 · How overloads are told apart** · ⏳
  - learncpp: [11.2 Function overload differentiation](https://www.learncpp.com/cpp-tutorial/function-overload-differentiation/)
- **03 · Overload resolution and ambiguity** · ⏳
  - learncpp: [11.3 Function overload resolution and ambiguous matches](https://www.learncpp.com/cpp-tutorial/function-overload-resolution-and-ambiguous-matches/)
- **04 · Deleted functions** · ⏳
  - learncpp: [11.4 Deleting functions](https://www.learncpp.com/cpp-tutorial/deleting-functions/)
- **05 · Default arguments** · ⏳
  - learncpp: [11.5 Default arguments](https://www.learncpp.com/cpp-tutorial/default-arguments/)
- **06 · Function templates** · ⏳
  - learncpp: [11.6 Function templates](https://www.learncpp.com/cpp-tutorial/function-templates/)
- **07 · How templates are instantiated** · ⏳
  - learncpp: [11.7 Function template instantiation](https://www.learncpp.com/cpp-tutorial/function-template-instantiation/)
- **08 · Templates with several type parameters** · ⏳
  - learncpp: [11.8 Function templates with multiple template types](https://www.learncpp.com/cpp-tutorial/function-templates-with-multiple-template-types/)
- **09 · Abbreviated templates with auto** · ⏳
  - learncpp: [11.8 Function templates with multiple template types](https://www.learncpp.com/cpp-tutorial/function-templates-with-multiple-template-types/)
- **10 · Non-type template parameters** · ⏳
  - learncpp: [11.9 Non-type template parameters](https://www.learncpp.com/cpp-tutorial/non-type-template-parameters/)
- **11 · Templates across multiple files** · ⏳
  - learncpp: [11.10 Using function templates in multiple files](https://www.learncpp.com/cpp-tutorial/using-function-templates-in-multiple-files/) · [11.x Chapter 11 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-11-summary-and-quiz/)
- **12 · constexpr functions** · ⏳
  - learncpp: [F.1 Constexpr functions](https://www.learncpp.com/cpp-tutorial/constexpr-functions/)
- **13 · When constexpr runs at compile time** · ⏳
  - learncpp: [F.2 Constexpr functions (part 2)](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-2/) · [F.4 Constexpr functions (part 4)](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-4/)
- **14 · consteval functions** · ⏳
  - learncpp: [F.3 Constexpr functions (part 3) and consteval](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-3-and-consteval/) · [F.x Chapter F summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-f-summary-and-quiz/)
- **15 · constinit** · ⏳
  - Related: [F.3 Constexpr functions (part 3) and consteval](https://www.learncpp.com/cpp-tutorial/constexpr-functions-part-3-and-consteval/) · [5.6 Constexpr variables](https://www.learncpp.com/cpp-tutorial/constexpr-variables/)
  - Reference: [cppreference: constinit](https://en.cppreference.com/cpp/language/constinit)

## 09 · References & Pointers

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/references-and-pointers) · 0/16 live

- **01 · Compound types** · ⏳
  - learncpp: [12.1 Introduction to compound data types](https://www.learncpp.com/cpp-tutorial/introduction-to-compound-data-types/)
- **02 · Value categories: lvalues and rvalues** · ⏳
  - learncpp: [12.2 Value categories (lvalues and rvalues)](https://www.learncpp.com/cpp-tutorial/value-categories-lvalues-and-rvalues/)
- **03 · Lvalue references** · ⏳
  - learncpp: [12.3 Lvalue references](https://www.learncpp.com/cpp-tutorial/lvalue-references/)
- **04 · References to const** · ⏳
  - learncpp: [12.4 Lvalue references to const](https://www.learncpp.com/cpp-tutorial/lvalue-references-to-const/)
- **05 · Pass by reference** · ⏳
  - learncpp: [12.5 Pass by lvalue reference](https://www.learncpp.com/cpp-tutorial/pass-by-lvalue-reference/)
- **06 · Pass by const reference** · ⏳
  - learncpp: [12.6 Pass by const lvalue reference](https://www.learncpp.com/cpp-tutorial/pass-by-const-lvalue-reference/)
- **07 · Pointers** · ⏳
  - learncpp: [12.7 Introduction to pointers](https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/)
- **08 · Null pointers and nullptr** · ⏳
  - learncpp: [12.8 Null pointers](https://www.learncpp.com/cpp-tutorial/null-pointers/)
- **09 · Pointers and const** · ⏳
  - learncpp: [12.9 Pointers and const](https://www.learncpp.com/cpp-tutorial/pointers-and-const/)
- **10 · Pass by address** · ⏳
  - learncpp: [12.10 Pass by address](https://www.learncpp.com/cpp-tutorial/pass-by-address/) · [12.11 Pass by address (part 2)](https://www.learncpp.com/cpp-tutorial/pass-by-address-part-2/)
- **11 · Return by reference or address** · ⏳
  - learncpp: [12.12 Return by reference and return by address](https://www.learncpp.com/cpp-tutorial/return-by-reference-and-return-by-address/)
- **12 · In and out parameters** · ⏳
  - learncpp: [12.13 In and out parameters](https://www.learncpp.com/cpp-tutorial/in-and-out-parameters/)
- **13 · Dangling pointers and references** · ⏳
  - Related: [12.3 Lvalue references](https://www.learncpp.com/cpp-tutorial/lvalue-references/) · [12.12 Return by reference and return by address](https://www.learncpp.com/cpp-tutorial/return-by-reference-and-return-by-address/)
  - Reference: [cppreference: references (dangling references)](https://en.cppreference.com/cpp/language/reference)
- **14 · Pointers vs references** · ⏳
  - Related: [12.7 Introduction to pointers](https://www.learncpp.com/cpp-tutorial/introduction-to-pointers/) · [12.10 Pass by address](https://www.learncpp.com/cpp-tutorial/pass-by-address/)
  - Reference: [cppreference: pointer declaration](https://en.cppreference.com/cpp/language/pointer)
- **15 · auto with references and pointers** · ⏳
  - learncpp: [12.14 Type deduction with pointers, references, and const](https://www.learncpp.com/cpp-tutorial/type-deduction-with-pointers-references-and-const/)
- **16 · std::optional** · ⏳
  - learncpp: [12.15 std::optional](https://www.learncpp.com/cpp-tutorial/stdoptional/) · [12.x Chapter 12 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-12-summary-and-quiz/)

## 10 · Enums & Structs

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/enums-and-structs) · 0/20 live

- **01 · Program-defined types** · ⏳
  - learncpp: [13.1 Introduction to program-defined (user-defined) types](https://www.learncpp.com/cpp-tutorial/introduction-to-program-defined-user-defined-types/)
- **02 · Unscoped enumerations** · ⏳
  - learncpp: [13.2 Unscoped enumerations](https://www.learncpp.com/cpp-tutorial/unscoped-enumerations/)
- **03 · Enums and integer conversions** · ⏳
  - learncpp: [13.3 Unscoped enumerator integral conversions](https://www.learncpp.com/cpp-tutorial/unscoped-enumerator-integral-conversions/)
- **04 · Enums to and from strings** · ⏳
  - learncpp: [13.4 Converting an enumeration to and from a string](https://www.learncpp.com/cpp-tutorial/converting-an-enumeration-to-and-from-a-string/)
- **05 · A first look at overloading << and >>** · ⏳
  - learncpp: [13.5 Introduction to overloading the I/O operators](https://www.learncpp.com/cpp-tutorial/introduction-to-overloading-the-i-o-operators/)
- **06 · Scoped enums (enum class)** · ⏳
  - learncpp: [13.6 Scoped enumerations (enum classes)](https://www.learncpp.com/cpp-tutorial/scoped-enumerations-enum-classes/)
- **07 · Structs and member access** · ⏳
  - learncpp: [13.7 Introduction to structs, members, and member selection](https://www.learncpp.com/cpp-tutorial/introduction-to-structs-members-and-member-selection/)
- **08 · Aggregate initialization** · ⏳
  - learncpp: [13.8 Struct aggregate initialization](https://www.learncpp.com/cpp-tutorial/struct-aggregate-initialization/)
- **09 · Designated initializers** · ⏳
  - learncpp: [13.8 Struct aggregate initialization](https://www.learncpp.com/cpp-tutorial/struct-aggregate-initialization/)
  - Reference: [cppreference: aggregate initialization (designated initializers)](https://en.cppreference.com/cpp/language/aggregate_initialization)
- **10 · Default member initializers** · ⏳
  - learncpp: [13.9 Default member initialization](https://www.learncpp.com/cpp-tutorial/default-member-initialization/)
- **11 · Passing and returning structs** · ⏳
  - learncpp: [13.10 Passing and returning structs](https://www.learncpp.com/cpp-tutorial/passing-and-returning-structs/)
- **12 · Padding and alignment** · ⏳
  - learncpp: [13.11 Struct miscellany](https://www.learncpp.com/cpp-tutorial/struct-miscellany/)
  - Reference: [cppreference: object alignment](https://en.cppreference.com/cpp/language/object)
- **13 · Member access through pointers** · ⏳
  - learncpp: [13.12 Member selection with pointers and references](https://www.learncpp.com/cpp-tutorial/member-selection-with-pointers-and-references/)
- **14 · Structured bindings** · ⏳
  - Related: [13.10 Passing and returning structs](https://www.learncpp.com/cpp-tutorial/passing-and-returning-structs/)
  - Reference: [cppreference: structured bindings](https://en.cppreference.com/cpp/language/structured_binding)
- **15 · std::pair and std::tuple** · ⏳
  - Related: [13.13 Class templates](https://www.learncpp.com/cpp-tutorial/class-templates/)
  - Reference: [cppreference: std::pair](https://en.cppreference.com/cpp/utility/pair) · [cppreference: std::tuple](https://en.cppreference.com/cpp/utility/tuple)
- **16 · Unions** · ⏳
  - Reference: [cppreference: union declaration](https://en.cppreference.com/cpp/language/union)
- **17 · A first look at class templates** · ⏳
  - learncpp: [13.13 Class templates](https://www.learncpp.com/cpp-tutorial/class-templates/)
- **18 · CTAD and deduction guides** · ⏳
  - learncpp: [13.14 Class template argument deduction (CTAD) and deduction guides](https://www.learncpp.com/cpp-tutorial/class-template-argument-deduction-ctad-and-deduction-guides/)
- **19 · Alias templates** · ⏳
  - learncpp: [13.15 Alias templates](https://www.learncpp.com/cpp-tutorial/alias-templates/) · [13.x Chapter 13 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-13-summary-and-quiz/)
- **20 · Reading the language reference** · ⏳
  - learncpp: [13.y Using a language reference](https://www.learncpp.com/cpp-tutorial/using-a-language-reference/)

## 11 · Classes & Objects (OOPS 1)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/classes-and-objects) · 0/29 live

- **01 · What object-oriented programming is** · ⏳
  - learncpp: [14.1 Introduction to object-oriented programming](https://www.learncpp.com/cpp-tutorial/introduction-to-object-oriented-programming/)
- **02 · Classes vs structs** · ⏳
  - learncpp: [14.2 Introduction to classes](https://www.learncpp.com/cpp-tutorial/introduction-to-classes/)
- **03 · Member functions** · ⏳
  - learncpp: [14.3 Member functions](https://www.learncpp.com/cpp-tutorial/member-functions/)
- **04 · const member functions** · ⏳
  - learncpp: [14.4 Const class objects and const member functions](https://www.learncpp.com/cpp-tutorial/const-class-objects-and-const-member-functions/)
- **05 · mutable members** · ⏳
  - Related: [14.4 Const class objects and const member functions](https://www.learncpp.com/cpp-tutorial/const-class-objects-and-const-member-functions/)
  - Reference: [cppreference: cv and mutable specifiers](https://en.cppreference.com/cpp/language/cv)
- **06 · Access specifiers** · ⏳
  - learncpp: [14.5 Public and private members and access specifiers](https://www.learncpp.com/cpp-tutorial/public-and-private-members-and-access-specifiers/)
- **07 · Getters and setters** · ⏳
  - learncpp: [14.6 Access functions](https://www.learncpp.com/cpp-tutorial/access-functions/)
- **08 · Returning references to members** · ⏳
  - learncpp: [14.7 Member functions returning references to data members](https://www.learncpp.com/cpp-tutorial/member-functions-returning-references-to-data-members/)
- **09 · Encapsulation and data hiding** · ⏳
  - learncpp: [14.8 The benefits of data hiding (encapsulation)](https://www.learncpp.com/cpp-tutorial/the-benefits-of-data-hiding-encapsulation/)
- **10 · Constructors** · ⏳
  - learncpp: [14.9 Introduction to constructors](https://www.learncpp.com/cpp-tutorial/introduction-to-constructors/)
- **11 · Member initializer lists** · ⏳
  - learncpp: [14.10 Constructor member initializer lists](https://www.learncpp.com/cpp-tutorial/constructor-member-initializer-lists/)
- **12 · Default constructors** · ⏳
  - learncpp: [14.11 Default constructors and default arguments](https://www.learncpp.com/cpp-tutorial/default-constructors-and-default-arguments/)
- **13 · Delegating constructors** · ⏳
  - learncpp: [14.12 Delegating constructors](https://www.learncpp.com/cpp-tutorial/delegating-constructors/)
- **14 · Temporary objects** · ⏳
  - learncpp: [14.13 Temporary class objects](https://www.learncpp.com/cpp-tutorial/temporary-class-objects/)
- **15 · Copy constructors** · ⏳
  - learncpp: [14.14 Introduction to the copy constructor](https://www.learncpp.com/cpp-tutorial/introduction-to-the-copy-constructor/)
- **16 · Copy elision and RVO** · ⏳
  - learncpp: [14.15 Class initialization and copy elision](https://www.learncpp.com/cpp-tutorial/class-initialization-and-copy-elision/)
- **17 · Converting constructors and explicit** · ⏳
  - learncpp: [14.16 Converting constructors and the explicit keyword](https://www.learncpp.com/cpp-tutorial/converting-constructors-and-the-explicit-keyword/)
- **18 · = default and = delete** · ⏳
  - Related: [14.11 Default constructors and default arguments](https://www.learncpp.com/cpp-tutorial/default-constructors-and-default-arguments/) · [14.14 Introduction to the copy constructor](https://www.learncpp.com/cpp-tutorial/introduction-to-the-copy-constructor/) · [11.4 Deleting functions](https://www.learncpp.com/cpp-tutorial/deleting-functions/)
  - Reference: [cppreference: function definition (defaulted and deleted)](https://en.cppreference.com/cpp/language/function)
- **19 · constexpr classes** · ⏳
  - learncpp: [14.17 Constexpr aggregates and classes](https://www.learncpp.com/cpp-tutorial/constexpr-aggregates-and-classes/) · [14.x Chapter 14 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-14-summary-and-quiz/)
- **20 · The this pointer and chaining** · ⏳
  - learncpp: [15.1 The hidden “this” pointer and member function chaining](https://www.learncpp.com/cpp-tutorial/the-hidden-this-pointer-and-member-function-chaining/)
- **21 · Classes in header and source files** · ⏳
  - learncpp: [15.2 Classes and header files](https://www.learncpp.com/cpp-tutorial/classes-and-header-files/)
- **22 · Nested types** · ⏳
  - learncpp: [15.3 Nested types (member types)](https://www.learncpp.com/cpp-tutorial/nested-types-member-types/)
- **23 · Destructors** · ⏳
  - learncpp: [15.4 Introduction to destructors](https://www.learncpp.com/cpp-tutorial/introduction-to-destructors/)
- **24 · Member functions of class templates** · ⏳
  - learncpp: [15.5 Class templates with member functions](https://www.learncpp.com/cpp-tutorial/class-templates-with-member-functions/)
- **25 · Static member variables** · ⏳
  - learncpp: [15.6 Static member variables](https://www.learncpp.com/cpp-tutorial/static-member-variables/)
- **26 · Static member functions** · ⏳
  - learncpp: [15.7 Static member functions](https://www.learncpp.com/cpp-tutorial/static-member-functions/)
- **27 · Friend functions** · ⏳
  - learncpp: [15.8 Friend non-member functions](https://www.learncpp.com/cpp-tutorial/friend-non-member-functions/)
- **28 · Friend classes** · ⏳
  - learncpp: [15.9 Friend classes and friend member functions](https://www.learncpp.com/cpp-tutorial/friend-classes-and-friend-member-functions/)
- **29 · Ref qualifiers** · ⏳
  - learncpp: [15.10 Ref qualifiers](https://www.learncpp.com/cpp-tutorial/ref-qualifiers/) · [15.x Chapter 15 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-15-summary-and-quiz/)

## 12 · std::vector & Arrays

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/std-vector-and-arrays) · 0/25 live

- **01 · Containers and arrays** · ⏳
  - learncpp: [16.1 Introduction to containers and arrays](https://www.learncpp.com/cpp-tutorial/introduction-to-containers-and-arrays/)
- **02 · std::vector basics** · ⏳
  - learncpp: [16.2 Introduction to std::vector and list constructors](https://www.learncpp.com/cpp-tutorial/introduction-to-stdvector-and-list-constructors/)
- **03 · Signed vs unsigned indices** · ⏳
  - learncpp: [16.3 std::vector and the unsigned length and subscript problem](https://www.learncpp.com/cpp-tutorial/stdvector-and-the-unsigned-length-and-subscript-problem/) · [16.7 Arrays, loops, and sign challenge solutions](https://www.learncpp.com/cpp-tutorial/arrays-loops-and-sign-challenge-solutions/)
- **04 · Passing std::vector** · ⏳
  - learncpp: [16.4 Passing std::vector](https://www.learncpp.com/cpp-tutorial/passing-stdvector/)
- **05 · Returning vectors and moving** · ⏳
  - learncpp: [16.5 Returning std::vector, and an introduction to move semantics](https://www.learncpp.com/cpp-tutorial/returning-stdvector-and-an-introduction-to-move-semantics/)
- **06 · Looping over arrays** · ⏳
  - learncpp: [16.6 Arrays and loops](https://www.learncpp.com/cpp-tutorial/arrays-and-loops/) · [16.7 Arrays, loops, and sign challenge solutions](https://www.learncpp.com/cpp-tutorial/arrays-loops-and-sign-challenge-solutions/)
- **07 · Range-based for loops** · ⏳
  - learncpp: [16.8 Range-based for loops (for-each)](https://www.learncpp.com/cpp-tutorial/range-based-for-loops-for-each/)
- **08 · Indexing with enumerators** · ⏳
  - learncpp: [16.9 Array indexing and length using enumerators](https://www.learncpp.com/cpp-tutorial/array-indexing-and-length-using-enumerators/)
- **09 · Size, capacity and how vector grows** · ⏳
  - learncpp: [16.10 std::vector resizing and capacity](https://www.learncpp.com/cpp-tutorial/stdvector-resizing-and-capacity/)
- **10 · push_back vs emplace_back** · ⏳
  - learncpp: [16.11 std::vector and stack behavior](https://www.learncpp.com/cpp-tutorial/stdvector-and-stack-behavior/)
  - Reference: [cppreference: std::vector::emplace_back](https://en.cppreference.com/cpp/container/vector/emplace_back)
- **11 · Using a vector as a stack** · ⏳
  - learncpp: [16.11 std::vector and stack behavior](https://www.learncpp.com/cpp-tutorial/stdvector-and-stack-behavior/)
- **12 · std::vector<bool>** · ⏳
  - learncpp: [16.12 std::vector<bool>](https://www.learncpp.com/cpp-tutorial/stdvector-bool/) · [16.x Chapter 16 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-16-summary-and-quiz/)
- **13 · std::array basics** · ⏳
  - learncpp: [17.1 Introduction to std::array](https://www.learncpp.com/cpp-tutorial/introduction-to-stdarray/)
- **14 · std::array length and indexing** · ⏳
  - learncpp: [17.2 std::array length and indexing](https://www.learncpp.com/cpp-tutorial/stdarray-length-and-indexing/)
- **15 · Passing and returning std::array** · ⏳
  - learncpp: [17.3 Passing and returning std::array](https://www.learncpp.com/cpp-tutorial/passing-and-returning-stdarray/)
- **16 · std::array of class types** · ⏳
  - learncpp: [17.4 std::array of class types, and brace elision](https://www.learncpp.com/cpp-tutorial/stdarray-of-class-types-and-brace-elision/)
- **17 · std::reference_wrapper** · ⏳
  - learncpp: [17.5 Arrays of references via std::reference_wrapper](https://www.learncpp.com/cpp-tutorial/arrays-of-references-via-stdreference_wrapper/)
- **18 · std::array with enumerations** · ⏳
  - learncpp: [17.6 std::array and enumerations](https://www.learncpp.com/cpp-tutorial/stdarray-and-enumerations/)
- **19 · C-style arrays** · ⏳
  - learncpp: [17.7 Introduction to C-style arrays](https://www.learncpp.com/cpp-tutorial/introduction-to-c-style-arrays/)
- **20 · Array decay** · ⏳
  - learncpp: [17.8 C-style array decay](https://www.learncpp.com/cpp-tutorial/c-style-array-decay/)
- **21 · Pointer arithmetic** · ⏳
  - learncpp: [17.9 Pointer arithmetic and subscripting](https://www.learncpp.com/cpp-tutorial/pointer-arithmetic-and-subscripting/)
- **22 · C-style strings** · ⏳
  - learncpp: [17.10 C-style strings](https://www.learncpp.com/cpp-tutorial/c-style-strings/) · [17.11 C-style string symbolic constants](https://www.learncpp.com/cpp-tutorial/c-style-string-symbolic-constants/)
- **23 · Multidimensional arrays** · ⏳
  - learncpp: [17.12 Multidimensional C-style Arrays](https://www.learncpp.com/cpp-tutorial/multidimensional-c-style-arrays/)
- **24 · Multidimensional std::array** · ⏳
  - learncpp: [17.13 Multidimensional std::array](https://www.learncpp.com/cpp-tutorial/multidimensional-stdarray/) · [17.x Chapter 17 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-17-summary-and-quiz/)
- **25 · std::span** · ⏳
  - Related: [17.8 C-style array decay](https://www.learncpp.com/cpp-tutorial/c-style-array-decay/)
  - Reference: [cppreference: std::span](https://en.cppreference.com/cpp/container/span)

## 13 · STL Containers, Iterators & Algorithms

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/stl-containers-iterators-and-algorithms) · 0/19 live

- **01 · The STL at a glance** · ⏳
  - learncpp: [D.21.1 The Standard Library (archived)](https://www.learncpp.com/cpp-tutorial/the-standard-library/) · [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/)
- **02 · Sorting by hand: selection sort** · ⏳
  - learncpp: [18.1 Sorting an array using selection sort](https://www.learncpp.com/cpp-tutorial/sorting-an-array-using-selection-sort/)
- **03 · Iterators** · ⏳
  - learncpp: [18.2 Introduction to iterators](https://www.learncpp.com/cpp-tutorial/introduction-to-iterators/) · [D.21.3 STL iterators overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-iterators-overview/)
- **04 · Iterator categories** · ⏳
  - Related: [D.21.3 STL iterators overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-iterators-overview/)
  - Reference: [cppreference: iterator library](https://en.cppreference.com/cpp/iterator)
- **05 · Iterator invalidation** · ⏳
  - Related: [18.2 Introduction to iterators](https://www.learncpp.com/cpp-tutorial/introduction-to-iterators/)
  - Reference: [cppreference: containers library (iterator invalidation)](https://en.cppreference.com/cpp/container)
- **06 · deque, list and forward_list** · ⏳
  - Related: [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/)
  - Reference: [cppreference: std::deque](https://en.cppreference.com/cpp/container/deque) · [cppreference: std::list](https://en.cppreference.com/cpp/container/list) · [cppreference: std::forward_list](https://en.cppreference.com/cpp/container/forward_list)
- **07 · stack, queue and priority_queue** · ⏳
  - Related: [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/) · [16.11 std::vector and stack behavior](https://www.learncpp.com/cpp-tutorial/stdvector-and-stack-behavior/)
  - Reference: [cppreference: std::stack](https://en.cppreference.com/cpp/container/stack) · [cppreference: std::queue](https://en.cppreference.com/cpp/container/queue) · [cppreference: std::priority_queue](https://en.cppreference.com/cpp/container/priority_queue)
- **08 · set and multiset** · ⏳
  - Related: [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/)
  - Reference: [cppreference: std::set](https://en.cppreference.com/cpp/container/set) · [cppreference: std::multiset](https://en.cppreference.com/cpp/container/multiset)
- **09 · map and multimap** · ⏳
  - Related: [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/)
  - Reference: [cppreference: std::map](https://en.cppreference.com/cpp/container/map) · [cppreference: std::multimap](https://en.cppreference.com/cpp/container/multimap)
- **10 · unordered_set and unordered_map** · ⏳
  - Related: [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/)
  - Reference: [cppreference: std::unordered_set](https://en.cppreference.com/cpp/container/unordered_set) · [cppreference: std::unordered_map](https://en.cppreference.com/cpp/container/unordered_map)
- **11 · Custom comparators and hashes** · ⏳
  - Related: [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/)
  - Reference: [cppreference: Compare requirement](https://en.cppreference.com/cpp/named_req/Compare) · [cppreference: std::hash](https://en.cppreference.com/cpp/utility/hash)
- **12 · Choosing the right container** · ⏳
  - Related: [D.21.2 STL containers overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-containers-overview/)
  - Reference: [cppreference: containers library](https://en.cppreference.com/cpp/container)
- **13 · Standard algorithms** · ⏳
  - learncpp: [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/) · [D.21.4 STL algorithms overview (archived)](https://www.learncpp.com/cpp-tutorial/stl-algorithms-overview/)
- **14 · Sorting and searching algorithms** · ⏳
  - Related: [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/)
  - Reference: [cppreference: std::sort](https://en.cppreference.com/cpp/algorithm/sort) · [cppreference: std::lower_bound](https://en.cppreference.com/cpp/algorithm/lower_bound)
- **15 · Modifying algorithms and erase-remove** · ⏳
  - Related: [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/)
  - Reference: [cppreference: std::remove](https://en.cppreference.com/cpp/algorithm/remove) · [cppreference: std::erase / std::erase_if (vector)](https://en.cppreference.com/cpp/container/vector/erase2)
- **16 · Numeric algorithms** · ⏳
  - Related: [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/)
  - Reference: [cppreference: <numeric>](https://en.cppreference.com/cpp/header/numeric)
- **17 · Heap and partition algorithms** · ⏳
  - Related: [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/)
  - Reference: [cppreference: std::make_heap](https://en.cppreference.com/cpp/algorithm/make_heap) · [cppreference: std::partition](https://en.cppreference.com/cpp/algorithm/partition) · [cppreference: std::nth_element](https://en.cppreference.com/cpp/algorithm/nth_element)
- **18 · Ranges and views (C++20)** · ⏳
  - Related: [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/)
  - Reference: [cppreference: ranges library](https://en.cppreference.com/cpp/ranges)
- **19 · Timing your code** · ⏳
  - learncpp: [18.4 Timing your code](https://www.learncpp.com/cpp-tutorial/timing-your-code/)

## 14 · Dynamic Allocation

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/dynamic-allocation) · 0/12 live

- **01 · The stack and the heap** · ⏳
  - learncpp: [20.2 The stack and the heap](https://www.learncpp.com/cpp-tutorial/the-stack-and-the-heap/)
- **02 · new and delete** · ⏳
  - learncpp: [19.1 Dynamic memory allocation with new and delete](https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/)
- **03 · Dynamic arrays with new[]** · ⏳
  - learncpp: [19.2 Dynamically allocating arrays](https://www.learncpp.com/cpp-tutorial/dynamically-allocating-arrays/)
- **04 · Destructors and cleanup** · ⏳
  - learncpp: [19.3 Destructors](https://www.learncpp.com/cpp-tutorial/destructors/)
- **05 · Pointers to pointers** · ⏳
  - learncpp: [19.4 Pointers to pointers and dynamic multidimensional arrays](https://www.learncpp.com/cpp-tutorial/pointers-to-pointers/)
- **06 · Dynamic multidimensional arrays** · ⏳
  - learncpp: [19.4 Pointers to pointers and dynamic multidimensional arrays](https://www.learncpp.com/cpp-tutorial/pointers-to-pointers/)
- **07 · void pointers** · ⏳
  - learncpp: [19.5 Void pointers](https://www.learncpp.com/cpp-tutorial/void-pointers/)
- **08 · Leaks, dangling and double deletes** · ⏳
  - Related: [19.1 Dynamic memory allocation with new and delete](https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/)
  - Reference: [Clang: AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)
- **09 · new/delete vs malloc/free** · ⏳
  - Related: [19.1 Dynamic memory allocation with new and delete](https://www.learncpp.com/cpp-tutorial/dynamic-memory-allocation-with-new-and-delete/)
  - Reference: [cppreference: std::malloc](https://en.cppreference.com/cpp/memory/c/malloc)
- **10 · Placement new** · ⏳
  - Reference: [cppreference: new expression (placement new)](https://en.cppreference.com/cpp/language/new)
- **11 · Overloading new and delete** · ⏳
  - Reference: [cppreference: operator new](https://en.cppreference.com/cpp/memory/new/operator_new)
- **12 · Allocators and memory pools** · ⏳
  - Reference: [cppreference: Allocator requirement](https://en.cppreference.com/cpp/named_req/Allocator) · [cppreference: std::pmr::polymorphic_allocator](https://en.cppreference.com/cpp/memory/polymorphic_allocator)

## 15 · Function Pointers, Recursion & Lambdas

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/function-pointers-recursion-and-lambdas) · 0/10 live

- **01 · Function pointers** · ⏳
  - learncpp: [20.1 Function Pointers](https://www.learncpp.com/cpp-tutorial/function-pointers/)
- **02 · Callbacks and std::function** · ⏳
  - learncpp: [20.1 Function Pointers](https://www.learncpp.com/cpp-tutorial/function-pointers/)
  - Reference: [cppreference: std::function](https://en.cppreference.com/cpp/utility/functional/function)
- **03 · Recursion** · ⏳
  - learncpp: [20.3 Recursion](https://www.learncpp.com/cpp-tutorial/recursion/)
- **04 · Command-line arguments** · ⏳
  - learncpp: [20.4 Command line arguments](https://www.learncpp.com/cpp-tutorial/command-line-arguments/)
- **05 · Ellipsis and why to avoid it** · ⏳
  - learncpp: [20.5 Ellipsis (and why to avoid them)](https://www.learncpp.com/cpp-tutorial/ellipsis-and-why-to-avoid-them/)
- **06 · Lambdas** · ⏳
  - learncpp: [20.6 Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/)
- **07 · Lambda captures** · ⏳
  - learncpp: [20.7 Lambda captures](https://www.learncpp.com/cpp-tutorial/lambda-captures/) · [20.x Chapter 20 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-20-summary-and-quiz/)
- **08 · Generic lambdas** · ⏳
  - learncpp: [20.6 Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/)
- **09 · Lambdas with STL algorithms** · ⏳
  - learncpp: [20.6 Introduction to lambdas (anonymous functions)](https://www.learncpp.com/cpp-tutorial/introduction-to-lambdas-anonymous-functions/) · [18.3 Introduction to standard library algorithms](https://www.learncpp.com/cpp-tutorial/introduction-to-standard-library-algorithms/)
- **10 · std::invoke and std::bind** · ⏳
  - Reference: [cppreference: std::invoke](https://en.cppreference.com/cpp/utility/functional/invoke) · [cppreference: std::bind](https://en.cppreference.com/cpp/utility/functional/bind)

## 16 · Operator Overloading (OOPS 2)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/operator-overloading) · 0/19 live

- **01 · Operator overloading basics** · ⏳
  - learncpp: [21.1 Introduction to operator overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-operator-overloading/)
- **02 · Overloading with friend functions** · ⏳
  - learncpp: [21.2 Overloading the arithmetic operators using friend functions](https://www.learncpp.com/cpp-tutorial/overloading-the-arithmetic-operators-using-friend-functions/)
- **03 · Overloading with normal functions** · ⏳
  - learncpp: [21.3 Overloading operators using normal functions](https://www.learncpp.com/cpp-tutorial/overloading-operators-using-normal-functions/)
- **04 · Overloading << and >>** · ⏳
  - learncpp: [21.4 Overloading the I/O operators](https://www.learncpp.com/cpp-tutorial/overloading-the-io-operators/)
- **05 · Overloading with member functions** · ⏳
  - learncpp: [21.5 Overloading operators using member functions](https://www.learncpp.com/cpp-tutorial/overloading-operators-using-member-functions/)
- **06 · Unary operators** · ⏳
  - learncpp: [21.6 Overloading unary operators +, -, and !](https://www.learncpp.com/cpp-tutorial/overloading-unary-operators/)
- **07 · Comparison operators** · ⏳
  - learncpp: [21.7 Overloading the comparison operators](https://www.learncpp.com/cpp-tutorial/overloading-the-comparison-operators/)
- **08 · The spaceship operator <=>** · ⏳
  - Related: [21.7 Overloading the comparison operators](https://www.learncpp.com/cpp-tutorial/overloading-the-comparison-operators/) · [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/)
  - Reference: [cppreference: default comparisons](https://en.cppreference.com/cpp/language/default_comparisons)
- **09 · Increment and decrement** · ⏳
  - learncpp: [21.8 Overloading the increment and decrement operators](https://www.learncpp.com/cpp-tutorial/overloading-the-increment-and-decrement-operators/)
- **10 · The subscript operator []** · ⏳
  - learncpp: [21.9 Overloading the subscript operator](https://www.learncpp.com/cpp-tutorial/overloading-the-subscript-operator/)
- **11 · The call operator () and functors** · ⏳
  - learncpp: [21.10 Overloading the parenthesis operator](https://www.learncpp.com/cpp-tutorial/overloading-the-parenthesis-operator/)
- **12 · Conversion operators** · ⏳
  - learncpp: [21.11 Overloading typecasts](https://www.learncpp.com/cpp-tutorial/overloading-typecasts/)
- **13 · Overloading -> and *** · ⏳
  - Reference: [cppreference: operator overloading](https://en.cppreference.com/cpp/language/operators)
- **14 · The assignment operator** · ⏳
  - learncpp: [21.12 Overloading the assignment operator](https://www.learncpp.com/cpp-tutorial/overloading-the-assignment-operator/)
- **15 · Shallow vs deep copy** · ⏳
  - learncpp: [21.13 Shallow vs. deep copying](https://www.learncpp.com/cpp-tutorial/shallow-vs-deep-copying/)
- **16 · The copy-and-swap idiom** · ⏳
  - Related: [21.12 Overloading the assignment operator](https://www.learncpp.com/cpp-tutorial/overloading-the-assignment-operator/)
  - Reference: [cppreference: copy assignment operator](https://en.cppreference.com/cpp/language/copy_assignment)
- **17 · Operators and function templates** · ⏳
  - learncpp: [21.14 Overloading operators and function templates](https://www.learncpp.com/cpp-tutorial/overloading-operators-and-function-templates/)
- **18 · Rules and good practice** · ⏳
  - learncpp: [21.x Chapter 21 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-21-summary-and-quiz/)
  - Related: [21.1 Introduction to operator overloading](https://www.learncpp.com/cpp-tutorial/introduction-to-operator-overloading/)
  - Reference: [cppreference: operator overloading](https://en.cppreference.com/cpp/language/operators)
- **19 · Project: a fully overloaded class** · ⏳
  - learncpp: [21.y Chapter 21 project](https://www.learncpp.com/cpp-tutorial/chapter-21-project/)

## 17 · Move Semantics & Smart Pointers

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/move-semantics-and-smart-pointers) · 0/13 live

- **01 · Why smart pointers and moves exist** · ⏳
  - learncpp: [22.1 Introduction to smart pointers and move semantics](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/)
- **02 · RAII** · ⏳
  - Related: [19.3 Destructors](https://www.learncpp.com/cpp-tutorial/destructors/) · [22.1 Introduction to smart pointers and move semantics](https://www.learncpp.com/cpp-tutorial/introduction-to-smart-pointers-move-semantics/)
  - Reference: [cppreference: RAII](https://en.cppreference.com/cpp/language/raii)
- **03 · Rvalue references** · ⏳
  - learncpp: [22.2 R-value references](https://www.learncpp.com/cpp-tutorial/rvalue-references/)
- **04 · Move constructor and move assignment** · ⏳
  - learncpp: [22.3 Move constructors and move assignment](https://www.learncpp.com/cpp-tutorial/move-constructors-and-move-assignment/)
- **05 · std::move** · ⏳
  - learncpp: [22.4 std::move](https://www.learncpp.com/cpp-tutorial/stdmove/)
- **06 · The rule of three, five and zero** · ⏳
  - Related: [21.12 Overloading the assignment operator](https://www.learncpp.com/cpp-tutorial/overloading-the-assignment-operator/) · [22.3 Move constructors and move assignment](https://www.learncpp.com/cpp-tutorial/move-constructors-and-move-assignment/)
  - Reference: [cppreference: the rule of three/five/zero](https://en.cppreference.com/cpp/language/rule_of_three)
- **07 · std::unique_ptr** · ⏳
  - learncpp: [22.5 std::unique_ptr](https://www.learncpp.com/cpp-tutorial/stdunique_ptr/)
- **08 · std::shared_ptr** · ⏳
  - learncpp: [22.6 std::shared_ptr](https://www.learncpp.com/cpp-tutorial/stdshared_ptr/)
- **09 · make_unique and make_shared** · ⏳
  - learncpp: [22.5 std::unique_ptr](https://www.learncpp.com/cpp-tutorial/stdunique_ptr/) · [22.6 std::shared_ptr](https://www.learncpp.com/cpp-tutorial/stdshared_ptr/)
- **10 · Custom deleters** · ⏳
  - Reference: [cppreference: std::unique_ptr](https://en.cppreference.com/cpp/memory/unique_ptr)
- **11 · std::weak_ptr and reference cycles** · ⏳
  - learncpp: [22.7 Circular dependency issues with std::shared_ptr, and std::weak_ptr](https://www.learncpp.com/cpp-tutorial/circular-dependency-issues-with-stdshared_ptr-and-stdweak_ptr/) · [22.x Chapter 22 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-22-summary-and-quiz/)
- **12 · Forwarding references** · ⏳
  - Related: [22.2 R-value references](https://www.learncpp.com/cpp-tutorial/rvalue-references/)
  - Reference: [cppreference: references (forwarding references)](https://en.cppreference.com/cpp/language/reference)
- **13 · Perfect forwarding with std::forward** · ⏳
  - Related: [22.4 std::move](https://www.learncpp.com/cpp-tutorial/stdmove/)
  - Reference: [cppreference: std::forward](https://en.cppreference.com/cpp/utility/forward)

## 18 · Object Relationships (OOPS 3)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/object-relationships) · 0/9 live

- **01 · Kinds of object relationships** · ⏳
  - learncpp: [23.1 Object relationships](https://www.learncpp.com/cpp-tutorial/object-relationships/)
- **02 · Composition** · ⏳
  - learncpp: [23.2 Composition](https://www.learncpp.com/cpp-tutorial/composition/)
- **03 · Aggregation** · ⏳
  - learncpp: [23.3 Aggregation](https://www.learncpp.com/cpp-tutorial/aggregation/)
- **04 · Association** · ⏳
  - learncpp: [23.4 Association](https://www.learncpp.com/cpp-tutorial/association/)
- **05 · Dependencies** · ⏳
  - learncpp: [23.5 Dependencies](https://www.learncpp.com/cpp-tutorial/dependencies/)
- **06 · Ownership and lifetimes** · ⏳
  - Related: [23.2 Composition](https://www.learncpp.com/cpp-tutorial/composition/) · [23.3 Aggregation](https://www.learncpp.com/cpp-tutorial/aggregation/) · [22.5 std::unique_ptr](https://www.learncpp.com/cpp-tutorial/stdunique_ptr/) · [22.6 std::shared_ptr](https://www.learncpp.com/cpp-tutorial/stdshared_ptr/)
  - _Our own material._
- **07 · Container classes** · ⏳
  - learncpp: [23.6 Container classes](https://www.learncpp.com/cpp-tutorial/container-classes/)
- **08 · std::initializer_list** · ⏳
  - learncpp: [23.7 std::initializer_list](https://www.learncpp.com/cpp-tutorial/stdinitializer_list/) · [23.x Chapter 23 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-23-summary-and-quiz/)
- **09 · Composition over inheritance** · ⏳
  - Related: [23.2 Composition](https://www.learncpp.com/cpp-tutorial/composition/) · [24.1 Introduction to inheritance](https://www.learncpp.com/cpp-tutorial/introduction-to-inheritance/)
  - _Our own material._

## 19 · Inheritance (OOPS 4)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/inheritance) · 0/10 live

- **01 · What inheritance is** · ⏳
  - learncpp: [24.1 Introduction to inheritance](https://www.learncpp.com/cpp-tutorial/introduction-to-inheritance/)
- **02 · Basic inheritance** · ⏳
  - learncpp: [24.2 Basic inheritance in C++](https://www.learncpp.com/cpp-tutorial/basic-inheritance-in-c/)
- **03 · Order of construction and destruction** · ⏳
  - learncpp: [24.3 Order of construction of derived classes](https://www.learncpp.com/cpp-tutorial/order-of-construction-of-derived-classes/)
- **04 · Initializing the base class** · ⏳
  - learncpp: [24.4 Constructors and initialization of derived classes](https://www.learncpp.com/cpp-tutorial/constructors-and-initialization-of-derived-classes/)
- **05 · Inheriting constructors** · ⏳
  - Related: [24.4 Constructors and initialization of derived classes](https://www.learncpp.com/cpp-tutorial/constructors-and-initialization-of-derived-classes/)
  - Reference: [cppreference: using-declaration (inheriting constructors)](https://en.cppreference.com/cpp/language/using_declaration)
- **06 · Access specifiers in inheritance** · ⏳
  - learncpp: [24.5 Inheritance and access specifiers](https://www.learncpp.com/cpp-tutorial/inheritance-and-access-specifiers/)
- **07 · Adding to a derived class** · ⏳
  - learncpp: [24.6 Adding new functionality to a derived class](https://www.learncpp.com/cpp-tutorial/adding-new-functionality-to-a-derived-class/)
- **08 · Overriding inherited functions** · ⏳
  - learncpp: [24.7 Calling inherited functions and overriding behavior](https://www.learncpp.com/cpp-tutorial/calling-inherited-functions-and-overriding-behavior/)
- **09 · Hiding inherited members** · ⏳
  - learncpp: [24.8 Hiding inherited functionality](https://www.learncpp.com/cpp-tutorial/hiding-inherited-functionality/)
- **10 · Multiple inheritance** · ⏳
  - learncpp: [24.9 Multiple inheritance](https://www.learncpp.com/cpp-tutorial/multiple-inheritance/) · [24.x Chapter 24 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-24-summary-and-quiz/)

## 20 · Virtual Functions & Polymorphism (OOPS 5)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/virtual-functions-and-polymorphism) · 0/16 live

- **01 · Base pointers to derived objects** · ⏳
  - learncpp: [25.1 Pointers and references to the base class of derived objects](https://www.learncpp.com/cpp-tutorial/pointers-and-references-to-the-base-class-of-derived-objects/)
- **02 · Virtual functions** · ⏳
  - learncpp: [25.2 Virtual functions and polymorphism](https://www.learncpp.com/cpp-tutorial/virtual-functions/)
- **03 · override, final and covariant returns** · ⏳
  - learncpp: [25.3 The override and final specifiers, and covariant return types](https://www.learncpp.com/cpp-tutorial/the-override-and-final-specifiers-and-covariant-return-types/)
- **04 · Virtual destructors** · ⏳
  - learncpp: [25.4 Virtual destructors, virtual assignment, and overriding virtualization](https://www.learncpp.com/cpp-tutorial/virtual-destructors-virtual-assignment-and-overriding-virtualization/)
- **05 · Early and late binding** · ⏳
  - learncpp: [25.5 Early binding and late binding](https://www.learncpp.com/cpp-tutorial/early-binding-and-late-binding/)
- **06 · The virtual table** · ⏳
  - learncpp: [25.6 The virtual table](https://www.learncpp.com/cpp-tutorial/the-virtual-table/)
- **07 · Virtual calls in constructors** · ⏳
  - Related: [25.2 Virtual functions and polymorphism](https://www.learncpp.com/cpp-tutorial/virtual-functions/)
  - Reference: [cppreference: virtual functions (during construction and destruction)](https://en.cppreference.com/cpp/language/virtual)
- **08 · Pure virtual functions and interfaces** · ⏳
  - learncpp: [25.7 Pure virtual functions, abstract base classes, and interface classes](https://www.learncpp.com/cpp-tutorial/pure-virtual-functions-abstract-base-classes-and-interface-classes/)
- **09 · Virtual base classes and the diamond** · ⏳
  - learncpp: [25.8 Virtual base classes](https://www.learncpp.com/cpp-tutorial/virtual-base-classes/)
- **10 · Object slicing** · ⏳
  - learncpp: [25.9 Object slicing](https://www.learncpp.com/cpp-tutorial/object-slicing/)
- **11 · dynamic_cast** · ⏳
  - learncpp: [25.10 Dynamic casting](https://www.learncpp.com/cpp-tutorial/dynamic-casting/)
- **12 · RTTI and typeid** · ⏳
  - Related: [25.10 Dynamic casting](https://www.learncpp.com/cpp-tutorial/dynamic-casting/)
  - Reference: [cppreference: typeid](https://en.cppreference.com/cpp/language/typeid)
- **13 · Printing derived classes with <<** · ⏳
  - learncpp: [25.11 Printing inherited classes using operator<<](https://www.learncpp.com/cpp-tutorial/printing-inherited-classes-using-operator/) · [25.x Chapter 25 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-25-summary-and-quiz/)
- **14 · Static polymorphism with CRTP** · ⏳
  - Reference: [cppreference: CRTP](https://en.cppreference.com/cpp/language/crtp)
- **15 · The cost of virtual calls** · ⏳
  - Related: [25.6 The virtual table](https://www.learncpp.com/cpp-tutorial/the-virtual-table/)
  - _Our own material._
- **16 · Type erasure** · ⏳
  - Reference: [cppreference: std::function](https://en.cppreference.com/cpp/utility/functional/function) · [cppreference: std::any](https://en.cppreference.com/cpp/utility/any)

## 21 · Templates & Classes (OOPS 6)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/templates-and-classes) · 0/14 live

- **01 · Class templates** · ⏳
  - learncpp: [26.1 Template classes](https://www.learncpp.com/cpp-tutorial/template-classes/)
- **02 · Non-type parameters in class templates** · ⏳
  - learncpp: [26.2 Template non-type parameters](https://www.learncpp.com/cpp-tutorial/template-non-type-parameters/)
- **03 · Function template specialization** · ⏳
  - learncpp: [26.3 Function template specialization](https://www.learncpp.com/cpp-tutorial/function-template-specialization/)
- **04 · Class template specialization** · ⏳
  - learncpp: [26.4 Class template specialization](https://www.learncpp.com/cpp-tutorial/class-template-specialization/)
- **05 · Partial specialization** · ⏳
  - learncpp: [26.5 Partial template specialization](https://www.learncpp.com/cpp-tutorial/partial-template-specialization/)
- **06 · Partial specialization for pointers** · ⏳
  - learncpp: [26.6 Partial template specialization for pointers](https://www.learncpp.com/cpp-tutorial/partial-template-specialization-for-pointers/) · [26.x Chapter 26 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-26-summary-and-quiz/)
- **07 · Dependent names and typename** · ⏳
  - Reference: [cppreference: dependent names](https://en.cppreference.com/cpp/language/dependent_name)
- **08 · Variadic templates** · ⏳
  - Reference: [cppreference: parameter packs](https://en.cppreference.com/cpp/language/parameter_pack)
- **09 · Fold expressions** · ⏳
  - Reference: [cppreference: fold expressions](https://en.cppreference.com/cpp/language/fold)
- **10 · Template template parameters** · ⏳
  - Reference: [cppreference: template parameters](https://en.cppreference.com/cpp/language/template_parameters)
- **11 · Type traits** · ⏳
  - Reference: [cppreference: metaprogramming library](https://en.cppreference.com/cpp/meta)
- **12 · SFINAE and enable_if** · ⏳
  - Reference: [cppreference: SFINAE](https://en.cppreference.com/cpp/language/sfinae) · [cppreference: std::enable_if](https://en.cppreference.com/cpp/types/enable_if)
- **13 · Concepts and requires** · ⏳
  - Related: [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/)
  - Reference: [cppreference: constraints and concepts](https://en.cppreference.com/cpp/language/constraints)
- **14 · Template metaprogramming basics** · ⏳
  - Reference: [cppreference: metaprogramming library](https://en.cppreference.com/cpp/meta)

## 22 · Exceptions

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/exceptions) · 0/14 live

- **01 · Why exceptions exist** · ⏳
  - learncpp: [27.1 The need for exceptions](https://www.learncpp.com/cpp-tutorial/the-need-for-exceptions/)
- **02 · throw, try and catch** · ⏳
  - learncpp: [27.2 Basic exception handling](https://www.learncpp.com/cpp-tutorial/basic-exception-handling/)
- **03 · Stack unwinding** · ⏳
  - learncpp: [27.3 Exceptions, functions, and stack unwinding](https://www.learncpp.com/cpp-tutorial/exceptions-functions-and-stack-unwinding/)
- **04 · Uncaught exceptions and catch-all** · ⏳
  - learncpp: [27.4 Uncaught exceptions and catch-all handlers](https://www.learncpp.com/cpp-tutorial/uncaught-exceptions-catch-all-handlers/)
- **05 · Exceptions and class hierarchies** · ⏳
  - learncpp: [27.5 Exceptions, classes, and inheritance](https://www.learncpp.com/cpp-tutorial/exceptions-classes-and-inheritance/)
- **06 · The standard exception types** · ⏳
  - learncpp: [27.5 Exceptions, classes, and inheritance](https://www.learncpp.com/cpp-tutorial/exceptions-classes-and-inheritance/)
  - Reference: [cppreference: std::exception](https://en.cppreference.com/cpp/error/exception)
- **07 · Rethrowing exceptions** · ⏳
  - learncpp: [27.6 Rethrowing exceptions](https://www.learncpp.com/cpp-tutorial/rethrowing-exceptions/)
- **08 · Function try blocks** · ⏳
  - learncpp: [27.7 Function try blocks](https://www.learncpp.com/cpp-tutorial/function-try-blocks/)
- **09 · Throwing in constructors and destructors** · ⏳
  - learncpp: [27.7 Function try blocks](https://www.learncpp.com/cpp-tutorial/function-try-blocks/) · [27.8 Exception dangers and downsides](https://www.learncpp.com/cpp-tutorial/exception-dangers-and-downsides/)
- **10 · Downsides and costs of exceptions** · ⏳
  - learncpp: [27.8 Exception dangers and downsides](https://www.learncpp.com/cpp-tutorial/exception-dangers-and-downsides/)
- **11 · noexcept** · ⏳
  - learncpp: [27.9 Exception specifications and noexcept](https://www.learncpp.com/cpp-tutorial/exception-specifications-and-noexcept/)
- **12 · std::move_if_noexcept** · ⏳
  - learncpp: [27.10 std::move_if_noexcept](https://www.learncpp.com/cpp-tutorial/stdmove_if_noexcept/) · [27.x Chapter 27 summary and quiz](https://www.learncpp.com/cpp-tutorial/chapter-27-summary-and-quiz/)
- **13 · Exception safety guarantees** · ⏳
  - Related: [27.9 Exception specifications and noexcept](https://www.learncpp.com/cpp-tutorial/exception-specifications-and-noexcept/)
  - Reference: [cppreference: exceptions (exception safety)](https://en.cppreference.com/cpp/language/exceptions)
- **14 · Alternatives: error codes and expected** · ⏳
  - Related: [9.4 Detecting and handling errors](https://www.learncpp.com/cpp-tutorial/detecting-and-handling-errors/) · [B.5 Introduction to C++23](https://www.learncpp.com/cpp-tutorial/introduction-to-c23/)
  - Reference: [cppreference: std::expected](https://en.cppreference.com/cpp/utility/expected)

## 23 · Input/Output & Streams

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/input-output-and-streams) · 0/11 live

- **01 · How I/O streams work** · ⏳
  - learncpp: [28.1 Input and output (I/O) streams](https://www.learncpp.com/cpp-tutorial/input-and-output-io-streams/)
- **02 · Input with istream** · ⏳
  - learncpp: [28.2 Input with istream](https://www.learncpp.com/cpp-tutorial/input-with-istream/)
- **03 · Formatting output with ostream** · ⏳
  - learncpp: [28.3 Output with ostream and ios](https://www.learncpp.com/cpp-tutorial/output-with-ostream-and-ios/)
- **04 · String streams** · ⏳
  - learncpp: [28.4 Stream classes for strings](https://www.learncpp.com/cpp-tutorial/stream-classes-for-strings/)
- **05 · Stream states and validating input** · ⏳
  - learncpp: [28.5 Stream states and input validation](https://www.learncpp.com/cpp-tutorial/stream-states-and-input-validation/)
- **06 · Reading and writing files** · ⏳
  - learncpp: [28.6 Basic file I/O](https://www.learncpp.com/cpp-tutorial/basic-file-io/)
- **07 · Random access in files** · ⏳
  - learncpp: [28.7 Random file I/O](https://www.learncpp.com/cpp-tutorial/random-file-io/)
- **08 · Binary file I/O** · ⏳
  - Related: [28.6 Basic file I/O](https://www.learncpp.com/cpp-tutorial/basic-file-io/)
  - Reference: [cppreference: std::basic_ostream::write](https://en.cppreference.com/cpp/io/basic_ostream/write) · [cppreference: std::basic_istream::read](https://en.cppreference.com/cpp/io/basic_istream/read)
- **09 · std::format and std::print** · ⏳
  - Related: [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/) · [B.5 Introduction to C++23](https://www.learncpp.com/cpp-tutorial/introduction-to-c23/)
  - Reference: [cppreference: std::format](https://en.cppreference.com/cpp/utility/format/format) · [cppreference: std::print](https://en.cppreference.com/cpp/io/print)
- **10 · std::filesystem** · ⏳
  - Related: [B.3 Introduction to C++17](https://www.learncpp.com/cpp-tutorial/introduction-to-c17/)
  - Reference: [cppreference: filesystem library](https://en.cppreference.com/cpp/filesystem)
- **11 · Fast I/O for competitive programming** · ⏳
  - Reference: [cppreference: sync_with_stdio](https://en.cppreference.com/cpp/io/ios_base/sync_with_stdio)

## 24 · Modern C++ (11–23)

[Topic page](https://thelearninglogs.vercel.app/learning/cpp-oops/modern-cpp-11-23) · 0/16 live

- **01 · What C++11 changed** · ⏳
  - learncpp: [B.1 Introduction to C++11](https://www.learncpp.com/cpp-tutorial/introduction-to-c11/)
- **02 · C++14 additions** · ⏳
  - learncpp: [B.2 Introduction to C++14](https://www.learncpp.com/cpp-tutorial/introduction-to-c14/)
- **03 · C++17 additions** · ⏳
  - learncpp: [B.3 Introduction to C++17](https://www.learncpp.com/cpp-tutorial/introduction-to-c17/)
- **04 · C++20 additions** · ⏳
  - learncpp: [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/)
- **05 · C++23 additions** · ⏳
  - learncpp: [B.5 Introduction to C++23](https://www.learncpp.com/cpp-tutorial/introduction-to-c23/)
- **06 · std::variant and std::any** · ⏳
  - Related: [B.3 Introduction to C++17](https://www.learncpp.com/cpp-tutorial/introduction-to-c17/)
  - Reference: [cppreference: std::variant](https://en.cppreference.com/cpp/utility/variant) · [cppreference: std::any](https://en.cppreference.com/cpp/utility/any)
- **07 · Time with std::chrono** · ⏳
  - Related: [18.4 Timing your code](https://www.learncpp.com/cpp-tutorial/timing-your-code/)
  - Reference: [cppreference: date and time library](https://en.cppreference.com/cpp/chrono)
- **08 · Regular expressions with <regex>** · ⏳
  - Reference: [cppreference: regular expressions library](https://en.cppreference.com/cpp/regex)
- **09 · Threads: std::thread and std::jthread** · ⏳
  - Reference: [cppreference: std::thread](https://en.cppreference.com/cpp/thread/thread) · [cppreference: std::jthread](https://en.cppreference.com/cpp/thread/jthread)
- **10 · Mutexes and locks** · ⏳
  - Reference: [cppreference: std::mutex](https://en.cppreference.com/cpp/thread/mutex) · [cppreference: std::scoped_lock](https://en.cppreference.com/cpp/thread/scoped_lock)
- **11 · Condition variables** · ⏳
  - Reference: [cppreference: std::condition_variable](https://en.cppreference.com/cpp/thread/condition_variable)
- **12 · Atomics and the memory model** · ⏳
  - Reference: [cppreference: std::atomic](https://en.cppreference.com/cpp/atomic/atomic) · [cppreference: std::memory_order](https://en.cppreference.com/cpp/atomic/memory_order)
- **13 · Futures, promises and std::async** · ⏳
  - Reference: [cppreference: std::future](https://en.cppreference.com/cpp/thread/future) · [cppreference: std::async](https://en.cppreference.com/cpp/thread/async)
- **14 · Coroutines** · ⏳
  - Related: [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/)
  - Reference: [cppreference: coroutines](https://en.cppreference.com/cpp/language/coroutines)
- **15 · Modules** · ⏳
  - Related: [B.4 Introduction to C++20](https://www.learncpp.com/cpp-tutorial/introduction-to-c20/)
  - Reference: [cppreference: modules](https://en.cppreference.com/cpp/language/modules)
- **16 · Looking ahead to C++26** · ⏳
  - Reference: [cppreference: C++26](https://en.cppreference.com/cpp/26)
