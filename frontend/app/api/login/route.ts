import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
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

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const db = await ensureUsersTable();
    const [rows]: any = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 400 });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 400 });

    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
    return NextResponse.json({ message: "Connexion réussie", token, created_at: rows[0].created_at });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur serveur : " + err.message }, { status: 500 });
  }
}
