import { Metadata } from "next";
import { getGameMeta } from "@/app/(auth)/dashboard/api/lib";

import Chat from "@/components/chat";
import { concatSpeakerText } from "@/lib/helpers";

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

export default async function Game({ params: { id, type } }: GamePramsType) {
  const gamePath = `${type}/${id}`;
  const gameMeta = await getGameMeta(type);
  const gameData = await getGame(gamePath);
  return <Chat gameMeta={gameMeta} gameData={gameData} gamePath={gamePath} />;
}

export async function generateMetadata({
  params: { type },
}: GamePramsType): Promise<Metadata> {
  const gameMeta = await getGameMeta(type);
  return { title: gameMeta.title };
}
