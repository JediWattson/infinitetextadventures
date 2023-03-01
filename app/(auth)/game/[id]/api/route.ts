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
      const text = await streamCompletetion([backstory, narrator].join("\n"));
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) throw Error('No userId found!')
      await actionsMsg.addMessage(session?.user?.id, params.id, text);
      return NextResponse.json([{ text, gameId: params.id }]);
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
    const userId = session?.user?.id
    if (!userId) throw Error('No userId found!')
      
    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(params.id);
    const textArr = messages.rows.map((r) => r.text);
    const { text } = await streamToJSON(req.body);
    textArr.unshift(backstory);
    textArr.push(text);
    textArr.push(narrator);

    await actionsMsg.addMessage(userId, params.id, text);
    const narratorRes = await streamCompletetion(textArr.join("\n"));
    await actionsMsg.addMessage(userId, params.id, narratorRes);
    return NextResponse.json({ text: narratorRes });
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
