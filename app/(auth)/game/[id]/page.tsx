import Chat from "@/components/chat";

export default async function Game({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/game/${params.id}/api`, {
    cache: "no-store",
  });
  const data: [{ text: string }] = await res.json();
  return <Chat gameId={params.id} logs={data} />;
}
