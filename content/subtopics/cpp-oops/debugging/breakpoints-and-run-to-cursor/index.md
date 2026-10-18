---
subtopic: Breakpoints and run-to-cursor
published: 2026-10-19
summary:
  - Run to cursor runs the program until it reaches the line you picked, then pauses. It works once.
  - A breakpoint pauses the program every time that line is about to run, and stays until you remove it.
  - A conditional breakpoint pauses only when an expression you give it is true, such as whole == 3.
  - A logpoint or tracepoint prints a message instead of pausing, which is print debugging without editing the code.
  - Set next statement moves the execution point without undoing anything. Variables keep their values, so use it with care.
sources:
  - https://www.learncpp.com/cpp-tutorial/using-an-integrated-debugger-running-and-breakpoints/
  - https://learn.microsoft.com/en-us/visualstudio/debugger/using-breakpoints
  - https://code.visualstudio.com/docs/debugtest/debugging
  - https://www.jetbrains.com/help/clion/set-execution-point.html
---

Stepping, from **Stepping through code**, is precise but slow. In a real program, the line you care about might be thousands of steps away from the start of `main`. This page is about getting there directly: telling the debugger where you want to pause, and letting the program run at full speed until then.

The program for this page calls the same function three times:

```cpp title="percent.cpp"
#include <iostream>

int percent(int part, int whole)
{
    int result{part * 100 / whole};
    return result;
}

int main()
{
    std::cout << percent(1, 4) << '\n';
    std::cout << percent(3, 4) << '\n';
    std::cout << percent(2, 3) << '\n';
    return 0;
}
```

```output
25
75
66
```

## Run to cursor

Click on a line to put the text cursor there, then use **run to cursor**. The program runs until it's about to execute that line, then pauses, as if you'd stepped all the way there.

Put the cursor on line 5, inside `percent`, and run to cursor. The program pauses in the first call, with `part` at 1 and `whole` at 4. Now continue. The program prints all three numbers and finishes. It doesn't pause in the second or third call, even though line 5 runs in both of them. Run to cursor is a one-off: it pauses the first time it gets there, and then it's done.

If the line you picked never runs at all, the program simply runs to the end. That's useful information too. It tells you that code isn't being reached.

In Visual Studio, you right-click the line and choose _Run To Cursor_, or press <kbd>Ctrl</kbd>+<kbd>F10</kbd>. It works even before a session has started, and starts one for you. VS Code and CLion have _Run to Cursor_ in their menus too, and Code::Blocks uses <kbd>F4</kbd>.

## Breakpoints

A **breakpoint** is a marker on a line that says "pause here, every time". You've already used one to start a session in CLion and Code::Blocks. To set one, click in the margin just left of the line number, where a red dot appears, or put the cursor on the line and press <kbd>F9</kbd> (Visual Studio and VS Code), <kbd>Ctrl</kbd>+<kbd>F8</kbd> (CLion, or <kbd>⌘</kbd>+<kbd>F8</kbd> on a Mac) or <kbd>F5</kbd> (Code::Blocks). Do the same again to remove it.

Set a breakpoint on line 5 and start the program. It pauses in the first call, with `part` at 1 and `whole` at 4. Continue, and it pauses again in the second call, with 3 and 4. Continue once more and it pauses a third time, with 2 and 3. A fourth continue lets the program finish.

So a breakpoint differs from run to cursor in two ways. It pauses every time the line is reached, not only the first time. And it stays where it is, between continues and even between sessions, because IDEs usually save your breakpoints with the project. Clear them out when you're done with them, or they'll keep pausing you later.

A few more things are worth knowing:

- A breakpoint on a line that never runs never triggers. If a breakpoint you expected to hit doesn't, that code wasn't reached, which is often the clue you were looking for.
- If you put one on a blank line or a comment, the debugger usually moves it down to the next line that has code.
- You can usually disable a breakpoint instead of deleting it, which keeps it in place but stops it from pausing. IDEs have a breakpoints window that lists every breakpoint, where you can turn them on and off.

![Over the three calls to percent, run to cursor pauses once, a breakpoint pauses every time, and a conditional breakpoint pauses only when its condition is true.](diagram:when-it-pauses)

## Conditional breakpoints

Suppose `percent` only goes wrong when `whole` is 3. With an ordinary breakpoint, you'd have to continue past every other call to get to the one you care about. With three calls that's fine. With three thousand, it isn't.

A **conditional breakpoint** pauses only when an expression you give it is true. In VS Code, right-click in the margin next to line 5 and choose _Add Conditional Breakpoint_. In Visual Studio, right-click an existing breakpoint and choose _Conditions_. In CLion, right-click the breakpoint and type the condition into the box. Then type:

```cpp title="breakpoint condition"
whole == 3
```

Now the program runs straight through the first two calls and pauses only in the third. The condition is written like a C++ expression, using the variables visible at that line, and the debugger checks it each time the line is reached.

A related option is a **hit count**: pause only on the nth time the line is reached. Visual Studio and VS Code both offer it next to the condition. It's handy when you know something goes wrong "on the fifth call" but not which values cause it.

## Logpoints: print debugging without the edits

Sometimes you don't want to pause at all. You just want to know what the values were. VS Code calls this a **logpoint**, and Visual Studio calls it a **tracepoint**. It's a breakpoint that prints a message and keeps going.

In VS Code, right-click in the margin and choose _Add Logpoint_. In Visual Studio, open a breakpoint's settings and tick _Actions_. Both use curly braces to include values:

```text title="logpoint message"
percent({part}, {whole})
```

Run the program with that on line 5, and the debugger's output window shows `percent(1, 4)`, `percent(3, 4)` and `percent(2, 3)` as the calls happen. This is exactly what **Print debugging and logging** did with `std::cerr`. The difference is that you didn't edit the code, didn't rebuild, and have nothing to clean up afterward.

## Set next statement

Debuggers also let you choose which line runs next, skipping code or going back over it. Visual Studio calls this **Set Next Statement** (right-click, or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F10</kbd>). You can also drag the yellow arrow to another line. VS Code calls it _Jump to Cursor_, in the right-click menu while you're paused. CLion calls it _Set Execution Point_, and you drag its execution arrow. Code::Blocks has _Set next statement_ in its Debug menu.

Here's what it can do with `percent.cpp`. Clear the breakpoints from earlier first, or they'll pause you on the way.

To skip a line, run to cursor on line 12, so `25` has been printed. Then set the next statement to line 13 and continue. Line 12 never runs, so the full output is `25` and `66`. That's a quick way to test "does the bug go away if this call doesn't happen?" without commenting anything out.

To run a line again, run to cursor on line 13, so `25` and `75` have been printed. Set the next statement back to line 12 and continue. The output is `25`, `75`, `75` and `66`. Running a function a second time, this time stepping into it, is useful when you stepped over the call you needed to see.

![Jumping changes only which line runs next. Skip a line and its output never appears. Jump back and it runs again.](diagram:jumping)

> [!WARNING]
> Setting the next statement moves the execution point and nothing else. It doesn't undo anything: every variable keeps the value it has right now. Jump back over a line like `total += 10;` and run it again, and `total` goes up by another 10. Jumping past a line that gives a variable its value leaves that variable holding whatever was there before. And never jump to a line in a different function. The program's bookkeeping for function calls won't match, and it will probably crash.

## How a breakpoint actually works

You don't need this to use breakpoints, but it explains a few of their quirks, and it comes up in interviews.

When you set a breakpoint, the debugger finds the machine code for that line, using the debug information from `-g`, and overwrites the start of it with a special trap instruction. On x86-64, that's a one-byte instruction called `int3`. 64-bit ARM processors, like Apple's M-series chips, use one called `brk`. When the processor reaches it, it stops the program and hands control to the debugger. To continue, the debugger puts the original instruction back, runs just that one instruction, and puts the trap back for next time.

Because this works by patching code, there's no hardware limit on how many breakpoints you can set. It also explains why a breakpoint in an optimized build can land somewhere unexpected: if the compiler merged or moved the code for that line, there's no clean spot to put the trap.

## The keys and commands

| Tool          | Breakpoint | Run to cursor | Set next statement       |
| ------------- | ---------- | ------------- | ------------------------ |
| Visual Studio | F9         | Ctrl+F10      | Ctrl+Shift+F10           |
| VS Code       | F9         | right-click   | right-click              |
| CLion         | Ctrl+F8    | Alt+F9        | drag the execution arrow |
| Code::Blocks  | F5         | F4            | Debug menu               |

CLion's keys are for its Windows and Linux keymap. On macOS, the breakpoint key is <kbd>⌘</kbd>+<kbd>F8</kbd> and run to cursor is <kbd>⌥</kbd>+<kbd>F9</kbd>.

From a terminal, the same ideas are typed as commands. They're explained properly in **Debugging with gdb and lldb**.

| What you want          | gdb                                                      | lldb                                                                        |
| ---------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Breakpoint on line 5   | `break percent.cpp:5`                                    | `b percent.cpp:5`                                                           |
| Only when `whole` is 3 | `break percent.cpp:5 if whole == 3`                      | `breakpoint set -f percent.cpp -l 5 -c 'whole == 3'`                        |
| Print and keep going   | `dprintf percent.cpp:5,"percent(%d, %d)\n", part, whole` | `breakpoint set -f percent.cpp -l 5 -G true -C 'frame variable part whole'` |
| Run until line 12      | `until 12`                                               | `thread until 12`                                                           |
| Make line 13 run next  | `tbreak 13`, then `jump 13`                              | `thread jump --line 13`                                                     |
| List breakpoints       | `info breakpoints`                                       | `breakpoint list`                                                           |
| Delete breakpoint 1    | `delete 1`                                               | `breakpoint delete 1`                                                       |

gdb's `jump` starts running from the new line straight away instead of pausing there, which is why it's paired with `tbreak`, a breakpoint that removes itself after one use. lldb's `thread jump` only moves the execution point, like an IDE does.

## If it comes up in an interview

A common question is how a breakpoint differs from run to cursor. A breakpoint pauses every time its line is reached and stays until you remove it, while run to cursor pauses once. You might also be asked how you'd stop inside a function only when it gets one bad input. The answer is a conditional breakpoint, or a hit count if you know which call it is. If the interviewer goes deeper, explain that a software breakpoint replaces an instruction with a trap, `int3` on x86-64, and that setting the next statement doesn't roll back any variables.
