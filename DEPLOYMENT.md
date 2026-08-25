# Food Rescue Network — Deployment Guide

This guide details the exact steps and configuration required to deploy the Food Rescue Network to a production environment.

## 1. Architecture

### Frontend

* **Provider**: Vercel
* **Root directory**: `client`
* **Build command**: `npm run build`
* **Output directory**: `dist`

### Backend

* **Provider**: Render Web Service
* **Root directory**: `server`
* **Build command**: `npm install && npx prisma generate && npm run build`
* **Start command**: `npm start` (Executes `node dist/index.js`)

### Database

* **Managed PostgreSQL**

### Media

* **Cloudinary**: Not currently used
* `imageUrl` remains optional in the database schema

### WebSockets

* **Socket.IO integrated into the Node.js backend**
* **Single backend instance is sufficient for the current deployment**
* Explain scaling considerations only if relevant (sticky sessions are only required when horizontally scaling across multiple instances).

---

## 2. Prerequisites

1. GitHub
2. Vercel
3. Render
4. PostgreSQL provider (e.g., Render PostgreSQL, Supabase, or AWS RDS)

---

## 3. Frontend Deployment

* **Provider**: Vercel
* **Root directory**: `client`
* **Build command**: `npm run build`
* **Output directory**: `dist`
* **VITE_API_URL**: Must be set during build time (e.g., `https://your-backend.onrender.com/api`).
* **Socket.IO**: Automatically obtains its backend URL by stripping `/api` from `VITE_API_URL`.
* **SPA routing**: To prevent 404 errors on direct navigation (like `/login`), React Router requires a rewrite configuration. A `vercel.json` file must be present in the `client` directory containing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 4. Backend Deployment

* **Provider**: Render Web Service (or equivalent Node.js environment supporting persistent connections).
* **Root directory**: `server`
* **Build command**: `npm install && npx prisma generate && npm run build`
* **Start command**: `npm start`
* **Required environment variables**: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`
* **PORT behavior**: Automatically bound by the cloud provider (defaults to `5000` locally).

---

## 5. PostgreSQL Database

* **PostgreSQL requirement**: Version 15+ compatible database.
* **DATABASE_URL**: The external connection string to your managed database.
* **Prisma**: Acts as the ORM to communicate with the database.
* **Production migration command**: To apply the schema to a live production database, execute:

```bash
npx prisma migrate deploy
```

*Note on Build vs. Migration*: `npx prisma generate` only compiles the JavaScript Prisma Client during build time. It does *not* apply database schema changes. You must run `npx prisma migrate deploy` safely against your production URL before serving traffic.

---

## 6. Environment Variables

Never commit these values to version control.

### Backend

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/db?schema=public` |
| `JWT_SECRET` | Cryptographically secure random string | `your-super-secret-key-32chars` |
| `CLIENT_URL` | Exact production URL of your frontend | `https://food-rescue.vercel.app` |
| `PORT` | Backend listener port (if not auto-set) | `5000` |

### Frontend

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_API_URL` | Backend production API URL | `https://food-rescue-backend.onrender.com/api` |

---

## 7. Socket.IO

* **Backend Socket.IO endpoint**: Mounted natively on the Node.js Express server.
* **Frontend connection**: Connects automatically by parsing `VITE_API_URL` without the `/api` route.
* **CORS**: Secured via the `CLIENT_URL` variable to accept handshakes only from the official frontend domain.
* **WebSocket support**: Provider must support HTTP/1.1 Upgrade headers. Serverless deployments are unsupported due to timeouts.
* **Production URL relationship**: Ensures events route to the correct domain context safely.
* **Single-instance deployment**: Standard functionality relies on a single backend instance. Sticky sessions or Redis adapters are *not* required for current deployment, but will be necessary if you plan to scale horizontally.

---

## 8. CORS

The `CLIENT_URL` environment variable must exactly match the deployed frontend origin (without trailing slashes). This configuration secures both standard Express REST API calls and Socket.IO handshakes against unauthorized cross-origin requests.

---

## 9. Cloudinary

**Cloudinary is currently NOT used by the application and is NOT required for deployment.**

---

## 10. Deployment Verification

After deployment, test the following:

### Frontend
- [ ] Landing page
- [ ] Login
- [ ] Registration
- [ ] Direct routes (Refresh a sub-route without a 404)

### Authentication
- [ ] Donor login
- [ ] NGO login
- [ ] Volunteer login
- [ ] Admin login

### Food workflow
- [ ] Donation creation
- [ ] NGO request
- [ ] Assignment
- [ ] Pickup
- [ ] Delivery

### Real-time
- [ ] Socket.IO connection
- [ ] Notifications (Updates appear automatically without refreshing)

### Maps
- [ ] Location plots correctly
- [ ] Nearby donations display based on Haversine distance
- [ ] Pickup/delivery map renders markers

### Analytics
- [ ] Meals saved
- [ ] Food rescued
- [ ] Completed donations

---

## 11. Troubleshooting

* **CORS errors**: Check `CLIENT_URL`. It must precisely match the frontend domain (no trailing slash).
* **API connection errors**: Check `VITE_API_URL`. It must correctly point to the deployed backend's `/api` endpoint.
* **Socket.IO connection errors**: Check backend URL, CORS, and ensure your host supports persistent WebSocket connections (no serverless limitations).
* **Database connection errors**: Check `DATABASE_URL` string validity and network accessibility.
* **Prisma migration errors**: Check database connectivity and run the documented `npx prisma migrate deploy` command manually if necessary.
* **React Router 404 errors**: Check `vercel.json` SPA rewrite configuration on your frontend host.
