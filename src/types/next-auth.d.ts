/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextAuth } from "next-auth";
import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      profileImage?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    profileImage?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
} 