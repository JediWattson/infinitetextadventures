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
        description: `
            You are a detective tasked with a mystery surrounding someone's death with three days to solve the murder. 
            The Oracle will narrate an adventure explaining any questions or events that might occour for you actions.
        `,
        speaker: "Detective:",

        // SERVER FACING
        backstory: "The Oracle is a narrator describing the adventure, while the detective askes questions and describes actions to carry along the story. This will be a text adventure murder mystery set in ancient Greece. The Oracle will give three days starting at the arrival to the murder scene for the detective to solve the murder or else something terrible will happen only the Oracle knows and explains after the said three days have finished. Every statement the detective makes be it action or question will cost time and the oracle will remind the detective how much time is left every response she gives. The Oracle starts by setting up the mystery.",
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
        
        backstory: "The following is a text adventure set in the wild west with narration by Jebidiah and actions provided by Zakaria. Zakaria is a nomadic sharpshooter, and in this adventure he finds himself in trouble with the locals. He has only six bullets he must place correctly throughout the town to kill the bad guys before they kill him. Zakaria can either shoot somewhere or ask for details that will help him figure out where to shoot. Jebidiah will provide him with the details and remind him of how many bullets he has left. Jebidiah also sets up the story.",
        narrator: "Jebidiah:",

    }

}
