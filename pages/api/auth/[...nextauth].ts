import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoClient from "@/db/mongo/connection";
import NextAuth, { Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw Error('Invalid/Missing environment variable: "GITHUB_SECRET | GITHUB_ID"')
}

declare interface DefaultSession {
  user?: { id?: string }
}

export const authOptions = {
  adapter: MongoDBAdapter(mongoClient),
  // pages: { newUser: '/auth/new-user' },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {      
      if (new URL(url).pathname === '/') 
        return url + "dashboard";
      return url;
    },
    async session({ session, user }: { session: Session & DefaultSession, user: User }) {
      if (session?.user && user.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
