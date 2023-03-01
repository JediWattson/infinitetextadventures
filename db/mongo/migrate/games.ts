import { conn } from '../connection';

export async function games() {
    const db = await conn();
    console.log("==== Creating collection games ====");
    const gamesActions = await db.createCollection('games');
    console.log("==== Creating index for games ====");
    await gamesActions.createIndex({ userId: 1 });
    console.log("==== games is now finished!!! ====");
}