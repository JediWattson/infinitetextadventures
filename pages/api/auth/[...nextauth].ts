import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoClient from "@/db/mongo/connection";
import NextAuth, { Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import RedditProvider from "next-auth/providers/reddit";

if (!process.env.REDDIT_CLIENT_ID) {
  throw Error('mission env var: "REDDIT_CLIENT_ID');
}

if (!process.env.REDDIT_CLIENT_SECRET) {
  throw Error('mission env var: "REDDIT_CLIENT_SECRET');
}

if (!process.env.GITHUB_ID) {
  throw Error('Invalid/Missing environment variable: "GITHUB_ID"');
}

if (!process.env.GITHUB_SECRET) {
  throw Error('Invalid/Missing environment variable: "GITHUB_SECRET"');
}

if (!process.env.DISCORD_CLIENT_ID) {
  throw Error('Invalid/Missing environment variable: "DISCORD_CLIENT_ID"');
}

if (!process.env.DISCORD_CLIENT_SECRET) {
  throw Error('Invalid/Missing environment variable: "DISCORD_CLIENT_SECRET"');
}

declare interface DefaultSession {
  user?: { id?: string };
}

export const authOptions = {
  // pages: { newUser: '/auth/new-user' },

  session: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async session({
      session,
      user,
    }: {
      session: Session & DefaultSession;
      user: User;
    }) {
      if (session?.user && user.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  adapter: MongoDBAdapter(mongoClient),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
