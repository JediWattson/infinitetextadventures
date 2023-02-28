import { conn } from "./connection";


export default async function gamesActions() {
    const db = await conn();
    const games = db.collection('games')

    return {
        async findCurrentGame({ userId }: { userId: string }) {
            return games.findOne({ userId, status: "started" });
        },
        async createGame({ userId }: { userId: string }) {
            const currentGame = await this.findCurrentGame({ userId })
            if (currentGame) return currentGame._id
            const game = await games.insertOne({ userId, status: "started" });
            return game.insertedId;
        }
    }
}