import { getCol } from "../connection";

export type GameMetaType = {
  gameKey: string;
  title: string;
  description: string;
  narrator: string;
  speaker: string;
  backstory: string;
};

const gamesMetaActions = async () => {
  const gamesMeta = await getCol("gamesMeta");
  return {
    getAllGames() {
      return gamesMeta.find({}, { projection: { _id: 0 } }).toArray();
    },
    addGame(gameMeta: GameMetaType) {
      return gamesMeta.insertOne(gameMeta);
    },
    editGame({ gameKey, ...gameMeta }: GameMetaType) {
      return gamesMeta.updateOne({ gameKey }, { $set: gameMeta });
    },
    findGameByKey(gameKey: string) {
      return gamesMeta.findOne({ gameKey }, { projection: { _id: 0 } });
    },
  };
};

export default gamesMetaActions;
