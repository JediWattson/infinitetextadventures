import GameOptions from "@/components/game-options";

export default async function Dashboard() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/dashboard/api`, {
    cache: "no-cache",
  });
  const { options } = await res.json();
  return <GameOptions options={options} />;
}
