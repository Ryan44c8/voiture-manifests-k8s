import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
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

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const db = await ensureUsersTable();
    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    return NextResponse.json({ message: "Utilisateur créé !" });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors de l'inscription : " + err.message }, { status: 400 });
  }
}
