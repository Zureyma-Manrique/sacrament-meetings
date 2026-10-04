-- Week 05: bishopric accounts for signing in.
-- Run once: psql "$DATABASE_URL" -f db/migrate-w05.sql (or paste into the Neon SQL editor).
--
-- Creates a demo account so the sign-in flow can be tested:
--   email:    bishop@maplegrove.test
--   password: Sacrament2026!
-- To add a real account, hash its password with bcrypt
-- (node -e "console.log(require('bcryptjs').hashSync('your-password', 10))")
-- and insert a row like the one below.

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

INSERT INTO users (name, email, password_hash) VALUES
  ('Bishop Daniel Reyes', 'bishop@maplegrove.test', '$2b$10$8J4f10W5bjjH1KHtG1JK3.5.wmWF1/t0SLQsHxUSM1Yn5zoWoIRqu')
ON CONFLICT (email) DO NOTHING;
