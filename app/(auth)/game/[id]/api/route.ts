import type { NextApiRequest } from "next";

import { NextResponse } from "next/server";
import messagesActions from "@/db/postgres/messages";

import { streamToJSON, streamCompletetion } from "./lib";
import gamesActions from "@/db/mongo/games";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const backstory = `The Oracle is a narrator describing the adventure, while the detective askes questions and describes actions to carry along the story. This will be a text adventure murder mystery set in ancient Greece. The Oracle will give three days starting at the arrival to the murder scene for the detective to solve the murder or else something terrible will happen only the Oracle knows and explains after the said three days have finished. Every statement the detective makes be it action or question will cost time and the oracle will remind the detective how much time is left every response she gives. The Oracle starts by setting up the mystery.`;
const narrator = "Oracle:";

export async function GET(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(params.id);
    if (messages.rowCount === 0) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw Error("No userId found!");

      const oracleText = await streamCompletetion(
        [backstory, narrator].join("\n")
      );
      await actionsMsg.addMessage(params.id,  narrator, oracleText);
      return NextResponse.json([{ text: oracleText, speaker: narrator}]);
    }

    return NextResponse.json(messages.rows);
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) throw Error("No userId found!");

    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(params.id);
    const textArr = messages.rows.map((r) => r.text);
    const { text, speaker } = await streamToJSON(req.body);
    if (text.length > 300) throw Error("Text string too long!");

    /**
     * I add the backstory {system} to set up the story, 
     * then I send the convo with the user's text and 
     * have a completion done for the narrator.
     */
    textArr.unshift(backstory);
    textArr.push(speaker + text);
    textArr.push(narrator);

    await actionsMsg.addMessage(params.id, speaker, text);
    const narratorText = (await streamCompletetion(textArr.join("\n"))).trim();
    await actionsMsg.addMessage(params.id, narrator, narratorText);
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
