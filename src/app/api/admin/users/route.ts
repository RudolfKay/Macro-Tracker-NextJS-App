import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import path from "path";
import fs from "fs/promises";
import type { User } from "@/types/user";
import { UserSchema } from "@/types/user";
import { z } from "zod";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const users = await prisma.user.findMany({
    orderBy: [
      { createdAt: 'asc' },
    ],
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });
  // Map to correct type
  const usersTyped = users.map(u => ({ ...u, createdAt: u.createdAt.toISOString(), role: u.role as import("@/types/user").UserRole }));
  // Sort admin(s) to the top
  (usersTyped as User[]).sort((a: User, b: User) => {
    if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
    if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
    return 0;
  });
  return NextResponse.json(usersTyped);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  // Only validate updatable fields
  const UpdateUserSchema = UserSchema.pick({ id: true, name: true, email: true, role: true });
  const result = UpdateUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'All fields are required and must be valid.', details: result.error.errors }, { status: 400 });
  }
  const { id, name, email, role } = result.data;
  const user = await prisma.user.update({
    where: { id },
    data: { name, email, role },
  });
  return NextResponse.json(user);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const DeleteUserSchema = z.object({ id: z.string() });
  const result = DeleteUserSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'User id is required.', details: result.error.errors }, { status: 400 });
  }
  const { id } = result.data;
  // Fetch user to get profileImage path
  const user = await prisma.user.findUnique({ where: { id } });
  if (user?.profileImage) {
    const filePath = path.join(process.cwd(), "public", user.profileImage.startsWith("/") ? user.profileImage.slice(1) : user.profileImage);
    try {
      await fs.unlink(filePath);
    } catch {
      // Ignore if file does not exist or cannot be deleted
    }
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 