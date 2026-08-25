# Food Rescue Network - Deployment Guide

This guide details the exact steps and architecture required to deploy the Food Rescue Network to a production environment based on its current implementation.

## Frontend

* **Provider**: Vercel (Recommended for Vite/React applications).
* **Root directory**: `client`
* **Build command**: `npm run build`
* **Output directory**: `dist`
* **Environment variables**: 
  * `VITE_API_URL` (e.g., `https://your-backend.onrender.com/api`). Note: The Socket.IO client derives its connection URL by replacing `/api` from this variable.
* **SPA routing configuration**: Because the application uses `react-router-dom` for client-side routing, Vercel requires a rewrite configuration to prevent 404 errors on direct navigation to routes like `/login` or `/donor`. You must create a `vercel.json` file in the `client` directory containing:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

## Backend

* **Provider**: Render Web Service, Railway, or any Node.js environment supporting persistent WebSocket connections.
* **Root directory**: `server`
* **Build command**: `npm install && npx prisma generate && npm run build`
* **Start command**: `npm start` (This maps to `node dist/index.js`).
* **Environment variables**:
  * `DATABASE_URL` (Full PostgreSQL connection string).
  * `JWT_SECRET` (Cryptographically secure string for signing tokens).
  * `CLIENT_URL` (The exact production URL of your frontend, e.g., `https://your-frontend.vercel.app`. Required for CORS).
  * `PORT` (Typically set automatically by the platform, defaults to `5000`).
* **Prisma commands**: The schema must be generated during build (`npx prisma generate`). Production migrations must be applied securely.

## Database

* **Provider**: Managed PostgreSQL (e.g., Render PostgreSQL, Supabase, or AWS RDS).
* **PostgreSQL**: Required (Version 15+ is compatible, as tested in docker-compose).
* **DATABASE_URL**: The exact connection string provided by your host (e.g., `postgresql://user:password@host:5432/food_rescue?schema=public`).
* **Migration command**: Before the backend can serve requests, you must apply migrations to the production database using:
  ```bash
  npx prisma migrate deploy
  ```
  This can be run locally against the production URL, or as part of a pre-deploy hook on your platform.

## Socket.IO

* **Production backend URL**: Derived dynamically in the frontend by stripping `/api` from `VITE_API_URL`. Ensure the backend domain is publicly accessible.
* **CORS requirements**: The backend strictly validates origins using the `CLIENT_URL` environment variable. Ensure this matches your frontend URL exactly, without a trailing slash.
* **WebSocket requirements**: The deployment provider must support HTTP/1.1 Upgrade headers and long-lived connections. Standard serverless functions (like AWS Lambda or Vercel Serverless) will break Socket.IO.
* **Whether sticky sessions are actually needed**: The application currently runs flawlessly on a single backend instance without sticky sessions. Sticky sessions (and a Redis adapter) are **only** required if you scale the backend horizontally across multiple instances (e.g., to load balance heavy traffic). For a standard single-instance deployment, sticky sessions are NOT needed.

## Cloudinary

* **Not currently used**: The database schema supports an optional `imageUrl` string, but there is no hard dependency, package, or image upload routes currently implemented in the codebase.
