import { pool } from "../config/db";

export interface User {
  id: number;
  email: string;
  password: string;
  created_at?: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] || null;
};

export const createUser = async (email: string, passwordHash: string): Promise<User> => {
  const result = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, passwordHash]
  );
  return result.rows[0];
};

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await pool.query("SELECT id, email, created_at FROM users WHERE id = $1", [id]);
  return result.rows[0] || null;
};
