import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const pool = createPool({
  host: DB_HOST || "",
  user: DB_USER || "",
  password: DB_PASSWORD || "",
  database: DB_DATABASE || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000, 
});


pool.getConnection()
  .then((connection) => {
    console.log('Connected to MySQL!');
    connection.release(); 
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err);
  });

export default pool;
