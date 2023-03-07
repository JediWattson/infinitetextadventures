import Admin from "@/components/admin";
import playersActions from "@/db/mongo/collections/players";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) redirect("/");
  const players = await playersActions();
  const player = await players.findByUserId(userId);
  if (player?.role !== "admin") redirect("/");
  return <Admin />;
}
