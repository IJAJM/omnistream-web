import { pool } from "./db";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  async findByEmail(email: string): Promise<User | undefined> {
    const { rows } = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
    return rows[0];
  },

  async findById(id: string): Promise<User | undefined> {
    const { rows } = await pool.query<User>("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
  },

  async create(input: { name: string; email: string; passwordHash: string }): Promise<User> {
    const { rows } = await pool.query<User>(
      `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [input.name, input.email, input.passwordHash]
    );
    return rows[0];
  },
};
