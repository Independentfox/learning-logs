"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { setEmailUpdates } from "@/lib/learners";

export async function updateEmailUpdates(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  await setEmailUpdates(session.user.id, formData.get("on") === "1");
  revalidatePath("/account");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
