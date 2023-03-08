import { ObjectId } from "mongodb";
import { getCol } from "../connection";

export default async function gamesActions() {
  const games = await getCol("games");

  return {
    async createGame(playerId: string, type: string) {
      const currentGame = await this.findCurrentGame(playerId);
      if (currentGame) return currentGame._id;
      const game = await games.insertOne({ playerId, type });
      return game.insertedId;
    },
    updateMsgCount(gameId: string, msgCount: number) {
      return games.updateOne({ _id: new ObjectId(gameId) }, { $set: { msgCount } })
    },
    updateStatus(gameId: string, status: string) {
      return games.updateOne({ _id: new ObjectId(gameId) }, { $set: { status } });
    },
    findCurrentGame(playerId: string) {
      return games.findOne({ playerId, status: "started" });
    },
    findGameById(gameId: string) {
      return games.findOne({ _id: new ObjectId(gameId) });
    },
    findLastGames(limit: number) {
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
    }
  };
}
