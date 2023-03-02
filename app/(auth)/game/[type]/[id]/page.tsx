import Chat from "@/components/chat";
import { Metadata } from "next";

export default function Game({ params: { id, type }}: { params: { id: string, type: string } }) {
  return <Chat gamePath={`/${type}/${id}`} />;
}

export const metadata: Metadata = {
  title: "The Oracle's Detective"
};
