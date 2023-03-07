import type { NextApiRequest } from "next";

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import gamesActions from "@/db/mongo/collections/games";
import messagesActions from "@/db/postgres/messages";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { streamToJSON, streamCompletetion } from "./lib";
import { concatSpeakerText } from "@/lib/helpers";
import playersActions from "@/db/mongo/collections/players";
import gamesMetaActions from "@/db/mongo/collections/gamesMeta";

type GamePramsType = { params: { type: string; id: string } };
type MiddlewareOptsType = { playerId?: string; isStarted: boolean };

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
      const actionsGame = await gamesActions();
      const game = await actionsGame.findGameById(params.id);
      if (!game) return NextResponse.json({ gameNotFound: true });
      const options = {
        playerId: game.playerId,
        isStarted: game.status === "started",
      };

      if (optons?.userAuth) {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;

        if (!userId || game.status !== "started")
          return NextResponse.json({ unathorized: true });

        const actionsPlayer = await playersActions();
        const player = await actionsPlayer.findByUserId(userId);
        if (game.playerId !== player?._id.toString())
          return NextResponse.json({ unathorized: true });
      }

      return next(req, { params }, options);
    } catch (error) {
      console.error(error);
    }
  };

export type MessageResType = MiddlewareOptsType & {
  messages: { text: string; speaker: string }[];
};

const getMeta = async (gameKey: string) => {
  const gamesMeta = await gamesMetaActions();
  const game = await gamesMeta.findGameByKey(gameKey);
  if (!game) throw Error("No game metadata found");
  return game;
};

async function get(
  req: NextApiRequest,
  { params: { id, type } }: GamePramsType,
  { playerId, isStarted }: MiddlewareOptsType
) {
  try {
    const actionsGame = await gamesActions();
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

      await actionsGame.updateStatus(id, "started");
      resJson.isStarted = true;
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
    const { text } = await streamToJSON(req.body);
    const cleanText = text.trim();
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
    const { narrator, speaker, backstory } = await getMeta(type);

    textArr.unshift(backstory);
    textArr.push(`${speaker}:` + cleanText);
    textArr.push(`${narrator}:`);

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
