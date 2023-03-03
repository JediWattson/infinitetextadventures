import {  gameMeta } from '@/lib/gameMeta';

export const getAllGames = async () => {
    return gameMeta;
}

export const getGameMeta = async (type: string) => {    
    return gameMeta[type];
}