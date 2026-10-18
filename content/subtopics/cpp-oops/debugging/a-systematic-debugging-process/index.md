---
subtopic: A systematic debugging process
published: 2026-10-19
summary:
  - Reproduce the bug reliably before anything else, with the exact input that triggers it and the output you expected.
  - The bug lives somewhere between the program's start and the first wrong value you can see. Narrow that range down like a guessing game.
  - Put checkpoints between stages and check each value against what you expected. The first wrong one tells you where to look.
  - Fix the root cause, not the symptom. Understand why the code is wrong before you change it.
  - After the fix, rerun the failing case and the cases that already worked, to make sure you haven't broken anything else.
sources:
  - https://www.learncpp.com/cpp-tutorial/the-debugging-process/
  - https://www.learncpp.com/cpp-tutorial/a-strategy-for-debugging/
---

When a program gives the wrong answer, the instinct is to stare at the code until the mistake jumps out. That works for ten lines. It stops working fast, mostly because you read the code with the same assumptions you had when you wrote it, so the wrong line looks right. A better approach is to stop guessing and work through it in steps. This page follows one real bug from "the total is wrong" to a tested fix.

## The bug

A shop's checkout program takes a quantity and a price per item. Orders over 1000 get 10% off, then 18% tax is added:

```cpp title="checkout.cpp"
#include <iostream>

double subtotalFor(int quantity, double price)
{
    return quantity * price;
}

double applyDiscount(double subtotal)
{
    if (subtotal > 1000)
        return subtotal - subtotal * (10 / 100); // 10% off big orders
    return subtotal;
}

double addTax(double amount)
{
    return amount * 1.18; // 18% tax
}

int main()
{
    int quantity{};
    double price{};
    std::cin >> quantity >> price;

    double total{addTax(applyDiscount(subtotalFor(quantity, price)))};
    std::cout << "Total: " << total << '\n';
    return 0;
}
```

It compiles without a single warning on GCC or Clang, even with `-Wall -Wextra`. A customer buys 5 items at 300 each and gets charged too much.

## 1. Reproduce it

You can't fix a bug you can't see. The first job is to make it happen on demand, and to know exactly what the right answer would have been.

The input is 5 items at 300. Working it out by hand: the subtotal is 1500. That's over 1000, so it takes 10% off, leaving 1350. Tax brings it to 1593. Now run it:

```output title="terminal, input 5 300"
Total: 1770
```

Wrong, and wrong every time with this input. Write the input and the expected output down. That pair is your **reproduction**, and you'll come back to it after the fix.

Some bugs only show up sometimes, after a long run, with certain input, or on one machine. It's worth spending real time making those reliable before you try to fix anything, because otherwise you can't tell whether a change helped.

## 2. Narrow it down

The bug has to be somewhere between the start of the program and the point where you first see a wrong value. At the moment that's "the whole program". The job is to shrink that range.

Think of it as the guessing game where someone picks a number and you're told "higher" or "lower". If a value is still correct at some point in the program, the bug is later. If it's already wrong, the bug is earlier, or right there.

This program runs in clear stages, so put a **checkpoint** after each one: print the value at that point and compare it with what you worked out by hand. Here `main` is split up so each stage's result can be printed:

```cpp title="main() with two checkpoints"
int main()
{
    int quantity{};
    double price{};
    std::cin >> quantity >> price;

    double subtotal{subtotalFor(quantity, price)};
    std::cerr << "subtotal = " << subtotal << '\n';       // checkpoint 1
    double discounted{applyDiscount(subtotal)};
    std::cerr << "discounted = " << discounted << '\n';   // checkpoint 2
    double total{addTax(discounted)};
    std::cout << "Total: " << total << '\n';
    return 0;
}
```

```output title="terminal, input 5 300"
subtotal = 1500
discounted = 1500
Total: 1770
```

Checkpoint 1 says 1500, which matches. So `subtotalFor` and the input are fine, and the bug is after that. Checkpoint 2 says 1500 too, but it should be 1350. So the bug is somewhere inside `applyDiscount`. One run, and the search went from the whole program to a three-line function.

The checkpoints print to `std::cerr` rather than `std::cout`. That keeps them out of the program's real output, so `./checkout > out.txt` still leaves them on screen. And `std::cerr` isn't buffered, so they appear immediately even if the program crashes right after. **Print debugging and logging** goes further into this technique.

![The value is checked after each stage; the first wrong one marks the stage that holds the bug.](diagram:narrowing-down)

## 3. Find the root cause and understand it

Now read `applyDiscount` closely, knowing it returns 1500 when it should return 1350:

```cpp title="the suspect line"
return subtotal - subtotal * (10 / 100);
```

`10 / 100` is evaluated first, because of the parentheses. Both are integers, so it's integer division, and the answer is `0`, not `0.1`. The line works out to `subtotal - subtotal * 0`, which is just `subtotal`. The discount was never applied for anyone.

This is the **root cause**. Notice it isn't where the symptom showed up: the wrong number appeared at the very end, after tax was added. The tax function was fine all along. If you'd "fixed" the symptom, say by fiddling with the tax rate until this one order came out right, you'd have broken every order of 1000 or less, which were right all along.

Before changing anything, make sure you can say _why_ the code is wrong in one sentence. Here: "`10 / 100` is integer division, which gives 0, so nothing is subtracted." If you can't say that, you haven't found the root cause yet. You've only found a line that looks suspicious.

## 4. Fix it

There are a few ways to fix it: write `0.10`, write `10.0 / 100`, or reorder the math so the multiplication happens first. Pick the clearest. Here, multiplying before dividing keeps the shape of the original:

```cpp title="the fix"
return subtotal - subtotal * 10 / 100; // 10% off big orders
```

`subtotal * 10` is a `double`, so the division is now floating-point. Then remove the temporary checkpoints, or keep them switched off (see **Print debugging and logging** for how).

## 5. Retest, including what already worked

First rerun the reproduction:

```output title="terminal, input 5 300, after the fix"
Total: 1593
```

That matches the hand calculation. But you're not done. A fix can break something that used to work, and that's called a **regression**. Rerun cases that were already right, especially ones on the other side of any condition you touched. An order under 1000 shouldn't get a discount at all:

```output title="terminal, input 2 300, after the fix"
Total: 708
```

2 × 300 = 600, plus 18% is 708. Correct. Checks like these are worth keeping around, so you can rerun them after every change. **Testing your code** shows how to make that automatic.

![The whole loop: reproduce, narrow down, understand, fix, then retest the failing case and the ones that already worked.](diagram:debugging-loop)

## Habits that help

**Change one thing at a time.** If you change three lines and the bug goes away, you don't know which change fixed it, or whether the other two broke something else.

**Explain it out loud.** Describing the code line by line to someone else, or to a rubber duck on your desk, forces you to say what each line _actually_ does rather than what you assumed. It's surprising how often the bug becomes obvious halfway through the explanation. This is known as **rubber duck debugging**.

**Take a break.** After an hour on the same bug, you start seeing what you expect to see. Ten minutes away often does more than another ten minutes of staring.

**When it used to work, search the history.** If the program was right last week, the bug came in through some change since then. Version control lets you play the same narrowing game across commits: `git bisect` checks out a version halfway between a known-good and a known-bad commit, you test it and say "good" or "bad", and it halves the range again until it lands on the commit that introduced the bug.

## If it comes up in an interview

"Walk me through how you'd debug this" is a common question, and interviewers mostly want to hear a process rather than a lucky guess. Reproduce it with a known input and expected output. Narrow down where the first wrong value appears. Understand the root cause before you change code. Then retest both the failing case and the cases that worked before. Mentioning regressions, and that `git bisect` exists, shows you've done this on real code.
