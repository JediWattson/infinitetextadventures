import type { NextApiRequest } from "next";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import gamesActions from "@/db/mongo/games";
import messagesActions from "@/db/postgres/messages";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { streamToJSON, streamCompletetion } from "./lib";
import { getGameMeta } from "@/app/(auth)/dashboard/api/lib";
import { concatSpeakerText } from "@/lib/helpers";

type GamePramsType = { params: { type: string; id: string } };
type MiddlewareOptsType = { playerId?: string };

const redirect = (path: string) =>
  NextResponse.redirect(`${process.env.NEXTAUTH_URL}/${path}`);

const gamesActionsMiddleware =
  (
    next: (
      req: NextApiRequest,
      params: GamePramsType,
      options: MiddlewareOptsType
    ) => {},
    optons?: { userAuth: boolean }
  ) =>
  async (req: NextApiRequest, { params }: GamePramsType) => {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;
      if (optons?.userAuth && !userId) return redirect("/");

      const actionsGame = await gamesActions();
      const game = await actionsGame.findGameById(params.id);
      if (optons?.userAuth && game?.userId !== userId) return redirect("/");

      return next(req, { params }, { playerId: game?.userId });
    } catch (error) {
      console.error(error);
    }
  };

export type MessageResType = {
  playerId?: string;
  messages: { text: string; speaker: string }[];
};

async function get(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType,
  { playerId }: MiddlewareOptsType
) {
  try {
    const actionsGame = await gamesActions();
    const actionsMsg = await messagesActions();

    const messagesRes = await actionsMsg.getMessages(id);
    const messages = messagesRes.rows.map((m) => ({
      text: m.text,
      speaker: m.speaker,
    }));

    const resJson: MessageResType = { playerId, messages };
    if (messagesRes.rowCount === 0) {
      const { backstory, narrator } = await getGameMeta(type);
      const oracleText = await streamCompletetion(
        [`system: ${backstory}`, narrator].join("\n")
      );

      await actionsGame.updateStatus(id, "started");
      await actionsMsg.addMessage(id, type, narrator, oracleText);
      resJson.messages = [{ text: oracleText, speaker: narrator }];
    }

    return NextResponse.json(resJson);
  } catch (error) {
    console.error(error);
  }
}

async function put(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType
) {
  try {
    const { text, speaker } = await streamToJSON(req.body);
    const cleanText = text.trim()    
    if (cleanText.length > 300 || cleanText.length === 0)
      throw Error("Text string invalid!");

    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(id);
    const textArr = messages.rows.map(concatSpeakerText);

    /**
     * I add the backstory {system} to set up the story,
     * then I send the convo with the user's text and
     * have a completion done for the narrator.
     */
    const { narrator, backstory } = await getGameMeta(type);
    textArr.unshift(backstory);
    textArr.push(speaker + cleanText);
    textArr.push(narrator);

    await actionsMsg.addMessage(id, type, speaker, cleanText);
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
    const actionsGame = await gamesActions();
    await actionsGame.updateStatus(params.id, "finished");
    return NextResponse.json({});
  } catch (error) {
    console.error(error);
  }
}

export const GET = gamesActionsMiddleware(get);
export const PUT = gamesActionsMiddleware(put, { userAuth: true });
export const DELETE = gamesActionsMiddleware(del, { userAuth: true });
