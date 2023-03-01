import fs from "fs/promises";
import { Pool, PoolConfig } from "pg";

export default async () => {
  const config: PoolConfig = {};

  if (process.env.NODE_ENV === "production") {
    if (!process.env.PGSSLCA || !process.env.PGSSLKEY || !process.env.PGSSLCERT)
      throw new Error("incorrect import paths for the postgres certs");
    config.ssl = {
      rejectUnauthorized: false,
      ca: (await fs.readFile(process.env.PGSSLCA)).toString(),
      key: (await fs.readFile(process.env.PGSSLKEY)).toString(),
      cert: (await fs.readFile(process.env.PGSSLCERT)).toString(),
    };
  }

  const pool = new Pool(config);
  return {
    query: (text: string, params: any) => pool.query(text, params) 
  }
};
