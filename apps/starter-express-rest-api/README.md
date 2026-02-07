# ZyntraJS Starter: Express REST API

[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-blue.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the ZyntraJS starter for building high-performance, type-safe REST APIs with **Express.js** and **Node.js**. This template provides a robust and scalable foundation for creating modern back-end services.

## Features

-   **Battle-Tested Express Server**: Built on Express.js, the most popular web framework for Node.js.
-   **Type-Safe from the Ground Up**: Powered by ZyntraJS, ensuring a strongly-typed codebase that is easy to maintain and refactor.
-   **Feature-Based Architecture**: A scalable project structure that organizes code by business domain, not technical layers.
-   **Ready-to-Use Services**: Pre-configured examples for:
    -   **Caching**: Integrated with Redis via `@zyntra-js/adapter-redis`.
    -   **Background Jobs**: Asynchronous task processing with BullMQ via `@zyntra-js/adapter-bullmq`.
    -   **Structured Logging**: Production-ready, context-aware logging.
-   **Database Ready**: Comes with Prisma set up for seamless database integration.
-   **Seamless Integration**: Uses the `@zyntra-js/core/adapters` to cleanly connect the ZyntraJS router to Express.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en) (v18 or higher)
-   [npm](https://www.npmjs.com/) or a compatible package manager
-   A running [Redis](https://redis.io/docs/getting-started/) instance (for caching and background jobs).
-   A PostgreSQL database (or you can configure Prisma for a different one).

## Getting Started

Follow these steps to get your project up and running:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/matheuszwilk/zyntra-js.git
    cd zyntra-js/apps/starter-express-rest-api
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root of this starter (`zyntra-js/apps/starter-express-rest-api/.env`) and add your database and Redis connection URLs:

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
    This command starts the Express server using `tsx` for hot-reloading. Your API will be available at `http://localhost:3000/api/v1`.

## How It Works

This starter uses Express to handle HTTP requests and forwards them to the ZyntraJS router.

### 1. The Express Server (`src/index.ts`)

The `src/index.ts` file is the main entry point. It creates an Express app and uses the `expressAdapter` from ZyntraJS. This adapter is a middleware function that seamlessly connects ZyntraJS's standard `Request`/`Response`-based handler to Express's `(req, res, next)`-based middleware chain.

### 2. The ZyntraJS API Layer

The back-end API logic is defined using ZyntraJS.

-   **Initialization (`src/zyntra.ts`)**: This is where the core Zyntra instance is created and configured with adapters for the store (Redis), jobs (BullMQ), logging, and telemetry.
-   **Router (`src/zyntra.router.ts`)**: This file defines all API controllers. The starter includes a `userController` with several actions demonstrating core features.
-   **Controllers (`src/features/user/controllers/user.controller.ts`)**: Controllers group related API actions. The user controller shows how to implement queries (GET) and mutations (POST), interact with the cache, and schedule background jobs.
-   **Services (`src/services/`)**: This directory contains the initialization logic for external services like the Redis client, Prisma client, and the ZyntraJS adapters that use them.

## Project Structure

The project follows a feature-based architecture to promote scalability and separation of concerns.

```
src/
├── features/             # Business logic, grouped by feature
│   └── user/
│       └── controllers/  # API endpoint definitions
├── services/             # Service initializations (Redis, Prisma, etc.)
├── zyntra.ts            # ZyntraJS core instance
├── zyntra.client.ts     # Auto-generated type-safe API client (for consumers)
├── zyntra.context.ts    # Application context definition
├── zyntra.router.ts     # Main API router
└── index.ts              # Application entry point (Express server)
```

## Example API Endpoints

This starter comes with a pre-built `user` controller to demonstrate key features.

-   **Health Check**
    ```bash
    curl http://localhost:3000/api/v1/user/
    ```

-   **Cache Demonstration**
    ```bash
    # First request (live data)
    curl http://localhost:3000/api/v1/user/cache/my-key
    # Second request (cached data)
    curl http://localhost:3000/api/v1/user/cache/my-key
    ```

-   **Schedule a Background Job**
    ```bash
    curl -X POST -H "Content-Type: application/json" \
      -d '{"message": "Hello from curl"}' \
      http://localhost:3000/api/v1/user/schedule-job
    ```

-   **List Jobs**
    ```bash
    curl http://localhost:3000/api/v1/user/jobs
    ```

## Available Scripts

-   `npm run dev`: Starts the development server with hot-reloading via `tsx`.
-   `npm run build`: Compiles the TypeScript code to JavaScript in the `dist` directory.
-   `npm run start`: Starts the application from the compiled code for production.

## Further Learning

To learn more about ZyntraJS and its powerful features, check out the official documentation:

-   **[ZyntraJS GitHub Repository](https://github.com/matheuszwilk/zyntra-js)**
-   **[Official Documentation](https://zyntrajs.com/docs)**
-   **[Core Concepts](https://zyntrajs.com/docs/core-concepts)**

## License

This starter is licensed under the [MIT License](LICENSE).