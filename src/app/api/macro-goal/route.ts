import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const goal = await prisma.macroGoal.findFirst({
    where: { userId: session.user.id, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ goal });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { protein, carbs, fat, calories } = await request.json();
  if ([protein, carbs, fat, calories].some((v) => typeof v !== "number" || v < 0)) {
    return NextResponse.json({ error: "All macro values must be non-negative numbers." }, { status: 400 });
  }
  // Deactivate previous goals
  await prisma.macroGoal.updateMany({
    where: { userId: session.user.id, isActive: true },
    data: { isActive: false },
  });
  // Create new goal
  const goal = await prisma.macroGoal.create({
    data: {
      userId: session.user.id,
      protein,
      carbs,
      fat,
      calories,
      isActive: true,
    },
  });
  return NextResponse.json({ goal });
} 