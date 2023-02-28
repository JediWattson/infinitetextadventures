const globalForMongo = global as unknown as { mongo: Promise<MongoClient> };

import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

const mongoClient = globalForMongo.mongo || (new MongoClient(uri, options)).connect();
if (process.env.NODE_ENV !== 'production') globalForMongo.mongo = mongoClient;


export async function conn() {
  const clientConn = await mongoClient
  return clientConn.db("dashboard");
}

export default mongoClient;