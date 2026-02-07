# ZyntraJS Starter: Bun + React Full-Stack App

[![Bun](https://img.shields.io/badge/Bun-1.0%2B-blue.svg)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the ZyntraJS starter for building full-stack, type-safe applications with **Bun** and **React**. This template provides a solid foundation for creating modern, high-performance web applications with an end-to-end type-safe API layer.

## Features

-   **Full-Stack with Bun**: A single, unified runtime for both your server and front-end code.
-   **Server-Side Rendering (SSR)**: Fast initial page loads and improved SEO.
-   **Type-Safe API**: Powered by ZyntraJS, ensuring type safety between your front-end and back-end.
-   **Feature-Based Architecture**: A scalable project structure that organizes code by feature.
-   **Ready-to-Use Services**: Pre-configured examples for:
    -   **Caching**: Integrated with Redis via `@zyntra-js/adapter-redis`.
    -   **Background Jobs**: Asynchronous task processing with BullMQ via `@zyntra-js/adapter-bullmq`.
    -   **Structured Logging**: Production-ready logging.
-   **TailwindCSS**: A utility-first CSS framework for rapid UI development.
-   **Auto-Generated API Client**: A fully-typed client that mirrors your API, providing autocomplete and compile-time error checking.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Bun](https://bun.sh/docs/installation) (v1.0 or higher)
-   A running [Redis](https://redis.io/docs/getting-started/) instance (for caching and background jobs).

## Getting Started

Follow these steps to get your project up and running:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/matheuszwilk/zyntra-js.git
    cd zyntra-js/apps/starter-bun-react-app
    ```

2.  **Install Dependencies**
    ```bash
    bun install
    ```

3.  **Configure Environment Variables**

    Create a `.env` file in the root of this starter (`zyntra-js/apps/starter-bun-react-app/.env`) and add your Redis connection URL:

    ```env
    # .env
    REDIS_URL="redis://127.0.0.1:6379"
    ```

4.  **Run the Development Server**
    ```bash
    bun run dev
    ```
    This command starts the Bun server with hot-reloading enabled. Your application will be available at `http://localhost:3000`.

## How It Works

This starter combines a Bun server, a React front-end, and an ZyntraJS API into a single, cohesive application.

### 1. The Bun Server (`src/index.tsx`)

The `src/index.tsx` file is the main entry point. It uses Bun's native `serve` function to handle incoming requests.

-   Requests to `/api/v1/*` are forwarded to the ZyntraJS API router.
-   All other requests serve the `index.html` file, allowing the React application to handle client-side routing.
-   In development, Hot Module Replacement (HMR) is enabled for a seamless development experience.

### 2. The ZyntraJS API (`src/zyntra.router.ts`)

The back-end API is defined using ZyntraJS.

-   **Initialization (`src/zyntra.ts`)**: This is where the core Zyntra instance is created and configured with adapters for the store (Redis), jobs (BullMQ), logging, and telemetry.
-   **Router (`src/zyntra.router.ts`)**: This file defines all API controllers. The starter includes a `userController` with several actions demonstrating core features.
-   **Controllers (`src/features/user/controllers/user.controller.ts`)**: Controllers group related API actions. The user controller shows how to implement queries (GET) and mutations (POST), interact with the cache, and schedule background jobs.

### 3. The React Front-End (`src/app/`)

The user interface is a standard React application.

-   **Main Component (`src/app/_app.tsx`)**: The root component that sets up providers, including the `ZyntraProvider` for the API client.
-   **Home Page (`src/app/Home.tsx`)**: The main landing page of the starter.
-   **UI Components (`src/components/ui`)**: Pre-built UI components using `shadcn/ui`, styled with TailwindCSS.

### 4. The Type-Safe Client (`src/zyntra.client.ts`)

ZyntraJS automatically generates a type-safe client based on your API router definition.

-   The `api` object in `src/zyntra.client.ts` is your gateway to the back-end.
-   You can call your API endpoints as if they were local functions, with full type-checking and autocompletion for request inputs and response outputs.
-   This eliminates a whole class of bugs and makes front-end development faster and more reliable.

## Project Structure

The project follows a feature-based architecture to promote scalability and separation of concerns.

```
src/
├── app/                  # Core React application components (Pages)
├── components/           # Shared, reusable UI components
├── features/             # Business logic, grouped by feature
│   └── user/
│       ├── controllers/  # API endpoint definitions
│       └── presentation/ # Feature-specific React components/hooks
├── lib/                  # Utility functions
├── services/             # Service initializations (Redis, Prisma, etc.)
├── zyntra.ts            # ZyntraJS core instance
├── zyntra.client.ts     # Auto-generated type-safe API client
├── zyntra.context.ts    # Application context definition
├── zyntra.router.ts     # Main API router
└── index.tsx             # Application entry point (Bun server)
```

## Available Scripts

-   `bun run dev`: Starts the development server with hot-reloading.
-   `bun run start`: Starts the application in production mode.
-   `bun run build`: Builds the application for production deployment.

## Further Learning

To learn more about ZyntraJS and its powerful features, check out the official documentation:

-   **[ZyntraJS GitHub Repository](https://github.com/matheuszwilk/zyntra-js)**
-   **[Official Documentation](https://zyntrajs.com/docs)**
-   **[Core Concepts](https://zyntrajs.com/docs/core-concepts)**
-   **[Client-Side Integration](https://zyntrajs.com/docs/client-side)**

## License

This starter is licensed under the [MIT License](LICENSE).