import Home from "@/components/home";

export default async function Page() {
  // 6 hours
  const revalidate = 60*60*6

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api`, { next: { revalidate } });
  const games = await res.json();
  return <Home games={games} />;
}
