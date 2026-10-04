import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { ensureLearner } from "@/lib/learners";
import { redis } from "@/lib/redis";

// A provider switches on once its client id is set (AUTH_GOOGLE_ID / AUTH_GITHUB_ID).
const enabled = {
  google: Boolean(process.env.AUTH_GOOGLE_ID),
  github: Boolean(process.env.AUTH_GITHUB_ID),
};

export const providerIds = (Object.keys(enabled) as (keyof typeof enabled)[]).filter((id) => enabled[id]);

/** Sign-in is hidden until there's a store, a secret and at least one provider. */
export const authEnabled = Boolean(redis && process.env.AUTH_SECRET && providerIds.length);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Users and linked accounts live in Redis; the session itself is an
  // encrypted cookie, so nothing piles up in the store.
  adapter: redis ? UpstashRedisAdapter(redis, { baseKeyPrefix: "auth:" }) : undefined,
  session: { strategy: "jwt" },
  providers: [...(enabled.google ? [Google] : []), ...(enabled.github ? [GitHub] : [])],
  pages: {
    signIn: "/login",
    error: "/login",
    newUser: "/account?welcome=1",
  },
  events: {
    async createUser({ user }) {
      if (user.id) await ensureLearner(user.id);
    },
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
