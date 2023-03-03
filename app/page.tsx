import Home from "@/components/home";

export default async function Page() {
  // const res = await fetch(`${process.env.NEXTAUTH_URL}/api`);
  // const games = await res.json();
  return <Home />;
}
