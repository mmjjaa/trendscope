import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TEMP_USER_ID = "demo-user";

export async function GET() {
  await prisma.user.upsert({
    where: { id: TEMP_USER_ID },
    update: {},
    create: {
      id: TEMP_USER_ID,
      email: "demo@trendscope.com",
      name: "데모유저",
    },
  });

  const keywords = await prisma.keyword.findMany({
    where: { userId: TEMP_USER_ID },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(keywords);
}

export async function POST(req: Request) {
  const { keyword, category } = await req.json();

  const created = await prisma.keyword.create({
    data: { keyword, category, userId: TEMP_USER_ID },
  });

  return NextResponse.json(created, { status: 201 });
}
