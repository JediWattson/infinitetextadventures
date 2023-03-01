import fs from "fs/promises";
import { Pool, PoolConfig } from "pg";

const config: PoolConfig = {};

if (process.env.NODE_ENV === "production") {
  if (!process.env.PGSSLCA || !process.env.PGSSLKEY || !process.env.PGSSLCERT)
    throw new Error("incorrect import paths for the postgres certs");
  config.ssl = {
    rejectUnauthorized: false,
    ca: fs.readFile(process.env.PGSSLCA).toString(),
    key: fs.readFile(process.env.PGSSLKEY).toString(),
    cert: fs.readFile(process.env.PGSSLCERT).toString(),
  };
}

const pool = new Pool(config);

export default {
  query: (text: string, params: any) => pool.query(text, params),
};
