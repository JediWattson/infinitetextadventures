import playersActions from "@/db/mongo/collections/players";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({});

  const players = await playersActions();
  const player = await players.findByUserId(userId);
  return NextResponse.json(player || { createNew: true });
}

export async function PUT() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({});

  const players = await playersActions();
  const player = await players.findOrMakeUserWithId(userId);
  return NextResponse.json(player);
}
