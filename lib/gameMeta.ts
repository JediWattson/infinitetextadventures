export type GameMetaType = {
    speaker: string;
    title: string;
    description: string;
    backstory: string;
    narrator: string;
}

export const gameMeta: { [key: string]: GameMetaType } = {
    OraclesPrivateEye: {
        // USER FACING
        title: "The Oracle's Private Eye",
        description: "You are a detective tasked with a mystery surrounding someone's death with three days to solve the murder. The Oracle will narrate an adventure explaining any questions or events that might occour for you actions.",
        speaker: "Detective:",

        // SERVER FACING
        backstory: "The Oracle is a narrator describing the adventure, while the detective askes questions and describes actions to carry along the story. This will be a text adventure murder mystery set in ancient Greece. The Oracle will give three days starting at the arrival to the murder scene for the detective to solve the murder or else something terrible will happen only the Oracle knows and explains after the said three days have finished. Every statement the detective makes be it action or question will cost time and the oracle will remind the detective how much time is left every response she gives. The Oracle starts by setting up the mystery.",
        narrator: "Oracle:",
    }
}
