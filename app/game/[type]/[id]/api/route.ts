import { NextRequest, NextResponse } from "next/server";

import gamesActions from "@/db/mongo/collections/games";
import messagesActions from "@/db/postgres/messages";
import { concatSpeakerText } from "@/lib/helpers";

import { streamToJSON, streamCompletetion, GamePramsType, MiddlewareOptsType, MessageResType, gamesActionsMiddleware, getMeta } from "./lib";

async function get(
  req: NextRequest,
  { params: { id, type } }: GamePramsType,
  { playerId, isStarted }: MiddlewareOptsType
) {
  try {
    const actionsMsg = await messagesActions();
    const messagesRes = await actionsMsg.getMessages(id);
    const messages = messagesRes.rows.map((m) => ({
      text: m.text,
      speaker: m.speaker,
    }));

    const resJson: MessageResType = { isStarted, playerId, messages };
    if (messagesRes.rowCount === 0) {
      const { backstory, narrator } = await getMeta(type);
      const oracleText = await streamCompletetion(
        [`system: ${backstory}`, `${narrator}:`].join("\n")
      );
      await actionsMsg.addMessage(id, type, narrator, oracleText);
      resJson.messages = [{ text: oracleText, speaker: narrator }];
      
      const actionsGame = await gamesActions();
      await actionsGame.updateStatus(id, "started");
      resJson.isStarted = true;
    }

    return NextResponse.json(resJson);
  } catch (error) {
    console.error(error);
  }
}

async function put(
  req: NextRequest,
  { params: { id, type } }: GamePramsType
) {
  try {
    if (!req.body) throw Error('Invalid body');
    const { text } = await streamToJSON(req.body);
    const cleanText = text.trim();
    if (cleanText.length > 300 || cleanText.length === 0)
      throw Error("Text string invalid!");

    const games = await gamesActions();
    const actionsMsg = await messagesActions();
    const messages = await actionsMsg.getMessages(id);
    const textArr = messages.rows.map(concatSpeakerText);

    /**
     * I add the backstory {system} to set up the story,
     * then I send the convo with the user's text and
     * have a completion done for the narrator.
     */
    const { narrator, speaker, backstory } = await getMeta(type);

    textArr.unshift(backstory);
    textArr.push(`${speaker}:` + cleanText);
    
    if (textArr.length > 30) {
      textArr.push(`system: the narrator will now end the game.`)
      await games.updateStatus(id, "finished");
    };
    textArr.push(`${narrator}:`);

    await actionsMsg.addMessage(id, type, speaker, cleanText);
    const narratorText = await streamCompletetion(textArr.join("\n"));
    await actionsMsg.addMessage(id, type, narrator, narratorText);
    await games.updateMsgCount(id, textArr.length)
    return NextResponse.json({ speaker: narrator, text: narratorText });
  } catch (error) {
    console.error(error);
  }
}

async function del(
  req: NextRequest,
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
