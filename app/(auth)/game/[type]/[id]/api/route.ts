import type { NextApiRequest } from "next";

import { NextResponse } from "next/server";
import messagesActions from "@/db/postgres/messages";

import { streamToJSON, streamCompletetion } from "./lib";
import gamesActions from "@/db/mongo/games";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const backstory = `The Oracle is a narrator describing the adventure, while the detective askes questions and describes actions to carry along the story. This will be a text adventure murder mystery set in ancient Greece. The Oracle will give three days starting at the arrival to the murder scene for the detective to solve the murder or else something terrible will happen only the Oracle knows and explains after the said three days have finished. Every statement the detective makes be it action or question will cost time and the oracle will remind the detective how much time is left every response she gives. The Oracle starts by setting up the mystery.`;
const narrator = "Oracle:";

type ParamsType = { params: { type: string, id: string } }

export async function GET(
  req: NextApiRequest,
  { params: { id, type } }: ParamsType
) {
  try {
    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(id);
    if (messages.rowCount === 0) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) return NextResponse.redirect('/');

      const oracleText = await streamCompletetion(
        [backstory, narrator].join("\n")
      );
      
      await actionsMsg.addMessage(id, type, narrator, oracleText);
      return NextResponse.json([{ text: oracleText, speaker: narrator}]);
    }

    return NextResponse.json(messages.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.redirect('/dashboard');
  }
}

const concatSpeakerText = ({ speaker, text }: { speaker: string, text: string }) => `${speaker} ${text}`
export async function PUT(
  req: NextApiRequest,
  { params: { id, type } }: ParamsType
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
    await actionsGame.finishGame(params.id);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error(error);
  }
}
