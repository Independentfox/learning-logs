"use server";

import { refresh } from "next/cache";
import { auth } from "@/auth";
import { allSubtopicIds } from "@/content/subtopics";
import { setRead } from "@/lib/reading";

/** Ticks a subtopic as read (or unticks it) for the signed-in learner. */
export async function markSubtopicRead(subtopic: string, read: boolean) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !allSubtopicIds.has(subtopic) || typeof read !== "boolean") return;

  await setRead(userId, subtopic, read);
  refresh();
}
