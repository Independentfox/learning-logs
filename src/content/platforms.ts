/** Where a practice question lives. Detected from its URL, so day files only need the link. */
export const platforms = {
  codeforces: { name: "Codeforces", hosts: ["codeforces.com"] },
  leetcode: { name: "LeetCode", hosts: ["leetcode.com"] },
  codechef: { name: "CodeChef", hosts: ["codechef.com"] },
  gfg: { name: "GeeksforGeeks", hosts: ["geeksforgeeks.org"] },
  cses: { name: "CSES", hosts: ["cses.fi"] },
  atcoder: { name: "AtCoder", hosts: ["atcoder.jp"] },
  vjudge: { name: "VJudge", hosts: ["vjudge.net"] },
  hackerrank: { name: "HackerRank", hosts: ["hackerrank.com"] },
  hackerearth: { name: "HackerEarth", hosts: ["hackerearth.com"] },
  spoj: { name: "SPOJ", hosts: ["spoj.com"] },
  interviewbit: { name: "InterviewBit", hosts: ["interviewbit.com"] },
} as const;

export type PlatformId = keyof typeof platforms;

export function platformFor(url: URL): PlatformId | undefined {
  const host = url.hostname.replace(/^www\./, "");
  return (Object.keys(platforms) as PlatformId[]).find((id) =>
    platforms[id].hosts.some((h) => host === h || host.endsWith(`.${h}`)),
  );
}

export const difficulties = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof difficulties)[number];
