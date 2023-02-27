import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import clientPromise from "./mongo-adapter";

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw Error('Invalid/Missing environment variable: "GITHUB_SECRET | GITHUB_ID"')
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  pages: { newUser: '/auth/new-user' },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
