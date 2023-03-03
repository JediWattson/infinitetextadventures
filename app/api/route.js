import gamesActions from "@/db/mongo/games";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const actionsGames = await gamesActions();
        const games = await actionsGames.findLastGames(10);
        return NextResponse.json(games);   
    } catch (error) {
        console.log(error);
    }
}
