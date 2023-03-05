import { ObjectId } from "mongodb";
import { getCol } from "../connection";

export default async function gamesActions() {
  const games = await getCol("games");

  return {
    async findCurrentGame(playerId: string) {
      return games.findOne({ playerId, status: "started" });
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
              playerId: 0,
            },
          },
          {
            $sort: { gameId: -1 },
          },
          {
            $limit: limit,
          },
          {
            $addFields: {
              createdAt: { $toDate: "$gameId" },
            },
          },
        ])
        .toArray();
    },
    async createGame(playerId: string, type: string) {
      const currentGame = await this.findCurrentGame(playerId);
      if (currentGame) return currentGame._id;
      const game = await games.insertOne({ playerId, type });
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
