import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import bcrypt from "bcryptjs";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  newPassword: z.string().optional().refine(val => !val || val.length >= 6, {
    message: "New password must be at least 6 characters long",
  }),
  currentPassword: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = ProfileUpdateSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "All fields are required and must be valid.", details: result.error.errors }, { status: 400 });
  }
  const { name, email, newPassword, currentPassword } = result.data;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Validate current password
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  // Check for email uniqueness if changed
  if (email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }
  }

  // Prepare update data
  const updateData: { name: string; email: string; password?: string } = { name, email };
  if (newPassword && newPassword.length >= 6) {
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });

  return NextResponse.json({ success: true });
} 