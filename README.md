# Food Rescue Network

## Problem
Restaurants, weddings, hostels, supermarkets, hotels, and other organizations often have edible surplus food that gets wasted, while NGOs and communities need food.

## Solution
Food Rescue Network connects food donors with NGOs and volunteers. The platform allows businesses to report surplus food, NGOs to request it, and volunteers to pick it up and deliver it.

## User Roles
* **Donor**: Restaurants, supermarkets, etc. who donate surplus food.
* **NGO**: Organizations that discover and request food donations.
* **Volunteer**: Individuals who accept pickup/delivery tasks.
* **Admin**: Platform administrators monitoring the system.

## Features
* Secure Authentication & Authorization (JWT)
* Real-time Notifications (Socket.IO)
* Location-based Discovery & Maps (Leaflet, OpenStreetMap)
* Status Dashboards & Analytics
* Donation Lifecycle Management (AVAILABLE -> REQUESTED -> ASSIGNED -> PICKED_UP -> DELIVERED)

## Architecture & Tech Stack
* **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod, React-Leaflet, Recharts.
* **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma ORM, JWT, Helmet, CORS.
* **Infrastructure**: Docker, Docker Compose, GitHub Actions.

## Setup Instructions

### Environment Variables
Copy `.env.example` to `.env` in the root directory and update the variables accordingly.

### Local Development
1. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Start the database (if using Docker):
   ```bash
   docker-compose up -d
   ```
3. Run migrations:
   ```bash
   cd server && npx prisma migrate dev
   ```
4. Start development servers:
   ```bash
   # In terminal 1
   cd server && npm run dev
   # In terminal 2
   cd client && npm run dev
   ```

### Docker
To run the entire stack via Docker:
```bash
docker-compose up --build
```
