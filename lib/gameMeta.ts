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
    description: `You are a detective tasked with a mystery surrounding someone's death with three days to solve the murder. The Oracle will narrate an adventure explaining any questions or events that might occour for you actions.`,
    backstory: `This is a text adventure about a murder mystery set in ancient Greece. The detective only has 3 days to solve the case. The detective will ask questions and explain actions, while the Oracle narrates the result. The Oracle starts by setting up the mystery.`,
    speaker: "Detective",
    narrator: "Oracle",
  },

  JebsShootout: {
    title: "Shootout at Jeb's Corral",
    description: `
            You're a sharpshooter, Zakaria, who has to take out a troublesome gang before they introduce you to this town's UNDERTAKER!!!
            Jebidiah will narrate as you ask questions about your surroundings and describe the targets you intend to hit.
            Good luck out there partner!
        `,
    speaker: "Zakaria:",

    backstory: `This is a text adventure set in a town in the Wild West. Jebidiah is the narrator describing the adventure to the player Zakaria. Zakaria askes questions and describes his actions to Jebidiah. He is a nomadic sharpshooter who finds himself in trouble with bandits. Jebidiah starts with creating a scenario.`,
    narrator: "Jebidiah:",
  },
};
