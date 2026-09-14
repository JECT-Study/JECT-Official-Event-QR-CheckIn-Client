This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Check-in API contract

When `/` is rendered, the browser requests
`GET {NEXT_PUBLIC_CHECKIN_API_BASE_URL}/events/active` and expects:

```json
{
  "status": "SUCCESS",
  "data": {
    "name": "[테스트] 온보딩",
    "eventDateTime": "2026-09-19T12:30:00"
  },
  "timestamp": "2026-09-12T07:11:02.195566558Z"
}
```

Before check-in opens, the endpoint can respond with HTTP `409`:

```json
{
  "status": "EVENT-004",
  "data": ["아직 체크인 시작 시각이 되지 않았습니다."],
  "timestamp": "2026-09-12T13:52:45.075021709Z"
}
```

The page then hides the form and shows a refresh button. Refreshing reruns the
uncached active-event request.

Check-in error handling is based on the response body's `status` code:

- `CHECKIN-001`: show the closed-check-in dialog.
- `CHECKIN-002`: hide the form and show the already-checked-in message.
- `CHECKIN-003` through `CHECKIN-005`: show the API message in a support dialog.
- Any other error: navigate to `/error/checkin-failed`.

On submit, the client sends
`POST {NEXT_PUBLIC_CHECKIN_API_BASE_URL}/events/active/check-in` with:

```json
{
  "name": "김젝트",
  "phoneNumber": "01012345678"
}
```

`NEXT_PUBLIC_CHECKIN_API_BASE_URL` defaults to `https://checkin-api.ject.kr`.

During `next dev`, leaving `NEXT_PUBLIC_CHECKIN_API_BASE_URL` unset makes the
browser request `/api/*`. The development-only Next.js rewrite proxies those
requests to `https://checkin-api.ject.kr/*`, avoiding local CORS restrictions.
Production builds do not include this rewrite and remain fully static.

## Static deployment

The application is fully client-rendered and configured with `output: "export"`.
Run `pnpm build` and deploy the generated `out` directory to any static file
host. The API must allow browser requests from the deployed origin through its
CORS policy.
