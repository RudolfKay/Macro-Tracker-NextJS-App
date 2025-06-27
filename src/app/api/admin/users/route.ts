import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import path from "path";
import fs from "fs/promises";
import type { User } from "@/types/user";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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
  const { id, name, email, role } = await request.json();
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
  const { id } = await request.json();
  // Fetch user to get profileImage path
  const user = await prisma.user.findUnique({ where: { id } });
  if (user?.profileImage) {
    const filePath = path.join(process.cwd(), "public", user.profileImage.startsWith("/") ? user.profileImage.slice(1) : user.profileImage);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Ignore if file does not exist or cannot be deleted
    }
  }
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 