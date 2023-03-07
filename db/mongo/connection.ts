const globalForMongo = global as unknown as { mongo: Promise<MongoClient> };

import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!process.env.MONGDB_NAME) {
  throw new Error('Invalid/Missing environment variable: "MONGDB_NAME"');
}

const uri = `${process.env.MONGODB_URI}/${process.env.MONGDB_NAME}`;
const options = {};

const mongoClient =
  globalForMongo.mongo || new MongoClient(uri, options).connect();
if (process.env.NODE_ENV !== "production") globalForMongo.mongo = mongoClient;

export async function conn() {
  const clientConn = await mongoClient;
  return clientConn.db();
}

export async function getCol(name: string) {
  const db = await conn();
  return db.collection(name);
}

export default mongoClient;
