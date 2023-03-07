export const concatSpeakerText = ({
  speaker,
  text,
}: {
  speaker: string;
  text: string;
}) => `${speaker}: ${text}`;
