/** Languages the code runner offers. Ids are Judge0's long-standing ones, present on every Judge0 CE install. */
export const languages = {
  cpp: {
    label: "C++17",
    judge0: 54, // C++ (GCC 9.2.0)
    compilerOptions: "-std=c++17 -O2",
    starter: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    return 0;
}
`,
  },
  python: {
    label: "Python 3",
    judge0: 71, // Python (3.8.1)
    compilerOptions: undefined,
    starter: `import sys
input = sys.stdin.readline


def main():
    pass


main()
`,
  },
  java: {
    label: "Java",
    judge0: 62, // Java (OpenJDK 13.0.1) — the class must be called Main
    compilerOptions: undefined,
    starter: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

    }
}
`,
  },
} as const;

export type LanguageId = keyof typeof languages;

export const isLanguage = (value: unknown): value is LanguageId =>
  typeof value === "string" && Object.hasOwn(languages, value);

/** What a run sends back to the browser. */
export type RunResult = {
  /** Judge0 status, e.g. "Accepted", "Compilation Error", "Time Limit Exceeded". */
  status: string;
  ok: boolean;
  stdout: string;
  stderr: string;
  compileOutput: string;
  /** Seconds. */
  time: number | null;
  /** Kilobytes. */
  memory: number | null;
};
