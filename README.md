# Doodles - Task Management Application

Doodles is a task management application designed to help users organize their tasks efficiently. It features a Kanban board, recurring task support, and a calendar view for better task visualization.

## Features

- 📋 Kanban Board for task organization
- 🔄 Recurring task support with custom intervals
- 📅 Calendar view for task scheduling
- 🎯 Task priority and status management
- 🔐 User authentication for secure access

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/my-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```env
   NEXT_PUBLIC_API_URL
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```env
   DATABASE_URL="your_postgresql_database_url"
   JWT_SECRET="your_jwt_secret"
   PORT=5000
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
doodles/
├── frontend/
│   └── my-project/
│       ├── app/                    # Next.js app router pages
│       ├── components/             # React components
│       │   ├── ui/                # Reusable UI components
│       │   └── dashboard/         # Dashboard specific components
│       ├── context/               # React context providers
│       ├── lib/                   # Utility functions
│       └── public/                # Static assets
│
├── backend/
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   ├── middlewares/         # Express middlewares
│   │   ├── routes/              # API routes
│   │   └── server.js           # Express app setup
│   │
│   └── prisma/                 # Prisma schema and migrations
│       ├── schema.prisma       # Database schema
│       └── migrations/         # Database migrations
```

## Loom Video 
https://www.loom.com/share/cb98e25809cc4713bf31b08bba0d6cd8?sid=ee499f24-ad88-4278-aea5-bec5e4cae231
