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

  if (res.status >= 400) throw Error(`Server response status ${res.status}`);

  const data = await res.json();
  return concatSpeakerText(data);
};
