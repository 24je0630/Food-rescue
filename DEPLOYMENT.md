# Food Rescue Network - Deployment Guide

This guide details the exact steps and architecture required to deploy the Food Rescue Network to a production environment. 

## 1. Deployment Architecture

The simplest and most effective deployment architecture for this application is using separate managed services for the frontend, backend, and database to guarantee optimal websocket and static asset performance.

- **Frontend (Static Site)**: Vercel, Netlify, or AWS S3 + CloudFront. (Vercel recommended for seamless Vite support).
- **Backend (Node.js/Express + WebSockets)**: Render, Railway, or AWS Elastic Beanstalk. Must support long-polling and HTTP/1.1 Upgrade for WebSockets (Socket.IO). (Render Web Service recommended).
- **Database**: Managed PostgreSQL. Supabase, Render PostgreSQL, or AWS RDS.
- **Media**: Cloudinary (Optional, schema supports `imageUrl` but no hard dependency exists).
- **WebSockets**: Integrated within the backend. Load balancers must be configured for session affinity (sticky sessions) if scaling beyond a single backend instance.

## 2. Prerequisites

You will need accounts for the following (or equivalents):
1. **GitHub** (to connect repositories to PaaS providers).
2. **Render or Railway** (for Node.js Backend & Managed PostgreSQL).
3. **Vercel** (for React/Vite Frontend).

## 3. Environment Variables

Never commit these values to version control. They must be injected securely into your deployment platforms.

### Backend Variables (Render / Railway)
| Variable | Description | Example |
| -------- | ----------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/db?schema=public` |
| `JWT_SECRET` | Cryptographically secure random string | `your-super-secret-key-32chars` |
| `PORT` | Backend listener port | `5000` (Platform usually sets this automatically) |
| `CLIENT_URL` | The production URL of your frontend | `https://food-rescue-frontend.vercel.app` (Required for CORS) |

### Frontend Variables (Vercel)
*Note: Vite requires environment variables to be injected at **build time**. Ensure these are set in Vercel before the initial deployment.*
| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_API_URL` | Backend production API URL | `https://food-rescue-backend.onrender.com/api` |

---

## 4. PostgreSQL Database Setup

1. Provision a PostgreSQL instance (e.g., on Render or Supabase).
2. Retrieve the external **Connection String** (`DATABASE_URL`).
3. Set this `DATABASE_URL` as an environment variable in your backend deployment.

---

## 5. Backend Deployment (Render Example)

1. Create a new **Web Service** on Render and connect this GitHub repository.
2. Set the Root Directory to `server`.
3. Set the Environment to `Node`.
4. **Build Command**: 
   ```bash
   npm install && npx prisma generate && npm run build
   ```
5. **Start Command**: 
   ```bash
   npm run start
   ```
   *(Ensure `start` script maps to `node dist/index.js` in your `package.json`)*
6. **Important Pre-Deploy Command**: You must migrate the database schema into the production PostgreSQL database. Either run this locally against the production URL, or add a pre-deploy script:
   ```bash
   npx prisma migrate deploy
   ```
7. Enter the **Environment Variables** listed above.
8. Deploy. Ensure the health check at `/api/health` returns `200 OK`.

### Socket.IO & CORS Configuration
The backend uses Socket.IO. Render natively supports WebSocket upgrades. Ensure your `CLIENT_URL` matches exactly (no trailing slash) so the CORS policy permits frontend handshake requests.

---

## 6. Frontend Deployment (Vercel Example)

1. Create a new Project on Vercel and connect this GitHub repository.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `client`.
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. Enter the `VITE_API_URL` environment variable.
7. Deploy. Vercel will automatically build the static assets and deploy them globally.

*Note: The frontend `SocketContext.tsx` strips `/api` from `VITE_API_URL` to connect to the root backend domain. Ensure your backend URL is valid.*

---

## 7. Verification Steps

After deploying both frontend and backend, visit your live Frontend URL and perform the following end-to-end verifications:

1. **Authentication**: Register a new `DONOR` and `NGO` account. Ensure login successfully routes you to the respective dashboards.
2. **Donation Creation**: As a Donor, create a donation. 
3. **Map & Discovery**: As an NGO, verify the map loads (OpenStreetMap) and the newly created donation appears nearby.
4. **Requests & Sockets**: 
   - Open a browser window as the NGO and another as the Donor. 
   - As the NGO, request the donation. 
   - Verify the Donor receives a real-time Socket.IO alert.
5. **Lifecycle**: Progress the donation (`ASSIGNED` → `PICKED_UP` → `DELIVERED`) via a Volunteer account and confirm status updates and database persistence.
6. **Analytics**: Log in as an `ADMIN` and verify the Impact Dashboard (Meals Saved, Total Donations) reflects the test data accurately.
