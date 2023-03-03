import gamesActions from "@/db/mongo/games";
import { GameMetaType } from "@/lib/gameMeta";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getAllGames } from "./lib";

const transformGame = ([gameKey, { title, description }]: [
  string,
  GameMetaType
]) => ({ gameKey, title, description });
export async function GET() {
  try {
    const gamesMeta = await getAllGames();
    const options = Object.entries(gamesMeta).map(transformGame);
    return NextResponse.json({ options });
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw Error("No id for user found");

    const gameType = req.nextUrl.searchParams.get("type");
    if (!gameType) throw Error("No game type specificied");

    const games = await gamesActions();
    const gameId = await games.createGame(session?.user?.id, gameType);
    return NextResponse.json({ gameId });
  } catch (error) {
    console.error(error);
  }
}
