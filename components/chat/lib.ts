// TODO: move somewhere cleaner
const concatSpeakerText = ({ speaker, text }: { speaker: string, text: string }) => `${speaker} ${text}`

export const postOracle = async (gameId: string, message: { speaker: string, text: string }) => {
  const res = await fetch(`/game/${gameId}/api`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (res.status >= 400) throw Error(`Server response status ${res.status}`);

  const data = await res.json();
  return concatSpeakerText(data);
};

export const getGame = async (gameId: string) => {
  const res = await fetch(`/game/${gameId}/api`);
  const data: [{ text: string, speaker: string }] = await res.json();
  return data.map(concatSpeakerText);
};
