import { db } from './db';

/** A bishopric member who can sign in to manage meetings. */
export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

/** Looks a user up by email, ignoring case. */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await db()`
    SELECT id, name, email, password_hash AS "passwordHash"
    FROM users
    WHERE lower(email) = lower(${email})
  `;
  return rows[0] as User | undefined;
}
