import { getServerSession } from "next-auth";
import { OpenAIApi, Configuration } from "openai";

import playersActions from "@/db/mongo/collections/players";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import gamesActions from "@/db/mongo/collections/games";
import { NextResponse, NextRequest } from "next/server";
import gamesMetaActions from "@/db/mongo/collections/gamesMeta";

export type GamePramsType = { params: { type: string; id: string } };
export type MiddlewareOptsType = { playerId?: string; isStarted: boolean };
export type MessageResType = MiddlewareOptsType & {
  messages: { text: string; speaker: string }[];
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function streamCompletetion(prompt: string) {
  const completion: any = await openai.createCompletion(
    {
      model: "text-davinci-003",
      prompt,

      stream: true,
      temperature: 1,
      max_tokens: 220,
      top_p: 1,
      frequency_penalty: 1.63,
      presence_penalty: 1.69,
      stop: ["\n"],
    },
    { responseType: "stream" }
  );

  return new Promise<string>((resolve, reject) => {
    let string = "";
    completion.data.on("data", (data: ReadableStream) => {
      try {
        data
          .toString()
          .split("\n")
          .filter((line) => line.trim() !== "")
          .forEach((line) => {
            const message = line.replace(/^data: /, "");
            if (message === "[DONE]") {
              if (string === "") reject("Empty string sent");
              resolve(string.trim());
            } else {
              string += JSON.parse(message).choices[0].text;
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function streamToJSON(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  let decoder = new TextDecoder("utf-8");

  const result = await reader.read();
  return JSON.parse(decoder.decode(result.value));
}

export const gamesActionsMiddleware =
(
  next: (
    req: NextRequest,
    params: GamePramsType,
    options: MiddlewareOptsType
  ) => {},
  optons?: { userAuth: boolean }
) =>
async (req: NextRequest, { params }: GamePramsType) => {
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

export const getMeta = async (gameKey: string) => {
  const gamesMeta = await gamesMetaActions();
  const game = await gamesMeta.findGameByKey(gameKey);
  if (!game) throw Error("No game metadata found");
  return game;
};