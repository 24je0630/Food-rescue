# Environment Variables

This document describes the environment variables required to run the Food Rescue Network application.

## Backend (.env)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/food_rescue?schema=public` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super-secret-jwt-key` |
| `PORT` | The port the Express server will run on | `5000` |
| `CLIENT_URL` | The URL of the frontend application | `http://localhost:5173` |

## Frontend (.env)

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `VITE_API_URL` | The URL of the backend API | `http://localhost:5000/api` |
