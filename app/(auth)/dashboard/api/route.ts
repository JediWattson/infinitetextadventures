import gamesActions from "@/db/mongo/collections/games";
import playersActions from "@/db/mongo/collections/players";
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
    const userId = session?.user?.id
    if (!userId) throw Error("No id for user found");
    
    const players = await playersActions();
    const player = await players.findByUserId(userId);
    if (!player) throw Error('Player not found');
    
    const gameType = req.nextUrl.searchParams.get("type");
    if (!gameType) throw Error("No game type specificied");

    const games = await gamesActions();    
    const gameId = await games.createGame(player._id.toString(), gameType);
    
    return NextResponse.json({ gameId });
  } catch (error) {
    console.error(error);
  }
}
