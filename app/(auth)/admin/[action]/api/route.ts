import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { streamToJSON } from "@/app/game/[type]/[id]/api/lib";
import gamesMetaActions from "@/db/mongo/collections/gamesMeta";
import playersActions from "@/db/mongo/collections/players";

const isAdminUser = async () => {
    const session = await getServerSession(authOptions);    
    const userId = session?.user?.id        
    if (!userId) return false;

    const players = await playersActions();
    const player = await players.findByUserId(userId);    
    if (player?.role !== "admin") return false;
    
    return true;
}

export async function GET() {
    if (!isAdminUser()) return NextResponse.json({ unauthorized: true });
    const gamesMeta = await gamesMetaActions();
    const meta = await gamesMeta.getAllGames();
    return NextResponse.json(meta);
}

export async function PUT(req: NextRequest, { params: { action } }: { params: { action: string } }) {    
    try {
        if (!isAdminUser()) return NextResponse.json({ unauthorized: true });
        
        if (!req.body) throw Error('Nothing was sent here!');        
        
        const gameMeta = await streamToJSON(req.body);
        
        if (Object.values(gameMeta).some(v => v === '')) return NextResponse.json({ emptyKey: true });

        const gamesMeta = await gamesMetaActions();
        const game = await gamesMeta.findGameByKey(gameMeta.gameKey);
        if (game) return NextResponse.json({ gameAlreadyMade: true });
        
        await gamesMeta.addGame(gameMeta);
        return NextResponse.json({ gameCreated: true });
    } catch (error) {
        console.error(error)
    }
}