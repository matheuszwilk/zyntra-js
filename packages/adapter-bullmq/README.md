# @zyntra-js/adapter-bullmq

[![NPM Version](https://img.shields.io/npm/v/@zyntra-js/adapter-bullmq.svg)](https://www.npmjs.com/package/@zyntra-js/adapter-bullmq)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official BullMQ adapter for the **ZyntraJS Queues** system. This package provides a production-ready driver for handling background job processing using Redis.

## Role in the Ecosystem

This adapter acts as a bridge between the abstract `@zyntra-js/core` Queues system and the powerful [BullMQ](https://bullmq.io/) library. It implements the necessary logic to enqueue, schedule, and process jobs, allowing you to add robust background task capabilities to your ZyntraJS application.

## Installation

To use this adapter, you need to install it along with its peer dependencies: `bullmq` and a Redis client like `ioredis`.

```bash
# npm
npm install @zyntra-js/adapter-bullmq bullmq ioredis

# yarn
yarn add @zyntra-js/adapter-bullmq bullmq ioredis

# pnpm
pnpm add @zyntra-js/adapter-bullmq bullmq ioredis

# bun
bun add @zyntra-js/adapter-bullmq bullmq ioredis
```

## Basic Usage

The primary export of this package is the `createBullMQAdapter` factory function. You use this to create a `jobs` instance, which then provides the tools (`.router()`, `.register()`, `.merge()`) to define your background jobs.

### 1. Create the Adapter and a Job Router

First, create an instance of the adapter and use it to define a router for a specific group of jobs.

```typescript
// src/services/jobs.ts
import { createBullMQAdapter } from '@zyntra-js/adapter-bullmq';
import { createRedisStoreAdapter } from '@zyntra-js/adapter-redis'; // Often shares a Redis connection
import { Redis } from 'ioredis';
import { z } from 'zod';

// A single Redis client can be used for both Store and Queues
const redis = new Redis(process.env.REDIS_URL);
const store = createRedisStoreAdapter({ client: redis });

// 1. Create the BullMQ adapter instance
export const jobs = createBullMQAdapter({
  store, // The adapter requires a store for the Redis connection
  autoStartWorker: {
    concurrency: 5,
  },
});

// 2. Define a router for email-related jobs
const emailJobRouter = jobs.router({
  namespace: 'emails',
  jobs: {
    sendWelcome: jobs.register({
      input: z.object({ email: z.string().email() }),
      handler: async ({ payload, context }) => {
        context.logger.info(`Sending welcome email to ${payload.email}`);
        // Your email sending logic here...
        return { sent: true };
      },
    }),
  },
});

// 3. Merge all routers into a single configuration
export const REGISTERED_JOBS = jobs.merge({
  emails: emailJobRouter,
});
```

### 2. Register with the Zyntra Builder

Pass the `REGISTERED_JOBS` object to the `.jobs()` method in your main `zyntra.ts` file.

```typescript
// src/zyntra.ts
import { Zyntra } from '@zyntra-js/core';
import { REGISTERED_JOBS } from './services/jobs';

export const zyntra = Zyntra
  .context<AppContext>()
  .jobs(REGISTERED_JOBS)
  .create();
```

Your background job queue is now configured and ready to use. You can invoke jobs from your actions using `zyntra.jobs.emails.schedule({ task: 'sendWelcome', ... })`.

For more detailed guides, please refer to the **[Official ZyntraJS Wiki](https://zyntrajs.com/docs)**.

## Contributing

Contributions are welcome! Please see the main [CONTRIBUTING.md](/CONTRIBUTING.md) file for details on how to get started.

## License

This package is licensed under the [MIT License](/LICENSE).
