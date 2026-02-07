# @zyntra-js/core

[![NPM Version](https://img.shields.io/npm/v/@zyntra-js/core.svg)](https://www.npmjs.com/package/@zyntra-js/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/matheuszwilk/zyntra-js/main.yml?branch=main)](https://github.com/matheuszwilk/zyntra-js/actions)

The core package for the ZyntraJS framework. It contains the essential building blocks for creating type-safe, modern TypeScript applications.

## Role in the Ecosystem

This package is the heart of the ZyntraJS framework. It provides all the fundamental tools you need to build a robust and scalable API, including:

-   **The Zyntra Builder:** A fluent API for composing your application's features.
-   **Action Factories:** `zyntra.query()` and `zyntra.mutation()` to define your API endpoints.
-   **Controller Factory:** `zyntra.controller()` to group related actions.
-   **Procedure Factory:** `zyntra.procedure()` for creating reusable, type-safe middleware.
-   **The Router:** `zyntra.router()` to assemble all your controllers into a single, executable API handler.
-   **Core Interfaces:** All the essential TypeScript types and interfaces that power the framework's end-to-end type safety.

## Installation

You can install the core package using your favorite package manager:

```bash
# npm
npm install @zyntra-js/core

# yarn
yarn add @zyntra-js/core

# pnpm
pnpm add @zyntra-js/core

# bun
bun add @zyntra-js/core
```

While `@zyntra-js/core` has no required production dependencies, you will likely install `zod` for schema validation, as it is tightly integrated with the framework's type system.

```bash
npm install zod
```

## Basic Usage

Here is a minimal example of how to create a complete ZyntraJS application using only the `core` package.

### 1. Define the Context (`src/zyntra.context.ts`)

Define the shape of your application's global context. This is where you'll provide dependencies like a database connection.

```typescript
// src/zyntra.context.ts
export interface AppContext {
  // In a real app, this would be a database client instance.
  db: {
    findUsers: () => Promise<{ id: number; name: string }[]>;
  };
}
```

### 2. Initialize the Zyntra Builder (`src/zyntra.ts`)

Create the main `zyntra` instance, telling it about your `AppContext`.

```typescript
// src/zyntra.ts
import { Zyntra } from '@zyntra-js/core';
import type { AppContext } from './zyntra.context';

export const zyntra = Zyntra.context<AppContext>().create();
```

### 3. Create a Controller (`src/features/user/user.controller.ts`)

Define your API endpoints using `zyntra.controller()` and `zyntra.query()`.

```typescript
// src/features/user/user.controller.ts
import { zyntra } from '@/zyntra';

export const userController = zyntra.controller({
  path: '/users',
  actions: {
    list: zyntra.query({
      path: '/',
      handler: async ({ context, response }) => {
        const users = await context.db.findUsers();
        return response.success({ users });
      },
    }),
  },
});
```

### 4. Assemble the Router (`src/zyntra.router.ts`)

Register your controller with the main application router.

```typescript
// src/zyntra.router.ts
import { zyntra } from '@/zyntra';
import { userController } from '@/features/user/user.controller';

export const AppRouter = zyntra.router({
  controllers: {
    users: userController,
  },
});
```

### 5. Create an HTTP Server

Finally, use the `AppRouter.handler` to serve HTTP requests. The handler is framework-agnostic and works with any server that supports the standard `Request` and `Response` objects.

```typescript
// src/server.ts
import { AppRouter } from './zyntra.router';
import { createServer } from 'http';

// A simple example with Node.js http server
// In a real app, you would use a framework adapter (e.g., Next.js, Hono)
createServer(async (req, res) => {
  const request = new Request(`http://${req.headers.host}${req.url}`, {
    method: req.method,
    headers: req.headers,
    // body handling would be more complex
  });

  const response = await AppRouter.handler(request);

  res.statusCode = response.status;
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }
  res.end(await response.text());
}).listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

For more detailed guides and advanced concepts, please refer to the **[Official ZyntraJS Wiki](https://zyntrajs.com/docs)**.

## Contributing

Contributions are welcome! Please see the main [CONTRIBUTING.md](/CONTRIBUTING.md) file for details on how to get started.

## License

This package is licensed under the [MIT License](/LICENSE).
