import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  const { name, protein, carbs, fat, calories, time, date } = await request.json();
  if (!name || !time || !date || [protein, carbs, fat, calories].some((v) => typeof v !== "number" || v < 0)) {
    return NextResponse.json({ error: "All fields are required and must be valid." }, { status: 400 });
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
  const { id, name, protein, carbs, fat, calories, time } = await request.json();
  if (!id || !name || !time || [protein, carbs, fat, calories].some((v) => typeof v !== "number" || v < 0)) {
    return NextResponse.json({ error: "All fields are required and must be valid." }, { status: 400 });
  }
  const entry = await prisma.foodEntry.update({
    where: { id },
    data: { name, protein, carbs, fat, calories, time },
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