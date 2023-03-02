import { ObjectId } from "mongodb";
import { conn } from "./connection";

export default async function gamesActions() {
  const db = await conn();
  const games = db.collection("games");

  return {
    async findCurrentGame(userId: string) {
      return games.findOne({ userId, status: "started" });
    },
    async createGame(userId: string, type: string) {
      const currentGame = await this.findCurrentGame(userId);
      if (currentGame) return currentGame._id;
      const game = await games.insertOne({ userId, type, status: "started" });
      return game.insertedId;
    },
    async finishGame(gameId: string) {
      const _id = new ObjectId(gameId);
      return games.updateOne({ _id }, { $set: { status: "finished" } });
    },
  };
}
