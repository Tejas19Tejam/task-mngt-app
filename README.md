# Task Management App

A full-stack task management application built with React, Express, Prisma ORM, and PostgreSQL.

## Project Structure

```
task-management/
├── backend/    # Express API with Prisma ORM (TypeScript)
├── frontend/   # React + Vite + Tailwind CSS (TypeScript)
└── README.md
```

## Running the Backend

```bash
cd backend
npm install        # also runs prisma generate automatically
npm run dev
```

The backend starts at **http://localhost:4000**

### Environment Variables

Create a `backend/.env` file (copy from `.env.example`):

```env
DATABASE_URL=postgresql://neondb_owner:npg_xzbV5H1rZJID@ep-misty-brook-a1bo3lnp-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=4000
```

> The `.env.example` file already contains the provided connection string — just copy it.

## Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:5173**

### Environment Variables (optional)

The frontend defaults to `http://localhost:4000/api`. To override, create a `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

## API Reference

| Method | Endpoint                | Description                                             |
| ------ | ----------------------- | ------------------------------------------------------- |
| GET    | `/api/health`           | Health check                                            |
| GET    | `/api/tasks`            | List tasks (query: `search`, `status`, `page`, `limit`) |
| POST   | `/api/tasks`            | Create a task                                           |
| GET    | `/api/tasks/:id`        | Get a task by ID                                        |
| PUT    | `/api/tasks/:id`        | Update a task (title, description, status)              |
| DELETE | `/api/tasks/:id`        | Delete a task                                           |
| PATCH  | `/api/tasks/:id/status` | Update task status only                                 |

### Query Parameters for `GET /api/tasks`

| Param    | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| `page`   | number | Page number (default: 1)                   |
| `limit`  | number | Items per page (default: 10, max: 100)     |
| `search` | string | Search in title and description            |
| `status` | string | Filter by `OPEN`, `IN_PROGRESS`, or `DONE` |

## Features

- **View** all tasks in a clean list layout
- **Search** tasks by title or description (debounced)
- **Filter** by status: Open, In Progress, Done
- **Paginate** through tasks with smart page controls
- **Create** tasks via modal form
- **Edit** tasks with pre-filled form
- **Delete** tasks with confirmation dialog
- **Quick status change** inline on each task card
- **Loading and error states** handled throughout

## Architecture

### Backend

- `src/routes/` — Express route definitions
- `src/controllers/` — Request handling and input validation
- `src/services/` — Business logic and database operations
- `src/middleware/` — Error handling middleware
- `src/lib/` — Shared utilities (Prisma singleton)
- `src/config/` — App constants (current user, allowed statuses)
- `prisma/schema.prisma` — Database schema mapping

#### Path Aliases

The backend `tsconfig.json` defines an `@/` alias mapped to `src/`. All internal imports use this alias instead of relative paths:

```ts
// Before
import * as taskService from "../services/taskService";
import { HttpError } from "../middleware/errorHandler";

// After
import * as taskService from "@/services/taskService";
import { HttpError } from "@/middleware/errorHandler";
```

Files updated to use `@/` aliases:

| File                                | Imports changed                                                                        |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `src/controllers/taskController.ts` | `@/services/taskService`, `@/middleware/errorHandler`, `@/config/constants`, `@/types` |
| `src/services/taskService.ts`       | `@/lib/prisma`, `@/types`, `@/middleware/errorHandler`                                 |
| `src/routes/tasks.ts`               | `@/controllers/taskController`                                                         |
| `src/app.ts`                        | `@/routes`, `@/middleware/errorHandler`                                                |

### Frontend

- `src/components/` — Reusable UI components
- `src/hooks/` — Custom React hooks (`useTasks`, `useDebounce`)
- `src/services/api.ts` — Typed API client
- `src/types/index.ts` — Shared TypeScript types
