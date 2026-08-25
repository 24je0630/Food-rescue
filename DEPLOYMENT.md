# Food Rescue Network - Deployment Guide

This guide details the exact steps and architecture required to deploy the Food Rescue Network to a production environment.

## 1. Architecture

- **Frontend (Static Site)**: Vercel (Recommended for Vite/React applications).
- **Backend (Node.js + WebSockets)**: Render Web Service, Railway, or any Node.js environment supporting persistent WebSocket connections.
- **Database**: Managed PostgreSQL (e.g., Render PostgreSQL, Supabase, AWS RDS).
- **Media**: Cloudinary (Not currently used; database schema supports optional `imageUrl` without hard dependencies).
- **WebSockets**: Integrated natively within the Node.js backend using Socket.IO.

## 2. Prerequisites

You will need accounts for the following (or equivalents):
1. **GitHub** (to connect repositories to PaaS providers).
2. **Render or Railway** (for Node.js Backend & Managed PostgreSQL).
3. **Vercel** (for React/Vite Frontend).

## 3. Frontend Deployment

* **Provider**: Vercel
* **Root directory**: `client`
* **Build command**: `npm run build`
* **Output directory**: `dist`
* **Environment variables**: `VITE_API_URL`
* **SPA Routing**: The `client/vercel.json` file ensures that direct navigation to paths (e.g., `/login`, `/donor`) resolves to the `index.html` root without triggering a 404 error. 

## 4. Backend Deployment

* **Provider**: Render Web Service (or equivalent Node.js host).
* **Root directory**: `server`
* **Build command**: `npm install && npx prisma generate && npm run build`
* **Start command**: `npm start` (Executes `node dist/index.js`).

## 5. PostgreSQL Database

* **Requirement**: PostgreSQL 15+ compatible database.
* **DATABASE_URL**: The external connection string to your managed database, formatted as `postgresql://user:password@host:5432/food_rescue?schema=public`.

## 6. Environment Variables

Never commit these values to version control. They must be injected securely into your deployment platforms.

### Backend (Server)
* `DATABASE_URL`: PostgreSQL connection string.
* `JWT_SECRET`: Cryptographically secure random string.
* `PORT`: Server listener port (Platform usually sets this automatically).
* `CLIENT_URL`: The exact production URL of your frontend (e.g., `https://food-rescue.vercel.app`). Required for CORS.

### Frontend (Client)
* `VITE_API_URL`: Backend production API URL (e.g., `https://food-rescue-backend.onrender.com/api`).

## 7. Prisma Migration

There is a vital distinction between build-time generation and database migration:
* **Build-time**: `npx prisma generate` creates the Prisma Client based on your schema. It is included in the backend build command.
* **Production Database Migration**: `npx prisma migrate deploy` applies the database schema to your production database. You must execute this command before the backend can serve requests (e.g., as a pre-deploy script in your hosting provider, or manually run against the production database URL).

## 8. Socket.IO

* **Backend URL**: Socket.IO automatically derives its target endpoint by stripping `/api` from the `VITE_API_URL` environment variable. Ensure the backend domain is publicly accessible.
* **WebSocket Requirements**: The deployment provider must support HTTP/1.1 Upgrade headers and long-lived connections. Standard serverless functions (like AWS Lambda or Vercel Serverless) will break Socket.IO.
* **Scaling Considerations**: The application currently runs flawlessly on a single backend instance without sticky sessions. Sticky sessions and a Redis adapter are **only required** if you scale the backend horizontally across multiple instances.

## 9. CORS

* **Configuration**: The backend validates origins strictly against the `CLIENT_URL` environment variable.
* Ensure the frontend and backend URLs are configured consistently. `CLIENT_URL` must exactly match your frontend deployment URL (without a trailing slash) to prevent Cross-Origin Request blocking on API calls and Socket.IO handshakes.

## 10. Cloudinary

* **Status**: Not currently used. 
* The database schema natively supports an optional `imageUrl` reference, but there are no hard dependencies, packages, or required environment variables necessary to deploy the application successfully.

## 11. Deployment Verification

After deployment, test the following workflows sequentially:

### Frontend
- Landing page renders correctly.
- Login and Registration forms load.
- Direct route navigation (e.g., refreshing `/login`) works without 404s.

### Authentication
- Successfully login as a Donor, NGO, Volunteer, and Admin.

### Donation Workflow
- **Create**: Donor creates a donation.
- **Discover**: NGO discovers the donation on the Map.
- **Request**: NGO requests the donation.
- **Assignment**: Volunteer accepts the pickup task.
- **Delivery**: Volunteer updates status to PICKED_UP then DELIVERED.
- **Verification**: Final DELIVERED state saves to database.

### Real-time
- Notifications pop up across isolated browser windows automatically when statuses change via Socket.IO connection.

### Maps
- Donation location coordinates plot accurately on the OpenStreetMap via Leaflet.
- Nearby donations correctly measure proximity (Haversine formula).

### Analytics
- Admin dashboard correctly aggregates metrics for "Meals saved", "Food rescued", and "Completed donations".

## 12. Troubleshooting

* **CORS error**: Check your backend `CLIENT_URL` variable. It must precisely match the frontend domain.
* **API connection failure**: Check your frontend `VITE_API_URL` variable. It must correctly point to the deployed backend's `/api` route.
* **Socket.IO connection failure**: Verify the backend deployment environment fully supports WebSockets (no serverless timeouts). Ensure CORS is configured properly.
* **Database connection failure**: Verify the `DATABASE_URL` string is valid, unquoted, and network-accessible.
* **Prisma migration failure**: Check database connectivity and ensure you have run the production migration command (`npx prisma migrate deploy`).
* **React Router 404**: Check that `vercel.json` SPA rewrite rules are successfully deployed in the root `client` directory.
