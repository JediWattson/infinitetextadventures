import type { NextApiRequest } from "next";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import gamesActions from "@/db/mongo/games";
import messagesActions from "@/db/postgres/messages";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { streamToJSON, streamCompletetion } from "./lib";
import { getGameMeta } from "@/app/(auth)/dashboard/api/lib";
import { concatSpeakerText } from "@/lib/helpers";

type GamePramsType = { params: { type: string, id: string } }
type MiddlewareOptsType =  { playerId?: string }

const gamesActionsMiddleware = (
  next: (req: NextApiRequest, params: GamePramsType, options: MiddlewareOptsType ) => {}, optons?: { userAuth: boolean }
) => async (
  req: NextApiRequest,
  { params }: GamePramsType  
) => {
  try {

    const session = await getServerSession(authOptions);
    console.log(session);
    const userId = session?.user?.id;
    if (optons?.userAuth && !userId) return NextResponse.redirect('/');

    const actionsGame = await gamesActions();
    const game = await actionsGame.findGameById(params.id);
    if (optons?.userAuth && game?.userId !==  userId) return NextResponse.redirect('/');  
    
    return next(req, { params }, { playerId: game?.userId }); 
  } catch (error) {
    // console.error(error);
  }
}


export type MessageResType = { playerId?: string, messages: { text: string, speaker: string }[] }

async function get(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType,
  { playerId }: MiddlewareOptsType
) {
  try {
    const actionsGame = await gamesActions();
    const actionsMsg = await messagesActions();

    const messagesRes = await actionsMsg.getMessages(id);
    const messages = messagesRes.rows.map(m => ({ text: m.text, speaker: m.speaker }))

    const resJson: MessageResType = { playerId, messages };
    if (messagesRes.rowCount === 0) {
      const { backstory, narrator } = await getGameMeta(type);
      const oracleText = await streamCompletetion(
        [backstory, narrator].join("\n")
      );

      await actionsGame.updateStatus(id, "started");  
      await actionsMsg.addMessage(id, type, narrator, oracleText);
      resJson.messages = [{ text: oracleText, speaker: narrator}]
    } 

    return NextResponse.json(resJson);
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType
) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

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

async function del(
  req: NextApiRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("DELETED");
    
    const actionsGame = await gamesActions();
    await actionsGame.updateStatus(params.id, "finished");
    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error(error);
  }
}

export const GET = gamesActionsMiddleware((...args) => get(...args));
// export const PUT = gamesActionsMiddleware((...args) => put(...args), { userAuth: true });
export const DELETE = gamesActionsMiddleware((...args) => del(...args), { userAuth: true })
