# Rating App Frontend

## Features
- React (Vite) SPA
- Material UI components
- JWT authentication (localStorage)
- Role-based routing (Admin, User, Owner)
- Store listing, rating, dashboards, user management
- Form validation (react-hook-form)

## Setup Instructions

1. Copy `.env.example` to `.env` and set `VITE_API_URL` (default: http://localhost:4000)
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start dev server:
   ```sh
   npm run dev
   ```
   The app runs at http://localhost:5173

## Where to change API URL or CORS
- API URL: `.env` (`VITE_API_URL`)
- Backend CORS: backend `.env` (`CLIENT_URL`)
