import DashboardComponent from "@/components/dashboard";
import gamesActions from "@/db/mongo/games";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw Error("No id for user found");

  const games = await gamesActions();
  const currentGame = await games.findCurrentGame(session?.user?.id);
  if (currentGame?._id) {
    redirect(`/game/${currentGame?._id}`);
  }

  return <DashboardComponent />;
}
