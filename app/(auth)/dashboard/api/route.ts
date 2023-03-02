import gamesActions from "@/db/mongo/games";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";

type ParamType = URLSearchParams & { type: string } 

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw Error("No id for user found");
    const gameType  = req.nextUrl.searchParams.get('type')
    if (!gameType) throw Error("No game type specificied");
    
    const games = await gamesActions();
    const gameId = await games.createGame(session?.user?.id, gameType);
    return NextResponse.json({ gameId });
  } catch (error) {
    console.error(error);
    NextResponse.json({ status: 500 });
  }
}
