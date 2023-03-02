export type GameMetaType = {
    // USER FACING
    speaker: string;
    title: string;
    description: string;
    
    // SERVER FACING
    backstory: string;
    narrator: string;
}

export const gameMeta: { [key: string]: GameMetaType } = {
    OraclesPrivateEye: {
        title: "The Oracle's Private Eye",
        description: `
            You are a detective tasked with a mystery surrounding someone's death with three days to solve the murder. 
            The Oracle will narrate an adventure explaining any questions or events that might occour for you actions.
        `,
        speaker: "Detective:",
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
        
        backstory: `
            Jebidiah is a narrator describing the adventure, while Zakaria askes questions and describes his actions. 
            Zakaria is a nomadic sharpshooter, and in this adventure he finds himself in trouble with bandits. 
            Zakaria must stratigically place each bullet in a way that kills all of bandits.
            The bandits can shoot back and injure or kill Zakaria.
            Zakaria has only six bullets to kill the bad guys before they kill him. 
            Zakaria can only shoot one time per turn and must write that he fired a bullet in some way. 
            Jebidiah will provide him with the details and remind him of how many bullets he has left. 
            Jebidiah starts with a description of the surroundings.
        `,
        narrator: "Jebidiah:",

    }

}
