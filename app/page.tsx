import Home from "@/components/home";

export default async function Page() {
  // 2 hours
  const revalidate = 60 * 60 * 2;

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api`, {
    next: { revalidate },
  });
  const games = await res.json();
  return <Home games={games} />;
}
