import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import playersActions from "@/db/mongo/collections/players";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function GET() {
    const session = await getServerSession(authOptions);    
    const userId = session?.user?.id        
    if (!userId) return NextResponse.json({ unauthorized: true });

    const players = await playersActions();
    const player = await players.findByUserId(userId);    
    if (player?.role !== "admin") return NextResponse.json({ unauthorized: true });

    return NextResponse.json({});
}