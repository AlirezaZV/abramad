This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Persisting player submissions

1. Duplicate `.env.example` to `.env.local` and provide real values for `MONGODB_URI` (for a local instance use `mongodb://localhost:27017/abramad`). Optional overrides: `MONGODB_DB` (defaults to `abramad`) and `MONGODB_COLLECTION` (`participants`).
2. Ensure the target MongoDB cluster allows connections from your runtime environment.
3. Install dependencies (`npm install`) so the new `mongodb` driver is available.
4. Run the Next.js dev or production server (`npm run dev` or `npm run start`). Static exports served from the `out` folder cannot execute API routes, so `/api/user-data` will 404 unless the Node server is running.

When a player finishes all crises, `VictoryScreen` automatically calls the `POST /api/user-data` endpoint with the payload:

```json
{
  "firstName": "Sara",
  "lastName": "Azari",
  "phone": "09121234567",
  "email": "player@example.com",
  "date": "2025-12-01T09:30:00.000Z"
}
```

The API validates required fields and inserts the document into the configured MongoDB collection with both the provided `date` (ISO-8601 string) and a server-side `createdAt` timestamp.

> Note: if you prefer a different port (e.g., `npm run dev -- --port 3001`), the API remains available at `http://localhost:<port>/api/user-data` as long as you are running the Next.js server rather than a static export.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
