---
subtopic: Watching variables
published: 2026-10-19
summary:
  - While the program is paused, hover over a variable to see its value. It shows the value now, not the value it had on that line.
  - The locals window shows every variable in the current function, and updates as you step.
  - The watch window shows only what you add to it, including expressions like balance / 10, and keeps them between steps.
  - A watched name follows the current function. Two functions with a variable called balance have two different balances.
  - A data breakpoint, or watchpoint, pauses the program whenever a variable's value changes, wherever in the code that happens.
sources:
  - https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-watching-variables/
  - https://learn.microsoft.com/en-us/visualstudio/debugger/using-breakpoints
  - https://code.visualstudio.com/docs/debugtest/debugging
  - https://www.jetbrains.com/help/clion/using-watchpoints.html
---

Pausing the program is only half the job. The point of pausing is to look at its state, and mostly that means the values of its variables. Every debugger gives you a few ways to do that, from a quick glance to a window that tracks values for you. With print debugging, you'd have to decide in advance what to print. Here you can look at anything, whenever you're paused, and change your mind as you go.

This page uses one program, which works out a bank balance:

```cpp title="balance.cpp"
#include <iostream>

int applyFee(int balance)
{
    int fee{balance / 10};
    balance -= fee;
    return balance;
}

int main()
{
    int balance{500};
    balance += 250;
    balance = applyFee(balance);
    balance -= 100;
    std::cout << "Balance: " << balance << '\n';
    return 0;
}
```

```output
Balance: 575
```

The balance goes 500, then 750, then `applyFee` takes 10% off, which makes it 675, and finally 100 comes out, leaving 575. Start a debugging session and run to cursor on line 13, so that line 12 has run and line 13 is next.

## Hovering

The quickest way to see a value is to hold the mouse over the variable's name. Visual Studio, VS Code and CLion show a small tooltip with the value. Hover over `balance` now, and it says 500. CLion also writes values in grey at the end of each line, so you can often see them without hovering at all. In Code::Blocks, hovering is off by default. Turn on _Evaluate expression under cursor_ in _Settings → Debugger_, under the GDB/CDB debugger's _Default_ profile.

Hovering has one trap. It shows the variable's value _now_, wherever you point. Step over lines 13, 14 and 15, then hover over the `balance` on line 12. It says 575, not 500. The tooltip doesn't know which line you pointed at. It just looks the variable up.

Visual Studio also has **QuickWatch**: select a variable or expression, right-click and choose _QuickWatch_, or press <kbd>Shift</kbd>+<kbd>F9</kbd>, and it opens in a small window.

## The locals window

Hovering shows one value at a time. The **locals window** shows every local variable of the current function at once, with its value, and updates as you step. When you're not sure what to look at, look here first.

- In Visual Studio it's _Debug → Windows → Locals_ (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd>, then <kbd>L</kbd>).
- In VS Code it's the _Variables_ section of the Run and Debug view, under _Locals_.
- In CLion it's the _Variables_ pane of the debugger window.
- In Code::Blocks it's the _Locals_ entry in the Watches window, under _Debug → Debugging windows → Watches_.

Step through `main` and you can see `balance` change to 750, 675 and 575 as each line runs. A value that just changed is highlighted (Visual Studio turns it red), which makes it easy to spot what the last step did.

Step into `applyFee` and the window changes completely. It now shows `applyFee`'s own variables, `balance` and `fee`. Step back out and you see `main`'s again. The locals window always shows the current function's variables, which is why it's called that.

Visual Studio has a third window, **Autos**, which shows the variables used around the current line. It also shows a function's return value right after you step over or out of it, which is the easiest way to see what `applyFee` returned.

## The watch window

The **watch window** shows only what you put in it. You add a name once, and it stays there, updating every time the program pauses.

To add something, type it into an empty row of the watch window. In Visual Studio, you can also right-click a variable in the code and choose _Add Watch_. In VS Code, it's the _Watch_ section of Run and Debug, with a + button. In CLion, type it into the _Variables_ pane's input field and add it as a watch. In Code::Blocks, right-click the variable and choose _Watch_.

The watch window can hold expressions, not just names. While paused on line 13, try adding these:

| Watch           | Shows   | Why                                        |
| --------------- | ------- | ------------------------------------------ |
| `balance`       | `500`   | the value right now                        |
| `balance / 10`  | `50`    | what the fee would be if it were taken now |
| `balance > 600` | `false` | a quick yes-or-no check                    |

They're all worked out from the values at this moment, and they're worked out again after each step. Step over line 13 and they become 750, 75 and `true`.

> [!CAUTION]
> The debugger really does run whatever you put in a watch. Something like `balance++` or a call to a function that changes things will change your program's state, every time the watch is updated. Keep watches to expressions that only read.

## Same name, different variable

There's a subtle thing in this program. `main` has a variable called `balance`, and so does `applyFee`, as its parameter. They're two different variables, in two different places in memory. When `main` calls `applyFee(balance)`, the parameter gets a copy of the value, 750 (see **Functions, return values and parameters**).

A watch on `balance` follows the function you're paused in. Step into `applyFee`, and the watch shows `applyFee`'s `balance`. Step over line 6, and it drops to 675, while `main`'s `balance` is still sitting at 750, because it hasn't been assigned yet. It becomes 675 only when the return value is assigned on line 14.

The opposite happens with `fee`. It only exists inside `applyFee`. Add a watch on `fee` while paused in `main`, and the debugger says it can't find it. Visual Studio says the identifier is undefined, and others show it as unavailable or greyed out. It isn't broken, just not in scope. Once you step into `applyFee`, it shows a value. You can leave watches like that in place.

![Which variables you can see depends on the function you're paused in. A watch on balance shows main's copy in main, and applyFee's own copy inside applyFee.](diagram:scope-and-watches)

## Changing a value while paused

You can also change a variable's value while the program is paused. In Visual Studio, double-click the value in the Locals or Watch window and type a new one. In VS Code and CLion, right-click it and choose _Set Value_. When the program carries on, it uses the new value.

This lets you try out "what if" questions without editing the code or rebuilding. What happens if the balance is 5 when `applyFee` runs? Pause on line 14, set `balance` to 5, and step into the call. `fee` comes out as 0, because `5 / 10` is integer division. That's the kind of edge case worth knowing about.

## Pausing when a value changes

Sometimes the question isn't "what's the value here?" but "where did this value get changed?". In a large program, a variable can be modified from many places, and setting a breakpoint on every one of them isn't practical.

A **data breakpoint**, also called a **watchpoint**, solves this. It's attached to a variable, not to a line. Whenever the variable's value changes, from anywhere, the program pauses straight after the change.

In Visual Studio, while paused, right-click a variable in the Locals or Watch window and choose _Break When Value Changes_. Visual Studio turns these off at the end of each session, because the variable won't be at the same address next time. In VS Code, right-click it in the Variables section and choose _Break on Value Change_. CLion has _Add Watchpoint_ on the same right-click menu.

Set one on `main`'s `balance` while paused on line 13, then continue. The program pauses after line 13 (750), after line 14 (675) and after line 15 (575). It doesn't pause on line 6, inside `applyFee`, because that line changes the other `balance`, the copy.

![A watchpoint on main's balance pauses the program after each line that changes it, and ignores applyFee's separate copy.](diagram:watchpoint-stops)

Watchpoints use special hardware in the processor, which watches a memory address directly. That makes them fast, but you can have only a few at once: x86-64 processors have room for four. Watching a local variable also only makes sense while its function is running. Once the function returns, gdb deletes the watchpoint for you.

## From a terminal

In gdb and lldb, all of this is done by typing commands, and **Debugging with gdb and lldb** covers them properly. Here are the ones for this page:

| What you want                | gdb                   | lldb                              |
| ---------------------------- | --------------------- | --------------------------------- |
| Print one variable           | `print balance`       | `frame variable balance`          |
| Print an expression          | `print balance / 10`  | `expression balance / 10`         |
| All locals of this function  | `info locals`         | `frame variable`                  |
| Show it again at every pause | `display balance`     | `display balance`                 |
| Change a value               | `set var balance = 5` | `expression balance = 5`          |
| Pause when it changes        | `watch balance`       | `watchpoint set variable balance` |

`p` is short for `print` in both, and in lldb `v` is short for `frame variable`.

## If it comes up in an interview

A good one to be ready for is "how would you find out where a variable is getting a bad value?". Mention a data breakpoint, or watchpoint, which pauses whenever the variable changes, from anywhere, and is backed by the processor's debug hardware, so only a few can exist at once. You might also be asked why a debugger can't show a variable that's clearly in the code. It may be out of scope in the current function, or the build may be optimized and the variable kept in a register or removed. Knowing that a watch expression is really evaluated, side effects and all, shows you've actually used one.
