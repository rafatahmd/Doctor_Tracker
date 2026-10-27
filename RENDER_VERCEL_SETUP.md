# Your deploy checklist (fill in after first deploy)

Copy values from your local `backend/.env` into Render **only in the dashboard** — do not commit them.

## Render — Web Service (`backend/`)

**Fast path:** [Render Dashboard → New Blueprint](https://dashboard.render.com/select-repo?type=blueprint) → select `Doctor_Tracker` → set secrets when asked.

**Manual path:** New Web Service → repo `Doctor_Tracker` → **Root Directory:** `backend` → **Health Check:** `/api/health` → Free plan.

| Variable | Where to get it |
|----------|-----------------|
| `MONGODB_URI` | Same as local `backend/.env` |
| `JWT_SECRET` | Same as local `backend/.env` |
| `JWT_EXPIRES_IN` | `7d` (or match local) |
| `CLIENT_URL` | Start with `http://localhost:3000`; after Vercel deploy, set to `https://YOUR-VERCEL-URL,http://localhost:3000` |

**Service URL (after deploy):** `https://________________.onrender.com`

Health check: `https://YOUR-SERVICE.onrender.com/api/health`

## Vercel — Project (root: `frontend`)

**Import:** [vercel.com/new](https://vercel.com/new) → `Doctor_Tracker` → **Root Directory:** `frontend` → add env below → Deploy.

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

**Frontend URL (after deploy):** `https://________________.vercel.app`

## Repo (ready to connect)

**GitHub:** https://github.com/rafatahmd/Doctor_Tracker  
Latest commit on `main` includes `frontend/`, `render.yaml`, and deployment docs.

## Order of operations

1. ~~Push `main` to GitHub.~~ **Done** — connect this repo in Render and Vercel.
2. Render: deploy API → test health URL.
3. Vercel: deploy frontend with `NEXT_PUBLIC_API_URL`.
4. Render: update `CLIENT_URL` with Vercel URL → manual redeploy.
5. Optional: `cd backend && MONGODB_URI="..." npm run seed` for demo login in production.

## Demo login (after seed)

- Email: `admin@example.com`
- Password: `password123`
