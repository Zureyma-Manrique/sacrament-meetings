import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let client: NeonQueryFunction<false, false> | undefined;

/**
 * The Neon client, created on first use. Checking DATABASE_URL here rather than
 * at import time lets `next build` run without it, since every page queries at request time.
 */
export function db(): NeonQueryFunction<false, false> {
  if (!client) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Add it to .env.local (see README.md).');
    }
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}
