import Home from "@/components/home";

export default async function Page() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api`, { next: { revalidate: 10 } });
  const games = await res.json();
  return <Home games={games} />;
}
