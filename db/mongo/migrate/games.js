import mongoClientRef from '../init';


export async function games() {
    if (!mongoClientRef.current) {
        setTimeout(migrateInit, 200);
        return;
    }

    const { current: conn } = mongoClientRef;
    console.log("==== Creating collection games ====");
    const games = await conn.createCollection('games');
    console.log("==== Creating index for games ====");
    await games.createIndex({ userId: 1 });
    console.log("==== games is now finished!!! ====");
}