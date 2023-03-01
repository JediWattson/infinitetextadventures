import Chat from "@/components/chat";

export default function Game({ params }: { params: { id: string } }) {
  return <Chat gameId={params.id} />;
}
