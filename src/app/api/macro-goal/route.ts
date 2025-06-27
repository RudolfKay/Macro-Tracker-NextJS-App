import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { MacroGoalSchema } from "@/types/macro-goal";

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
  const body = await request.json();
  const result = MacroGoalSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "All macro values must be non-negative numbers.", details: result.error.errors }, { status: 400 });
  }
  const { protein, carbs, fat, calories } = result.data;
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