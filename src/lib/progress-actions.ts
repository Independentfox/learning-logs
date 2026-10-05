"use server";

import { refresh } from "next/cache";
import { auth } from "@/auth";
import { questionsById } from "@/content/logs";
import { setStatus, type Status } from "@/lib/progress";

/** Marks a question attempted or solved for the signed-in learner (null clears it). */
export async function updateQuestionStatus(questionId: string, status: Status | null) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || !questionsById.has(questionId)) return;
  if (status !== null && status !== "attempted" && status !== "solved") return;

  await setStatus(userId, questionId, status);
  refresh();
}
