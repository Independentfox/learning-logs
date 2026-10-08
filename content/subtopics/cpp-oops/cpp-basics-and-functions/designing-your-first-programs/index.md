---
subtopic: Designing your first programs
published: 2026-10-09
summary:
  - Design before you type. State the goal, list the requirements, and break the job into small steps you already know how to do.
  - Outline main as a list of function calls first, then write and test one function at a time.
  - Build incrementally, compiling and running after every small change, so a new error can only be in the few lines you just wrote.
  - Get it working first, then make it clear. Prefer readable code over clever or slightly faster code.
  - Programs rarely come out right the first time. Iterating is the normal way programs get written.
sources:
  - https://www.learncpp.com/cpp-tutorial/developing-your-first-program/
  - https://www.learncpp.com/cpp-tutorial/how-to-design-your-first-programs/
  - https://www.learncpp.com/cpp-tutorial/chapter-1-summary-and-quiz/
  - https://www.learncpp.com/cpp-tutorial/chapter-2-summary-and-quiz/
questions:
  - title: Input and Output
    url: https://www.hackerrank.com/challenges/cpp-input-and-output/problem
    difficulty: easy
  - title: Functions
    url: https://www.hackerrank.com/challenges/c-tutorial-functions/problem
    difficulty: easy
---

You now know enough C++ to write real, useful programs: variables, input and output, expressions, functions and multiple files. What's usually missing at this point isn't syntax, it's **process**. Faced with an empty file, where do you start? This page walks through designing and building a small program from scratch, and the habits that make every later program easier.

## Design first: five questions before any code

It's tempting to open the editor and start typing `int main()`, but five minutes of thinking first saves an hour of rewriting. We'll design one program the whole way through: **a trip cost calculator** that works out how much fuel a car journey needs and what it will cost.

### 1. What's the goal?

Say what the program does **in a sentence or two, from the user's point of view**:

> _The user enters how far they're driving, how efficient their car is, and the fuel price. The program tells them how many litres they'll need and how much the trip will cost._

If you can't write this sentence, you don't yet know what you're building.

### 2. What are the requirements?

List what the program **must** do, and any limits, without deciding _how_ yet:

- Read three numbers: distance (km), efficiency (km per litre) and fuel price (per litre).
- Decimal values must work: `12.5` km per litre, not just whole numbers.
- Print the fuel needed and the total cost.
- Keep the calculation separate from the input and output, so it can be reused and tested.

### 3. Tools, targets and a backup plan

Decide which compiler and editor you'll use and which platforms it must run on. And from the very first line, **keep your code backed up**, ideally in a version-control system like Git, so a deleted file or a bad change is never a disaster.

### 4. Break hard problems into easy ones

"Calculate the trip cost" is too big to write directly. Split it into smaller tasks, and split those again, until every piece is something you already know how to write. This is **top-down design**:

![The trip calculator broken down until every piece is small enough to write directly.](diagram:task-breakdown)

The leaves of the tree are tiny: reading one number, multiplying two numbers, printing one line. Each one becomes a function, or a few lines inside one.

### 5. In what order do things happen?

Put the tasks in sequence:

1. Read the distance, the efficiency and the price.
2. Work out the litres needed: distance ÷ efficiency.
3. Work out the cost: litres × price.
4. Print both results.

Now, finally, write code.

## Build it incrementally

The most important habit: **write a little, compile, run, check.** Then repeat. If you've only changed five lines since the last time it worked, any new error is in those five lines.

### Step 1: outline main

Start with `main` as a list of the steps, written as comments. It compiles and runs, and it does nothing yet:

```cpp title="trip-step1.cpp"
#include <iostream>

int main()
{
    // read distance, efficiency and price
    // calculate litres needed
    // calculate cost
    // print the results
    return 0;
}
```

### Step 2: the first function, tested on its own

Pick one task and make it real. Reading a number is needed three times, so it's a perfect function. Test it straight away by printing what it reads:

```cpp title="trip-step2.cpp"
#include <iostream>

double readValue(const char* prompt)
{
    std::cout << prompt;
    double value{};
    std::cin >> value;
    return value;
}

int main()
{
    double distance{readValue("Distance (km): ")};
    std::cout << "You entered " << distance << '\n'; // temporary check
    return 0;
}
```

```output title="terminal"
Distance (km): 240
You entered 240
```

`readValue` takes the prompt as a parameter, so one function can ask all three questions. (A `const char*` parameter accepts a piece of text written in quotes, a string literal. You'll meet the details in **C-style strings**. For now, read it as "some text".)

That `std::cout << "You entered "…` line is **temporary**. It's scaffolding that proves the function works, and it gets removed once it has done its job.

### Step 3: the calculations

Add each calculation as its own small function, each doing one job, with no input or output inside:

```cpp title="trip-step3.cpp"
double litresNeeded(double distanceKm, double kmPerLitre)
{
    return distanceKm / kmPerLitre;
}

double tripCost(double litres, double pricePerLitre)
{
    return litres * pricePerLitre;
}
```

Because they only _calculate_, they're easy to check by hand. 240 km at 12 km per litre needs 20 litres, and 20 litres at 105 per litre costs 2100.

### Step 4: put it together, and test it

```cpp title="trip.cpp"
#include <iostream>

double readValue(const char* prompt)
{
    std::cout << prompt;
    double value{};
    std::cin >> value;
    return value;
}

double litresNeeded(double distanceKm, double kmPerLitre)
{
    return distanceKm / kmPerLitre;
}

double tripCost(double litres, double pricePerLitre)
{
    return litres * pricePerLitre;
}

void printResults(double litres, double cost)
{
    std::cout << "Fuel needed: " << litres << " litres\n";
    std::cout << "Trip cost:   " << cost << '\n';
}

int main()
{
    double distance{readValue("Distance (km): ")};
    double efficiency{readValue("Efficiency (km per litre): ")};
    double price{readValue("Fuel price (per litre): ")};

    double litres{litresNeeded(distance, efficiency)};
    printResults(litres, tripCost(litres, price));
    return 0;
}
```

```output title="terminal"
Distance (km): 240
Efficiency (km per litre): 12
Fuel price (per litre): 105
Fuel needed: 20 litres
Trip cost:   2100
```

Test it with values you can check by hand, then with awkward ones like decimals and large numbers. Notice what _isn't_ handled yet: an efficiency of `0` divides by zero, and letters instead of numbers break the input. Write down gaps like that. Fixing them is the next version's job: see **Detecting and handling errors** and **Handling invalid input from std::cin**.

![Build in small steps, and compile and run after each one.](diagram:incremental-build)

## Make it work, then make it good

Once it works, read it again and improve it. Some common improvements:

**Don't overwrite the user's input.** Storing a result back into the variable you read leaves you unable to print the original later:

```cpp title="readability.cpp"
#include <iostream>

int main()
{
    std::cout << "Enter a number: ";
    int number{};
    std::cin >> number;

    // Hard to follow: number no longer holds what the user typed.
    // number = number * 2;
    // std::cout << "Double is " << number << '\n';

    // Clearer: compute the value where it's used.
    std::cout << "Double " << number << " is " << number * 2 << '\n';
    return 0;
}
```

```output title="terminal"
Enter a number: 7
Double 7 is 14
```

**Skip variables that are used only once,** when the expression is short and clear. `printResults(litres, tripCost(litres, price));` needs no `cost` variable. Keep a named variable when the name adds meaning, as `litres` does.

**Readable beats clever.** Prefer the version a teammate understands at a glance over a shorter or slightly faster one. The compiler's optimizer is very good at the speed part. Your job is clarity.

## Habits worth keeping

- **Start small.** Your first version should do less than the final one. Add features once it works.
- **Focus on one thing at a time.** Finish and test one function before starting the next.
- **Compile and run constantly.** Small steps mean small, findable mistakes.
- **Don't polish too early.** Making code beautiful before it works is wasted effort if the design changes.
- **Expect to iterate.** Experienced programmers rarely get it right first time either. They're just quicker at noticing and fixing what's wrong.
- **You don't need to remember everything.** Knowing _what's possible_ matters more than memorizing every detail. Look things up as you need them.

## Try it yourself

These use only what this topic has covered. Design each one first (goal, steps, functions), then build it incrementally.

1. **Arithmetic helper.** Read two integers and print their sum, difference and product. Write one function per operation.
   _Input `7 3`, expected output: `10`, `4`, `21`._
2. **Temperature converter.** Read a temperature in Celsius and print it in Fahrenheit, using `double celsiusToFahrenheit(double c)` with _F = C × 9 / 5 + 32_. Watch the order: written as `9 / 5 * c`, the `9 / 5` is integer division and gives `1`. Writing `c * 9 / 5` (or `9.0 / 5`) keeps the fraction.
   _Input `25`, expected output: `77`._
3. **Multi-file version.** Move the functions from exercise 1 into `arithmetic.cpp` with a header `arithmetic.h` (with a header guard), and build both files together. Avoid names like `math.h` that match a standard header.

## Interview corner

> [!IMPORTANT]
> Common questions on this topic:
>
> - **How do you approach a new programming problem?** Clarify the goal and requirements, break it down, outline, then build and test incrementally.
> - **What is top-down design?**
> - **Why compile and test after every small change?** It keeps every bug close to the code that caused it.
> - **Readable code vs fast code: which do you prioritize, and why?**
