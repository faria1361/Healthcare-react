import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "healthcare_service",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
    console.log("MySQL connected successfully");
  } finally {
    connection.release();
  }
}