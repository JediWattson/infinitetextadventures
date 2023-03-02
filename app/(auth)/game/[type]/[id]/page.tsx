import { Metadata } from "next";
import { getGameMeta } from "@/app/(auth)/dashboard/api/lib";

import Chat from "@/components/chat";

type GamePramsType = { params: { type: string, id: string } }

export default function Game({ params: { id, type }}: GamePramsType) {
  return <Chat gamePath={`/${type}/${id}`} />;
}

export async function generateMetadata({ params: { type } }: GamePramsType): Promise<Metadata> {
  const gameMeta = await getGameMeta(type);
  return { title: gameMeta.title }
}
