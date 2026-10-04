import { auth, authEnabled } from "@/auth";
import { getLearner, type Learner } from "@/lib/learners";

export type Viewer = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  learner: Learner | null;
} | null;

/** The signed-in learner, or null for visitors (and whenever sign-in is off). */
export async function getViewer(): Promise<Viewer> {
  if (!authEnabled) return null;
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;
  return { name: user.name, email: user.email, image: user.image, learner: await getLearner(user.id) };
}
