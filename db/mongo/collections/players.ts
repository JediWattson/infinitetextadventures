import { getCol } from "../connection";

export default async function playersActions() {
  const players = await getCol("players");
  return {
    findByUserId(userId: string) {
      return players.findOne({ userId });
    },
    async findOrMakeUserWithId(userId: string) {
      const player = await this.findByUserId(userId);
      if (player) return player;
      const newPlayer = {
        userId,
        role: "player",
      };
      const ret = await players.insertOne(newPlayer);
      return players.findOne({ _id: ret.insertedId });
    },
  };
}
