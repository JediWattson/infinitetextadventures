export type GameMetaType = {
  // USER FACING
  speaker: string;
  title: string;
  description: string;

  // SERVER FACING
  backstory: string;
  narrator: string;
};

export const gameMeta: { [key: string]: GameMetaType } = {
  OraclesPrivateEye: {
    title: "The Oracle's Private Eye",
    description: `
            You are a detective tasked with a mystery surrounding someone's death with three days to solve the murder. 
            The Oracle will narrate an adventure explaining any questions or events that might occour for you actions.
        `,
    speaker: "Detective:",
    backstory: `
            This will be a text adventure murder mystery set in ancient Greece.
            The detective only have 3 days to solve the case.
            The Oracle is a narrator describing an adventure, and the detective askes questions and describes his actions.
            The Oracle starts by setting up the mystery.
        `,
    narrator: "Oracle:",
  },
  JebsShootout: {
    title: "Shootout at Jeb's Corral",
    description: `
            You're a sharpshooter with only 6 bullets to take out a troublesome gang before they introduce you to this town's UNDERTAKER!!!
            Jebidiah will narrate as you ask questions about your surroundings and describe the target you intend to hit.
            Good luck out there partner!
        `,
    speaker: "Zakaria:",

    backstory: `
            Jebidiah is a narrator describing the adventure to Zakaria.
            Zakaria askes questions and describes his actions.
            He is a nomadic sharpshooter who finds himself in trouble with bandits. 
            Ht must go through town and take out all the bandits before they kill him.
            Jebidiah starts with setting up a scene with Zakaria and the bandits.
        `,
    narrator: "Jebidiah:",
  },
};
