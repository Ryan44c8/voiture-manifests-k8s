import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "db",
  user: "user",
  password: "pass",
  database: "myapp",
};

async function ensureUsersTable() {
  const db = await mysql.createConnection(dbConfig);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Token manquant" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, "secretKey") as { username: string };
    const db = await ensureUsersTable();
    const [rows]: any = await db.execute(
      "SELECT username, created_at FROM users WHERE username = ?",
      [decoded.username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json(rows[0]); // { username: "...", created_at: "..." }
  } catch (err: any) {
    return NextResponse.json({ error: "Token invalide ou erreur serveur : " + err.message }, { status: 403 });
  }
}
