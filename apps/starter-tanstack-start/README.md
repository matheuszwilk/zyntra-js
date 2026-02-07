# ZyntraJS Starter: TanStack Start Full-Stack App

[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1-blue.svg)](https://tanstack.com/start/latest)
[![Vite](https://img.shields.io/badge/Vite-5-blue.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the ZyntraJS starter for building full-stack, type-safe applications with **TanStack Start**. This template provides a modern, performant foundation for web applications, combining the power of Vite, file-based routing with TanStack Router, and an end-to-end type-safe API layer provided by ZyntraJS.

## Features

-   **Full-Stack with TanStack Start**: A cohesive, modern full-stack framework powered by Vite.
-   **End-to-End Type Safety**: Powered by ZyntraJS, ensuring type safety between your front-end and back-end.
-   **File-Based Routing**: Uses TanStack Router for intuitive, type-safe routing.
-   **Server-Side Data Fetching**: Leverages TanStack Router's loaders to fetch data on the server.
-   **Feature-Based API Architecture**: A scalable project structure that organizes API code by business domain.
-   **Ready-to-Use Services**: Pre-configured examples for:
    -   **Caching**: Integrated with Redis via `@zyntra-js/adapter-redis`.
    -   **Background Jobs**: Asynchronous task processing with BullMQ via `@zyntra-js/adapter-bullmq`.
-   **Auto-Generated API Client**: A fully-typed client that mirrors your API, providing autocomplete and compile-time error checking.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en) (v18 or higher)
-   [npm](https://www.npmjs.com/) or a compatible package manager like [Bun](https://bun.sh/).
-   A running [Redis](https://redis.io/docs/getting-started/) instance (for caching and background jobs).
-   A PostgreSQL database (or you can configure Prisma for a different one).

## Getting Started

Follow these steps to get your project up and running:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/matheuszwilk/zyntra-js.git
    cd zyntra-js/apps/starter-tanstack-start
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root of this starter (`zyntra-js/apps/starter-tanstack-start/.env`) and add your database and Redis connection URLs:

    ```env
    # .env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    REDIS_URL="redis://127.0.0.1:6379"
    ```

4.  **Run Database Migrations**
    ```bash
    npx prisma db push
    ```

5.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    This command starts the Vite development server. Your application will be available at `http://localhost:5173`.

## How It Works

This starter integrates an ZyntraJS API backend directly into a TanStack Start application.

### 1. API Integration via Catch-All Route

The connection point between TanStack Start and ZyntraJS is a **catch-all API route**.

-   **Location**: `src/routes/api/v1/$.ts`
-   **Mechanism**: This file uses `createFileRoute` from TanStack Router to capture all requests made to `/api/v1/*`. Both the `loader` (for GET requests) and `action` (for POST, PUT, etc.) functions call a handler that passes the standard `Request` object directly to the `AppRouter.handler` from ZyntraJS. This seamlessly delegates API handling to the ZyntraJS runtime.

### 2. The ZyntraJS API Layer

The back-end API logic is defined purely within the ZyntraJS structure.

-   **Initialization (`src/zyntra.ts`)**: This is where the core Zyntra instance is created and configured with adapters for the store (Redis), jobs (BullMQ), and logging.
-   **Router (`src/zyntra.router.ts`)**: This file assembles the main API router by importing all feature controllers.
-   **Controllers (`src/features/[feature]/controllers/`)**: Controllers group related API actions (`query` and `mutation`). This is where your business logic lives.

### 3. Type-Safe Client & React Hooks

ZyntraJS automatically generates a type-safe client based on your API router.

-   The `api` object in `src/zyntra.client.ts` is your gateway to the back-end.
-   You can use the provided React hooks (`.useQuery()`, `.useMutation()`) in your components to fetch and mutate data with full type safety.

**Example Client Component Usage:**
```tsx
// src/routes/index.tsx
'use client';
import { api } from '@/zyntra.client';

export function Component() {
  const { data, isLoading } = api.example.health.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome to TanStack Start!</h1>
      <p>API Status: {data?.status}</p>
    </div>
  );
}
```

## Project Structure

The project combines TanStack Start's file-based routing with ZyntraJS's feature-based API structure.

```
src/
├── components/           # Shared, reusable UI components
├── features/             # Business logic, grouped by feature
│   └── example/
│       └── controllers/  # API endpoint definitions
├── routes/               # TanStack Router: file-based routes
│   ├── api/
│   │   └── v1/
│   │       └── $.ts      # ZyntraJS API catch-all entry point
│   ├── __root.tsx        # Root layout component
│   └── index.tsx         # Component for the '/' route
├── services/             # Service initializations (Redis, Prisma, etc.)
├── zyntra.ts            # ZyntraJS core instance
├── zyntra.client.ts     # Auto-generated type-safe API client
├── zyntra.router.ts     # Main API router
└── router.tsx            # TanStack Router setup
```

## Available Scripts

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.

## Further Learning

-   **[ZyntraJS GitHub Repository](https://github.com/matheuszwilk/zyntra-js)**
-   **[ZyntraJS Documentation Wiki](https://zyntrajs.com/docs)**
-   **[TanStack Start Documentation](https://tanstack.com/start/latest/docs/overview)**
-   **[TanStack Router Documentation](https://tanstack.com/router/latest/docs/overview)**

## License

This starter is licensed under the [MIT License](LICENSE).
