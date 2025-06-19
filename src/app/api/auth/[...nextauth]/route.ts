import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions, SessionStrategy } from "next-auth";
import fs from "fs/promises";
import path from "path";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        const isValid = user && await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage || user.image || null;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Always fetch the latest user data from the database
        const dbUser = await prisma.user.findUnique({ where: { id: token.id } });
        let profileImage = dbUser?.profileImage || token.profileImage || null;
        if (profileImage) {
          const filePath = path.join(process.cwd(), "public", profileImage.startsWith("/") ? profileImage.slice(1) : profileImage);
          try {
            await fs.access(filePath);
          } catch {
            // File does not exist, clean up DB
            await prisma.user.update({
              where: { id: token.id },
              data: { profileImage: null },
            });
            profileImage = null;
          }
        }
        session.user.profileImage = profileImage;
        session.user.name = dbUser?.name || session.user.name;
        session.user.email = dbUser?.email || session.user.email;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }; 