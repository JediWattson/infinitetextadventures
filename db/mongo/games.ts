import { ObjectId } from "mongodb";
import { conn } from "./connection";

export default async function gamesActions() {
  const db = await conn();
  const games = db.collection("games");

  return {
    async findCurrentGame(userId: string) {
      return games.findOne({ userId, status: "started" });
    },
    async findGameById(gameId: string) {
      return games.findOne({ _id: new ObjectId(gameId) });
    },
    async findLastGames(limit: number) {
      return games
        .aggregate([
          {
            $project: { gameId: "$_id", type: 1 },
          },
          {
            $project: {
              _id: 0,
              status: 0,
              userId: 0,
            },
          },
          {
            $limit: limit,
          },
          {
            $addFields: {
              createdAt: { $toDate: "$gameId" },
            },
          },
          {
            $sort: { createdAt: 1 },
          },
        ])
        .toArray();
    },
    async createGame(userId: string, type: string) {
      const currentGame = await this.findCurrentGame(userId);
      if (currentGame) return currentGame._id;
      const game = await games.insertOne({ userId, type });
      return game.insertedId;
    },
    async updateStatus(gameId: string, status: string) {
      try {
        const _id = new ObjectId(gameId);
        return games.updateOne({ _id }, { $set: { status } });
      } catch (error) {
        console.error(error);
      }
    },
  };
}
