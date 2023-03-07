import { Metadata } from "next";

import { concatSpeakerText } from "@/lib/helpers";
import gamesMetaActions from "@/db/mongo/collections/gamesMeta";

import Chat from "@/components/chat";

type GamePramsType = { params: { type: string; id: string } };

const getGame = async (gamePath: string) => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/game/${gamePath}/api`, {
    cache: "no-store",
  });
  const data = await res.json();  
  data.oracleText = data.messages.map(concatSpeakerText)
  delete data.messages;
  
  return data;
};

const getMeta = async (gameKey: string) => {
  const gamesMeta = await gamesMetaActions()
  return gamesMeta.findGameByKey(gameKey);
}

export default async function Game({ params: { id, type } }: GamePramsType) {
  const gamePath = `${type}/${id}`;
  const gameMeta = await getMeta(type);  
  const gameData = await getGame(gamePath);
  return <Chat gameSpeaker={gameMeta?.speaker} gameData={gameData} gamePath={gamePath} />;
}

export async function generateMetadata({
  params: { type },
}: GamePramsType): Promise<Metadata> {
  const gamesMeta = await gamesMetaActions()
  const gameMeta = await gamesMeta.findGameByKey(type);
  return { title: gameMeta?.title };
}
