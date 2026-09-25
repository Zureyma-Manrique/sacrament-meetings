This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Database setup

The app reads meetings from a PostgreSQL database on [Neon](https://neon.tech).

1. Create a `.env.local` file in the project root with your Neon connection string:

   ```bash
   DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
   ```

   `DATABASE_URL` is also required for `npm run build`. On Vercel, set it for both Production and Preview.

2. Create the `meetings` table and sample data by running `db/schema.sql` once, in the Neon SQL editor or with:

   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```

   If your table was created from an older version of `schema.sql` (no `'special'` meeting type, `announcements` stored as JSONB), run `db/migrate-w03.sql` once instead.

### Development server

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load the Inter and Merriweather fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
