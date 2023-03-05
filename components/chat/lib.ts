import { concatSpeakerText } from "@/lib/helpers";

export const postOracle = async (
  gamePath: string,
  message: { speaker: string; text: string }
) => {
  const res = await fetch(`/game/${gamePath}/api`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const data = await res.json();
  if (data.unathorized || data.gameNotFound) throw Error(`Unathorized`);

  return concatSpeakerText(data);
};
