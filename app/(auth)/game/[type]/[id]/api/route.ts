import type { NextApiRequest } from "next";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import gamesActions from "@/db/mongo/games";
import messagesActions from "@/db/postgres/messages";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { streamToJSON, streamCompletetion } from "./lib";
import { getGameMeta } from "@/app/(auth)/dashboard/api/lib";

type GamePramsType = { params: { type: string, id: string } }

export async function GET(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType
) {
  try {
    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(id);
    if (messages.rowCount === 0) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        if (!process.env.NEXTAUTH_URL) throw Error('No URL set for NEXTAUTH_URL')
        return NextResponse.redirect(process.env.NEXTAUTH_URL)
      };

      const { backstory, narrator } = await getGameMeta(type);
      const oracleText = await streamCompletetion(
        [backstory, narrator].join("\n").trim()
      );
      const actionsGame = await gamesActions();
      await actionsGame.updateStatus(id, "started");  
      await actionsMsg.addMessage(id, type, narrator, oracleText);
      return NextResponse.json([{ text: oracleText, speaker: narrator}]);
    }

    return NextResponse.json(messages.rows);
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);
  }
}

const concatSpeakerText = ({ speaker, text }: { speaker: string, text: string }) => `${speaker} ${text}`
export async function PUT(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return NextResponse.redirect('/');
    const { text, speaker } = await streamToJSON(req.body);    
    if (text.length > 300) throw Error("Text string too long!");

    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(id);
    const textArr = messages.rows.map(concatSpeakerText);
  
    /**
     * I add the backstory {system} to set up the story, 
     * then I send the convo with the user's text and 
     * have a completion done for the narrator.
     */
    const { narrator, backstory } = await getGameMeta(type)
    textArr.unshift(backstory);
    textArr.push(speaker + text);
    textArr.push(narrator);

    await actionsMsg.addMessage(id, type, speaker, text);
    const narratorText = await streamCompletetion(textArr.join("\n"));    
    await actionsMsg.addMessage(id, type, narrator, narratorText);
    return NextResponse.json({ speaker: narrator, text: narratorText });
  } catch (error) {
    console.error(error);
  }
}

export async function DELETE(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    const actionsGame = await gamesActions();
    await actionsGame.updateStatus(params.id, "finished");
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);
  }
}
