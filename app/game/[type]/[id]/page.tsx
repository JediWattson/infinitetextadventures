import { Metadata } from "next";

import { concatSpeakerText } from "@/lib/helpers";
import gamesMetaActions from "@/db/mongo/collections/gamesMeta";

import Chat from "@/components/chat";

type GamePramsType = { params: { type: string; id: string } };

const getGame = async (type: string, id: string) => {
  const gamePath = `${type}/${id}`;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/game/${gamePath}/api`, {
    cache: "no-store",
  });
  const game = await res.json();
  const gamesMeta = await gamesMetaActions();
  const meta = await gamesMeta.findGameByKey(type);
  if (!meta) throw Error('Meta not found');
  return { ...game, gamePath, speaker: meta.speaker }
};

export default async function Game({ params: { id, type } }: GamePramsType) {
  const { gamePath, speaker, ...gameData } = await getGame(type, id);  
  return (
    <Chat
      gameSpeaker={speaker}
      gamePath={gamePath}
      gameData={gameData}
    />
  );
}

export async function generateMetadata({
  params: { type },
}: GamePramsType): Promise<Metadata> {
  const gamesMeta = await gamesMetaActions();
  const gameMeta = await gamesMeta.findGameByKey(type);
  return { title: gameMeta?.title };
}
