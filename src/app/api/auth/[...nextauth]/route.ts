import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import type { NextAuthOptions, SessionStrategy, Session } from "next-auth";
import fs from "fs/promises";
import path from "path";
import { JWT } from "next-auth/jwt";
import type { AdapterUser } from "next-auth/adapters";
import type { Account, Profile } from "next-auth";
import type { User } from "@prisma/client";

// Utility to ensure AdapterUser shape for NextAuth
const toAdapterUser = (user: AdapterUser | User): AdapterUser => {
  const { emailVerified = null, ...rest } = user as AdapterUser & { [key: string]: unknown };
  return { ...rest, emailVerified } as AdapterUser;
};

// Utility to resolve the correct profile image
const resolveProfileImage = async (dbUser: AdapterUser | User | null, token: JWT) => {
  let profileImage = (dbUser as AdapterUser | User | null)?.profileImage ?? (token as { profileImage?: string }).profileImage ?? null;
  if (profileImage && typeof profileImage === "string") {
    const filePath = path.join(
      process.cwd(),
      "public",
      profileImage.startsWith("/") ? profileImage.slice(1) : profileImage
    );
    try {
      await fs.access(filePath);
    } catch {
      // File does not exist, clean up DB
      await prisma.user.update({
        where: { id: token.id as string },
        data: { profileImage: null },
      });
      profileImage = null;
    }
  }
  return profileImage;
};

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
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return toAdapterUser(user);
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
    // @ts-expect-error: NextAuth expects AdapterUser, but Prisma User does not have emailVerified. We ensure it at runtime.
    async jwt({ token, user }: { token: JWT; user?: AdapterUser | User; account?: Account | null; profile?: Profile; trigger?: "signIn" | "signUp" | "update"; isNewUser?: boolean; session?: unknown; }) {
      if (user) {
        const adapterUser = toAdapterUser(user);
        token.id = adapterUser.id;
        token.profileImage = (adapterUser as AdapterUser).profileImage || (adapterUser as AdapterUser).image || null;
        token.role = (adapterUser as AdapterUser).role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        // Always fetch the latest user data from the database
        const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
        session.user.profileImage = await resolveProfileImage(dbUser, token);
        session.user.name = dbUser?.name || session.user.name;
        session.user.email = dbUser?.email || session.user.email;
        session.user.role = dbUser?.role || session.user.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions }; 