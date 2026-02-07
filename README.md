<div align="center">
  <br />
  <h1>🔥 ZyntraJS</h1>
  <h3>The AI-Native, End-to-End Typesafe Framework</h3>
  <p><em>Built for Humans, Optimized for Agents.</em></p>

  <p align="center">
    <a href="https://www.npmjs.com/package/@zyntra-js/core"><img src="https://img.shields.io/npm/v/@zyntra-js/core.svg?style=flat&color=brightgreen" alt="npm version" /></a>
    <a href="https://github.com/matheuszwilk/zyntra-js/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" /></a>
    <a href="https://zyntrajs.com"><img src="https://img.shields.io/badge/docs-zyntrajs.com-bf40bf.svg" alt="Documentation" /></a>
    <a href="https://github.com/matheuszwilk/zyntra-js/actions"><img src="https://img.shields.io/github/actions/workflow/status/matheuszwilk/zyntra-js/ci.yml?branch=main" alt="Build Status" /></a>
  </p>
</div>

<br />

## ✨ Why ZyntraJS?

ZyntraJS is a modern, full-stack TypeScript framework designed to eliminate the friction between your backend and frontend. It is **AI-Native**, meaning its internal structure and strict typing are optimized to help Code Agents (like me!) understand, refactor, and extend your codebase with zero hallucinations.

- **Typesafety First**: Define your API once, get fully-typed clients everywhere. No code generation, no manual synchronization.
- **Agent Optimized**: Patterns and consistent structures that make AI assistance more reliable and powerful.
- **Superior DX**: Built-in adaptations for Databases (Prisma), Queues (BullMQ), Caching (Redis), and Telemetry (OpenTelemetry).

---

## Quick Start

```bash
# 1. Create a new project
npx @zyntra-js/cli@latest init my-app

# 2. Enter the project
cd my-app

# 3. Start the dev server
npx @zyntra-js/cli dev

# 4. Generate a feature from your Prisma model
npx @zyntra-js/cli generate feature user --schema prisma:User
```

---

## ⚡ Key Features

| Feature | Description |
|---------|-------------|
| **🔒 E2E Typesafety** | TypeScript inference travels from your backend logic directly to your React/Next.js components. |
| **🤖 Agent Ready** | Context-rich architecture allows large language models to write and maintain features efficiently. |
| **🔌 Adapter Pattern** | Swap out core components (Store, Logger, Queue) without rewriting your business logic. |
| **📦 Monorepo First** | Optimized for `turborepo` and `npm workspaces` out of the box. |
| **🔍 OpenTelemetry** | Distributed tracing and metrics baked into the core. |

## 🌟 Code Example

Define APIs that feel like local functions, but run as scalable HTTP endpoints.

```typescript
// features/users/user.controller.ts
import { z } from 'zod';
import { zyntra } from '@/lib/zyntra'; // Your initialized builder

export const userController = zyntra.controller({
  path: '/users',
  actions: {
    // GET /users/:id
    getUser: zyntra.query({
      path: '/:id',
      query: z.object({
        includeProfile: z.boolean().optional()
      }),
      handler: async ({ request, context }) => {
        const { id } = request.params;
        const { includeProfile } = request.query || {};

        return await context.db.user.findUnique({
          where: { id },
          include: { profile: !!includeProfile }
        });
      },
    }),

    // POST /users
    createUser: zyntra.mutation({
      path: '/',
      method: "POST",
      body: z.object({
        name: z.string().min(2),
        email: z.string().email()
      }),
      handler: async ({ request, context }) => {
        const { name, email } = request.body;
        
        // Fully typed DB access
        const newUser = await context.db.user.create({
          data: { name, email }
        });

        // Trigger background jobs easily
        await context.jobs.email.sendWelcome.dispatch({ userId: newUser.id });

        return newUser;
      },
    }),
  }
});
```

**Consume it in your frontend:**

```tsx
// components/UserProfile.tsx
import { api } from '@/lib/api';

export function UserProfile({ id }: { id: string }) {
  // 100% Type-safe hook, inferred from the backend definition
  const { data: user, isLoading } = api.users.getUser.useQuery({
    params: { id },
    query: { includeProfile: true }
  });

  if (isLoading) return <Skeleton />;
  
  return (
    <div className="card">
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

## 🛠️ Architecture

ZyntraJS uses a modular architecture:

- **@zyntra-js/core**: The lightweight runtime and router.
- **@zyntra-js/cli**: Scaffolding and dev tools.
- **Adapters**:
  - `@zyntra-js/adapter-redis`
  - `@zyntra-js/adapter-bullmq`
  - `@zyntra-js/adapter-opentelemetry`


---

## Table of Contents

- [Quick Start](#quick-start)
- [Commands Overview](#commands-overview)
- [zyntra init](#zyntra-init)
- [zyntra dev](#zyntra-dev)
- [zyntra generate feature](#zyntra-generate-feature) (Auto CRUD Generation)
- [zyntra generate schema](#zyntra-generate-schema)
- [zyntra generate docs](#zyntra-generate-docs)
- [Generated Code Structure](#generated-code-structure)
- [Working with Relationships](#working-with-relationships)
- [Global Options](#global-options)


## Commands Overview

| Command | Description |
|---------|-------------|
| `zyntra init [name]` | Create a new ZyntraJS project with interactive setup |
| `zyntra dev` | Start the development server with hot-reload |
| `zyntra generate feature [name]` | **Scaffold a full CRUD feature from Prisma models** |
| `zyntra generate schema` | Generate type-safe client schema from your router |
| `zyntra generate docs` | Generate OpenAPI specification and interactive playground |

---

## zyntra init

Scaffolds a new, production-ready ZyntraJS project from scratch with an interactive setup wizard.

```bash
npx @zyntra-js/cli@latest init my-app
```

### Options

| Option | Description |
|--------|-------------|
| `--force` | Skip confirmation prompts and overwrite existing files |
| `--pm, --package-manager <manager>` | Package manager: `npm`, `yarn`, `pnpm`, `bun` |
| `--template <template>` | Use a specific starter (e.g., `starter-nextjs`, `starter-express-rest-api`) |
| `-f, --framework <framework>` | Target framework: `nextjs`, `vite`, `nuxt`, `sveltekit`, `remix`, `astro`, `express`, `tanstack-start` |
| `--features <features>` | Comma-separated features: `store`, `jobs`, `mcp`, `logging`, `telemetry` |
| `--database <database>` | Database provider: `none`, `postgresql`, `mysql`, `sqlite` |
| `--orm <orm>` | ORM provider: `prisma`, `drizzle` |
| `--no-git` | Skip git repository initialization |
| `--no-install` | Skip automatic dependency installation |
| `--no-docker` | Skip Docker Compose setup |

### Examples

```bash
# Interactive mode (recommended)
npx @zyntra-js/cli@latest init my-app

# Fully automated setup
npx @zyntra-js/cli@latest init my-app \
  --framework nextjs \
  --database postgresql \
  --orm prisma \
  --features store,jobs,logging \
  --pm bun
```

For more details, see the **[zyntra init documentation](https://zyntrajs.com/docs/cli-and-tooling/zyntra-init)**.

---

## zyntra dev

Starts the development server with hot-reload, framework integration, and an interactive dashboard.

```bash
npx @zyntra-js/cli dev
```

### Options

| Option | Description |
|--------|-------------|
| `--framework <type>` | Framework type: `nextjs`, `vite`, `nuxt`, `sveltekit`, `remix`, `astro`, `express`, `tanstack-start`, `generic` |
| `--output <dir>` | Output directory for generated client files (default: `src/`) |
| `--port <number>` | Port for the dev server (default: `3000`) |
| `--cmd <command>` | Custom command to start dev server |
| `--no-framework` | Disable framework dev server (Zyntra only) |
| `--no-interactive` | Disable interactive mode |
| `--docs-output <dir>` | Output directory for OpenAPI docs (default: `./src/docs`) |

### Examples

```bash
# Auto-detect framework and start in interactive mode
npx @zyntra-js/cli dev

# Specify framework and port
npx @zyntra-js/cli dev --framework nextjs --port 4000

# Zyntra-only mode (no framework dev server)
npx @zyntra-js/cli dev --no-framework
```

For more details, see the **[zyntra dev documentation](https://zyntrajs.com/docs/cli-and-tooling/zyntra-dev)**.

---

## zyntra generate feature

**The most powerful command in the CLI.** Automatically generates a complete CRUD feature from your Prisma schema — including controllers, procedures, repositories, and interfaces — all following production-ready patterns with full JSDoc documentation.

```bash
npx @zyntra-js/cli generate feature [name] --schema prisma:<ModelName>
```

### Options

| Option | Description |
|--------|-------------|
| `[name]` | Feature name (e.g., `user`, `product`). If omitted, runs in interactive mode |
| `--schema <value>` | Generate from a schema provider (e.g., `prisma:User`, `prisma:Post`) |

### Usage Modes

#### Interactive Mode (recommended for first use)

```bash
npx @zyntra-js/cli generate feature
```

The interactive wizard will:
1. Ask for the feature name
2. Detect your Prisma schema automatically
3. List all available models for you to choose
4. Generate the complete CRUD code

#### Direct Mode

```bash
# Generate a "product" feature from the Prisma "Product" model
npx @zyntra-js/cli generate feature product --schema prisma:Product

# Generate a "user" feature from the Prisma "User" model
npx @zyntra-js/cli generate feature user --schema prisma:User

# Generate an empty feature (no Prisma)
npx @zyntra-js/cli generate feature notification
```

### What Gets Generated

When you run `generate feature product --schema prisma:Product`, the CLI creates:

```
src/features/product/
├── controllers/
│   └── product.controller.ts     # REST endpoints with JSDoc + error handling
├── procedures/
│   └── product.procedure.ts      # Business logic layer with validation
├── repositories/
│   └── product.repository.ts     # Data access class with PrismaClient
├── product.interfaces.ts         # Zod schemas + TypeScript types
└── index.ts                      # Barrel exports
```

### Example: From Prisma Schema to Full API

Given this Prisma model:

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  inStock     Boolean  @default(true)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Running:

```bash
npx @zyntra-js/cli generate feature product --schema prisma:Product
```

Generates the following files:

#### `product.interfaces.ts`

```typescript
import { z } from "zod";

/**
 * @description Zod schema for creating a new Product.
 */
export const CreateProductBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    categoryId: z.string(),
});

/**
 * @description Zod schema for updating an existing Product.
 */
export const UpdateProductBodySchema = z.object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    price: z.number().optional(),
    categoryId: z.string().optional(),
});

export type CreateProductBody = z.infer<typeof CreateProductBodySchema>;
export type UpdateProductBody = z.infer<typeof UpdateProductBodySchema>;
```

> **Note:** The `id`, `createdAt`, `updatedAt` fields are automatically excluded (auto-generated). The `category` relation field is excluded — only the scalar `categoryId` foreign key is included.

#### `repositories/product.repository.ts`

```typescript
import { PrismaClient, Product } from "@prisma/client";
import { CreateProductBody, UpdateProductBody } from "../product.interfaces";

/**
 * @class ProductRepository
 * @description Centralizes all database operations for the Product entity using Prisma.
 */
export class ProductRepository {
    private db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    async list(): Promise<Product[]> { /* ... */ }
    async getById(id: string): Promise<Product | null> { /* ... */ }
    async create(data: CreateProductBody): Promise<Product> { /* ... */ }
    async update(id: string, data: UpdateProductBody): Promise<Product> { /* ... */ }
    async delete(id: string): Promise<Product> { /* ... */ }
}
```

#### `procedures/product.procedure.ts`

```typescript
/**
 * @procedure ProductProcedure
 * @description Procedure for managing product operations and data processing.
 *
 * @example
 * ```typescript
 * const records = await context.product.findMany()
 * const record = await context.product.findUnique("some-id")
 * ```
 */
export const productProcedure = zyntra.procedure({
    name: 'ProductProcedure',
    handler: (_, { context }) => {
        return {
            product: {
                findMany: async () => { /* ... */ },
                findUnique: async (id) => { /* ... */ },
                create: async (data) => { /* ... */ },
                update: async (id, data) => {
                    // Business Rule: Check if product exists before updating.
                    const productExists = await context.database.product.findUnique({
                        where: { id },
                    });
                    if (!productExists) {
                        throw new Error('Product not found');
                    }
                    // ...
                },
                delete: async (id) => { /* ... */ },
            },
        };
    },
});
```

#### `controllers/product.controller.ts`

```typescript
/**
 * @const productController
 * @description
 * Controller for managing product-related operations, including listing, creating,
 * updating, and deleting products.
 */
export const productController = zyntra.controller({
    name: "product",
    path: "/product",
    actions: {
        list:    zyntra.query({ /* GET /product */ }),
        getById: zyntra.query({ /* GET /product/:id */ }),
        create:  zyntra.mutation({ /* POST /product */ }),
        update:  zyntra.mutation({ /* PUT /product/:id with try/catch */ }),
        delete:  zyntra.mutation({ /* DELETE /product/:id with try/catch */ }),
    },
});
```

### After Generating

Register the controller in your router:

```typescript
// src/zyntra.ts
import { productController } from "./features/product";

const router = zyntra
  .router()
  .controller(productController);
```

---

## Working with Relationships

The CLI correctly handles Prisma relationships when generating code:

### What Gets Included

- **Scalar fields** (`String`, `Int`, `Boolean`, etc.) — included in schemas
- **Foreign key fields** (`authorId`, `categoryId`) — included in schemas as normal fields
- **Auto-generated fields** (`id`, `createdAt`, `updatedAt`) — excluded from Create/Update schemas

### What Gets Excluded

- **Relation object fields** (`author User @relation(...)`) — excluded from schemas
- **Relation array fields** (`posts Post[]`) — excluded from schemas

### Example

```prisma
model Post {
  id        String   @id @default(cuid())   // excluded (auto-generated)
  title     String                           // included
  content   String?                          // included (nullable)
  author    User     @relation(...)          // excluded (relation)
  authorId  String                           // included (FK scalar)
  tags      Tag[]                            // excluded (relation array)
  createdAt DateTime @default(now())         // excluded (auto-generated)
}
```

Generated `CreatePostBodySchema`:
```typescript
z.object({
    title: z.string(),
    content: z.string().nullable(),
    authorId: z.string(),
})
```

---

## zyntra generate schema

Generates the type-safe client schema from your Zyntra router for CI/CD or manual builds.

```bash
npx @zyntra-js/cli generate schema
```

### Options

| Option | Description |
|--------|-------------|
| `--framework <type>` | Framework type |
| `--output <dir>` | Output directory (default: `src/`) |
| `--watch` | Watch for changes and regenerate automatically |
| `--docs` | Enable automatic OpenAPI documentation generation |
| `--docs-output <dir>` | Output directory for OpenAPI docs (default: `./src/docs`) |

### Examples

```bash
# One-time schema generation
npx @zyntra-js/cli generate schema

# Watch mode for development
npx @zyntra-js/cli generate schema --watch

# With OpenAPI docs
npx @zyntra-js/cli generate schema --watch --docs
```

---

## zyntra generate docs

Generates an OpenAPI 3.0 specification and optionally an interactive API playground powered by Scalar UI.

```bash
npx @zyntra-js/cli generate docs
```

### Options

| Option | Description |
|--------|-------------|
| `--output <dir>` | Output directory for the OpenAPI spec (default: `./src`) |
| `--ui` | Generate a self-contained HTML file with interactive Scalar UI |

### Examples

```bash
# Generate OpenAPI JSON spec
npx @zyntra-js/cli generate docs

# Generate spec + interactive playground
npx @zyntra-js/cli generate docs --ui

# Custom output directory
npx @zyntra-js/cli generate docs --ui --output ./public/docs
```

### Generated Files

| File | Description |
|------|-------------|
| `docs/openapi.json` | OpenAPI 3.0.0 specification |
| `docs/index.html` | Interactive Scalar UI playground (with `--ui`) |

---

## Generated Code Structure

Every feature generated with `--schema` follows the same production-ready pattern used across all ZyntraJS starters:

```
src/features/{feature}/
│
├── {feature}.interfaces.ts          # Zod validation schemas + TypeScript types
│   ├── Create{Model}BodySchema      #   Fields for creation (excludes auto-generated)
│   ├── Update{Model}BodySchema      #   All fields optional for partial updates
│   ├── Create{Model}Body            #   TypeScript type inferred from Zod
│   └── Update{Model}Body            #   TypeScript type inferred from Zod
│
├── repositories/
│   └── {feature}.repository.ts      # Data access layer (class-based)
│       └── {Model}Repository        #   PrismaClient injection, CRUD methods
│
├── procedures/
│   └── {feature}.procedure.ts       # Business logic layer
│       └── {model}Procedure         #   Context injection, validation, error handling
│
├── controllers/
│   └── {feature}.controller.ts      # HTTP endpoints
│       └── {model}Controller        #   REST CRUD with proper response codes
│
└── index.ts                         # Barrel exports for clean imports
```

### Architecture Flow

```
HTTP Request → Controller → Procedure (business logic + validation) → Prisma Database
                                ↑
                          Repository (data access class, available for direct use)
```

### Code Quality Features

All generated code includes:

- **Full JSDoc documentation** — `@description`, `@param`, `@returns`, `@throws` on every method
- **Inline comments** — `// Business Logic:`, `// Business Rule:`, `// Observation:`, `// Response:`
- **Error handling** — `try/catch` on update/delete controllers, existence validation in procedures
- **Type safety** — Zod schemas for request validation, Prisma types for database operations
- **Consistent patterns** — Same structure used across all 6 official ZyntraJS starters

---

## Global Options

| Option | Description |
|--------|-------------|
| `--debug` | Enable debug mode for detailed logging |
| `--version` | Show CLI version |
| `--help` | Show help for any command |

```bash
# Enable debug logging for any command
npx @zyntra-js/cli generate feature --debug

# Show help
npx @zyntra-js/cli --help
npx @zyntra-js/cli generate feature --help
```

## 🤝 Community & Contributing

We love contributions! Whether you're a human or an AI agent, you are welcome here.

- **[Documentation](https://zyntrajs.com)**
- **[Contributing Guide](CONTRIBUTING.md)**
- **[Open Issues](https://github.com/matheuszwilk/zyntra-js/issues)**

## 📄 License

MIT © [ZyntraJS Team](https://github.com/matheuszwilk/zyntra-js)