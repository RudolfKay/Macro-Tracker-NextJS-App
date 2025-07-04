import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

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
  const mimeType = file.type || "image/jpeg";

  // Update user in DB
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      profileImageData: buffer,
      profileImageType: mimeType,
    },
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse(null, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { profileImageData: true, profileImageType: true },
  });

  if (!user?.profileImageData || !user?.profileImageType) {
    // Fallback to default avatar
    const avatarRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/avatar.svg`);
    const avatarBuffer = Buffer.from(await avatarRes.arrayBuffer());
    return new NextResponse(avatarBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  return new NextResponse(user.profileImageData as Buffer, {
    status: 200,
    headers: {
      "Content-Type": user.profileImageType,
      "Cache-Control": "no-store, max-age=0",
    },
  });
} 