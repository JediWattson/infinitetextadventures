import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import gamesActions from "@/db/mongo/collections/games";

const checkGames = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw Error("No id for user found");

  const games = await gamesActions();
  const currentGame = await games.findCurrentGame(session?.user?.id);

  if (currentGame) {
    redirect(
      `${process.env.NEXTAUTH_URL}/game/${currentGame.type}/${currentGame._id}`
    );
  }
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkGames();
  return children;
}
