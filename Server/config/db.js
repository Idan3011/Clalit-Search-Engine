import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = createPool({
  host: DB_HOST || "localhost",
  user: DB_USER || "root",
  password: DB_PASSWORD || "",
  database: DB_DATABASE || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
