# Your deploy checklist (fill in after first deploy)

Copy values from your local `backend/.env` into Render **only in the dashboard** — do not commit them.

## Render — Web Service (`backend/`)

| Variable | Where to get it |
|----------|-----------------|
| `MONGODB_URI` | Same as local `backend/.env` |
| `JWT_SECRET` | Same as local `backend/.env` |
| `JWT_EXPIRES_IN` | `7d` (or match local) |
| `CLIENT_URL` | Start with `http://localhost:3000`; after Vercel deploy, set to `https://YOUR-VERCEL-URL,http://localhost:3000` |

**Service URL (after deploy):** `https://________________.onrender.com`

Health check: `https://YOUR-SERVICE.onrender.com/api/health`

## Vercel — Project (root: `frontend`)

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

**Frontend URL (after deploy):** `https://________________.vercel.app`

## Order of operations

1. Push `main` to GitHub.
2. Render: deploy API → test health URL.
3. Vercel: deploy frontend with `NEXT_PUBLIC_API_URL`.
4. Render: update `CLIENT_URL` with Vercel URL → manual redeploy.
5. Optional: `cd backend && MONGODB_URI="..." npm run seed` for demo login in production.

## Demo login (after seed)

- Email: `admin@example.com`
- Password: `password123`
