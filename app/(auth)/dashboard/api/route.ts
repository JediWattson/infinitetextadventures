import gamesConn from "@/db/mongo/games";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


export async function PUT() {
    try {
        const session = await getServerSession(authOptions);    
        const games = await gamesConn()
        if (!session?.user?.id) throw Error('No id for user found');
        const gameId = await games.createGame({ userId: session?.user?.id }); 
        return NextResponse.json({ gameId })
    } catch (error) {
        console.error(error);
        NextResponse.json({ status: 500 });
    }
}