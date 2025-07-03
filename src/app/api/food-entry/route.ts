import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FoodEntrySchema } from "@/types/food-entry";

// GET /api/food-entry?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Date is required (YYYY-MM-DD)" }, { status: 400 });
  }
  const start = new Date(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  const entries = await prisma.foodEntry.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: start,
        lt: end,
      },
    },
    orderBy: { time: "asc" },
  });
  return NextResponse.json({ entries });
}

// POST /api/food-entry
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const result = FoodEntrySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "All food entry values must be zero or positive numbers", details: result.error.errors }, { status: 400 });
  }
  let { name, protein, carbs, fat, calories, time, date, units } = result.data;
  if (!name || name.trim() === "") {
    name = "Unknown";
  }
  const entry = await prisma.foodEntry.create({
    data: {
      userId: session.user.id,
      name,
      protein,
      carbs,
      fat,
      calories,
      time,
      date: new Date(date),
      units: typeof units === 'number' && units > 0 ? units : 1,
    },
  });
  return NextResponse.json({ entry });
}

// PUT /api/food-entry
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (!body.id) {
    return NextResponse.json({ error: "Entry id is required." }, { status: 400 });
  }
  const result = FoodEntrySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "All food entry values must be zero or positive numbers.", details: result.error.errors }, { status: 400 });
  }
  let { name, protein, carbs, fat, calories, time, units } = result.data;
  if (!name || name.trim() === "") {
    name = "Unknown";
  }
  const entry = await prisma.foodEntry.update({
    where: { id: body.id },
    data: { name, protein, carbs, fat, calories, time, units: typeof units === 'number' && units > 0 ? units : 1 },
  });
  return NextResponse.json({ entry });
}

// DELETE /api/food-entry
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Entry id is required." }, { status: 400 });
  }
  await prisma.foodEntry.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 