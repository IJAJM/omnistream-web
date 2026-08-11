import { randomUUID } from "crypto";
import { db } from "./db";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  findByEmail(email: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined;
  },

  findById(id: string): User | undefined {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
  },

  create(input: { name: string; email: string; passwordHash: string }): User {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)`
    ).run(id, input.name, input.email, input.passwordHash);
    return this.findById(id)!;
  },
};
