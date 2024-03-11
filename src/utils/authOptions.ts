import { signInWithCredentials } from "@/lib/userService";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import {SessionStrategy} from "next-auth";

const strategy: SessionStrategy = "jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        try {
          await connectMongoDB();
          const user = await signInWithCredentials(
            credentials?.email!,
            credentials?.password!,
          );
          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: strategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};
