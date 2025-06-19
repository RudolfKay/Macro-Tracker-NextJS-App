import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import path from "path";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's current profile image path
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (user?.profileImage) {
    const filePath = path.join(process.cwd(), "public", user.profileImage);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // Ignore if file does not exist
    }
  }

  // Set profileImage to null in DB
  await prisma.user.update({
    where: { email: session.user.email },
    data: { profileImage: null },
  });

  return NextResponse.json({ success: true });
} 