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

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const fileName = `profile-${session.user.email.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now()}${ext}`;
  const filePath = path.join(process.cwd(), "public", "profile-photos", fileName);

  // Ensure directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);

  const imagePath = `/profile-photos/${fileName}`;

  // Update user in DB
  await prisma.user.update({
    where: { email: session.user.email },
    data: { profileImage: imagePath },
  });

  return NextResponse.json({ imagePath });
} 