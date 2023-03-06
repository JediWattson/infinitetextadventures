import { getCol } from "../connection"

export type GameMetaType = {
    gameKey: string;
    title: string;
    description: string;
    narrator: string;
    speaker: string;
    backstory: string;
}

const gamesMetaActions = async () => {
    const gamesMeta = await getCol("gamesMeta");
    return {
        getAllGames() {
            return gamesMeta.find().toArray();
        },
        addGame(gameMeta: GameMetaType) {
            return gamesMeta.insertOne(gameMeta);
        },
        findGameByKey(gameKey: string) {
            return gamesMeta.findOne({ gameKey })
        }
    }
}

export default gamesMetaActions;
