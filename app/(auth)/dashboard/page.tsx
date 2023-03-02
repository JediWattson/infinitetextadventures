import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import GameOptions from "@/components/game-options";
import gamesActions from "@/db/mongo/games";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllGames } from "./api/lib";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw Error("No id for user found");

  const games = await gamesActions();
  const currentGame = await games.findCurrentGame(session?.user?.id);
  
  if (currentGame) {
    redirect(`/game/${currentGame.type}/${currentGame._id}`);
  }

  const gamesMeta = await getAllGames();
  const options = Object.entries(gamesMeta).map(([gameKey, { title, description }]) => ({ gameKey, title, description  }))
  return <GameOptions options={options} />;
}
