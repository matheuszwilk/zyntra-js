import type {
  ProjectSetupConfig,
  TemplateFile,
} from './types'
import { getEnvironmentVariables, getDockerServices, DATABASE_CONFIGS } from './features'
import type { SupportedFramework } from '../framework'

/**
 * Generate main zyntra.ts file with proper imports and configuration
 */
export function generateZyntraRouter(config: ProjectSetupConfig): TemplateFile {
  const { features } = config

  let imports = [`import { Zyntra } from '@zyntra-js/core'`]
  let serviceImports: string[] = []

  // Add context import
  imports.push('import { createZyntraAppContext } from "./zyntra.context"')

  // Add feature service imports based on enabled features
  if (features.store) {
    serviceImports.push('import { store } from "@/services/store"')
  }

  if (features.jobs) {
    serviceImports.push('import { REGISTERED_JOBS } from "@/services/jobs"')
  }

  if (features.logging) {
    serviceImports.push('import { logger } from "@/services/logger"')
  }

  // Telemetry service import
  if (features.telemetry) {
    serviceImports.push('import { telemetry } from "@/services/telemetry"')
  }

  const allImports = [...imports, ...serviceImports].join('\n')

  // Build configuration chain
  let configChain = ['export const zyntra = Zyntra', '  .context(createZyntraAppContext)']

  if (features.store) configChain.push('  .store(store)')
  if (features.jobs) configChain.push('  .jobs(REGISTERED_JOBS)')
  if (features.logging) configChain.push('  .logger(logger)')
  if (features.telemetry) configChain.push('  .telemetry(telemetry)')

  configChain.push('  .create()')

  const content = `${allImports}

/**
 * @description Initialize the Zyntra.js
 * @see https://github.com/matheuszwilk/zyntra-js
 */
${configChain.join('\n')}
`

  return {
    path: 'src/zyntra.ts',
    content
  }
}

/**
 * Generate zyntra.context.ts file with proper type definitions
 */
export function generateZyntraContext(config: ProjectSetupConfig): TemplateFile {
  const { database } = config

  let serviceImports: string[] = []
  let contextProperties: string[] = []

  if (database.provider !== 'none') {
    serviceImports.push('import { database } from "@/services/database"')
    contextProperties.push('    // database,')
  }

  const allImports = serviceImports.join('\n')

  const content = `${allImports}

/**
 * @description Create the context of the Zyntra.js application
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const createZyntraAppContext = () => {
  return {
${contextProperties.join('\n')}
  }
}

/**
 * @description The context of the Zyntra.js application
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export type ZyntraAppContext = Awaited<ReturnType<typeof createZyntraAppContext>>
`

  return {
    path: 'src/zyntra.context.ts',
    content
  }
}

/**
 * Generate user controller following the new feature structure
 */
export function generateUserController(config: ProjectSetupConfig): TemplateFile {
  const { features } = config

  let imports = `import { zyntra } from '@/zyntra'
import { CreateUserInputSchema, UpdateUserInputSchema } from '../user.interfaces'`

  let userActions = `    list: zyntra.query({
      name: 'list',
      description: 'List all users',
      path: '/',
      handler: async ({ response${features.logging ? ', context' : ''} }) => {
        ${features.logging ? 'context.logger.info(\'Listing users\')' : '// TODO: Replace with database query'}
        return response.success([
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        ])
      },
    }),

    getById: zyntra.query({
      name: 'getById',
      description: 'Get user by ID',
      path: '/:id' as const,
      handler: async ({ request, response }) => {
        const { id } = request.params

        // TODO: Replace with database query
        return response.success({
          id,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
        })
      },
    }),

    create: zyntra.mutation({
      name: 'create',
      description: 'Create a new user',
      path: '/',
      method: 'POST',
      body: CreateUserInputSchema,
      handler: async ({ request, response${features.logging ? ', context' : ''} }) => {
        const { name, email, role } = request.body

        ${features.logging ? 'context.logger.info(\'Creating user\', { name, email })' : '// TODO: Replace with database insert'}
        return response.created({
          id: crypto.randomUUID(),
          name,
          email,
          role,
        })
      },
    }),

    update: zyntra.mutation({
      name: 'update',
      description: 'Update an existing user',
      path: '/:id' as const,
      method: 'PUT',
      body: UpdateUserInputSchema,
      handler: async ({ request, response }) => {
        const { id } = request.params
        const updates = request.body

        // TODO: Replace with database update
        return response.success({
          id,
          ...updates,
        })
      },
    }),

    delete: zyntra.mutation({
      name: 'delete',
      description: 'Delete a user',
      path: '/:id' as const,
      method: 'DELETE',
      handler: async ({ request, response }) => {
        const { id } = request.params

        // TODO: Replace with database delete
        return response.success({ id, deleted: true })
      },
    })`

  const content = `${imports}

/**
 * @description User controller demonstrating Zyntra.js features
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const userController = zyntra.controller({
  name: 'User',
  description: 'User management endpoints',
  path: '/users',
  actions: {
${userActions}
  },
})
`

  return {
    path: 'src/features/user/controllers/user.controller.ts',
    content
  }
}

/**
 * Generate main router configuration
 */
export function generateMainRouter(config: ProjectSetupConfig): TemplateFile {
  const content = `import { zyntra } from '@/zyntra'
import { userController } from '@/features/user'

/**
 * @description Main application router configuration
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const AppRouter = zyntra.router({
  controllers: {
    user: userController
  }
})

export type AppRouterType = typeof AppRouter
`

  return {
    path: 'src/zyntra.router.ts',
    content
  }
}

/**
 * Generate feature index file
 */
export function generateFeatureIndex(config: ProjectSetupConfig): TemplateFile {
  const content = `export * from './controllers/user.controller'
export * from './user.interfaces'
`

  return {
    path: 'src/features/user/index.ts',
    content
  }
}

/**
 * Generates service files based on enabled features and database provider.
 *
 * @param config - The project setup configuration.
 * @returns An array of TemplateFile objects representing service files.
 *
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export function generateServiceFiles(config: ProjectSetupConfig): TemplateFile[] {
  const { features, database } = config
  const files: TemplateFile[] = []

  files.push({
   path: 'src/app/api/v1/[[...all]]/route.ts',
   content: `import { AppRouter } from '@/zyntra.router'
import { nextRouteHandlerAdapter } from '@zyntra-js/core/adapters'

export const { GET, POST, PUT, DELETE } = nextRouteHandlerAdapter(AppRouter)
`
  })

  // Initialize Redis service if store or jobs feature is enabled
  if (features.store || features.jobs) {
    files.push({
      path: 'src/services/redis.ts',
      content: `import { Redis } from 'ioredis'

/**
  * Redis client instance for caching, session storage, and pub/sub.
  *
  * @remarks
  * Used for caching, session management, and real-time messaging.
  *
  * @see https://github.com/luin/ioredis
  */
export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
})
`
    })
  }

  // Store service (requires Redis)
  if (features.store) {
    files.push({
      path: 'src/services/store.ts',
      content: `import { createRedisStoreAdapter } from '@zyntra-js/adapter-redis'
import { redis } from './redis'

/**
  * Store adapter for data persistence.
  *
  * @remarks
  * Provides a unified interface for data storage operations using Redis.
  *
  * @see https://github.com/matheuszwilk/zyntra-js/tree/main/packages/adapter-redis
  */
export const store = createRedisStoreAdapter(redis)
`
    })
  }

  // Jobs service (requires Redis)
  if (features.jobs) {
    files.push({
      path: 'src/services/jobs.ts',
      content: `import { store } from './store'
import { createBullMQAdapter } from '@zyntra-js/adapter-bullmq'
import { z } from 'zod'

/**
  * Job queue adapter for background processing.
  *
  * @remarks
  * Handles asynchronous job processing with BullMQ.
  *
  * @see https://github.com/matheuszwilk/zyntra-js/tree/main/packages/adapter-bullmq
  */
export const jobs = createBullMQAdapter({
  store,
  autoStartWorker: {
    concurrency: 1,
    queues: ['*']
  }
})

export const REGISTERED_JOBS = jobs.merge({
  system: jobs.router({
    jobs: {
      sampleJob: jobs.register({
        name: 'sampleJob',
        input: z.object({
          message: z.string()
        }),
        handler: async ({ input }) => {
          console.log(input.message)
        }
      })
    }
  })
})
`
    })
  }

  // Logger service
  if (features.logging) {
    files.push({
      path: 'src/services/logger.ts',
      content: `import { createConsoleLogger, ZyntraLogLevel } from '@zyntra-js/core'

/**
  * Logger instance for application logging.
  *
  * @remarks
  * Provides structured logging with configurable log levels.
  *
  * @see https://github.com/matheuszwilk/zyntra-js/tree/main/packages/core
  */
export const logger = createConsoleLogger({
  level: ZyntraLogLevel.INFO,
  showTimestamp: true,
})
`
    })
  }

  // Database service (Prisma)
  if (database.provider !== 'none') {
    files.push({
      path: 'src/services/database.ts',
      content: `import { PrismaClient } from '@prisma/client'

/**
 * Prisma client instance for database operations.
 *
 * @remarks
 * Provides type-safe database access with Prisma ORM.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */
export const database = new PrismaClient()
`
    })
  }

  // Telemetry service
  if (features.telemetry) {
    files.push({
      path: 'src/services/telemetry.ts',
      content: `import { createConsoleTelemetryAdapter } from '@zyntra-js/core/adapters'
      import { store } from './store'

      /**
       * Telemetry service for tracking requests and errors.
       *
       * @remarks
       * Provides telemetry tracking with configurable options.
       *
       * @see https://github.com/matheuszwilk/zyntra-js/tree/main/packages/core
       */
      export const telemetry = createConsoleTelemetryAdapter({
        serviceName: 'my-zyntra-app',
        enableEvents: process.env.ZYNTRA_TELEMETRY_ENABLE_EVENTS === 'true',
        enableMetrics: process.env.ZYNTRA_TELEMETRY_ENABLE_METRICS === 'true',
        enableTracing: process.env.ZYNTRA_TELEMETRY_ENABLE_TRACING === 'true',
      }, {
        enableCliIntegration: process.env.ZYNTRA_TELEMETRY_ENABLE_CLI_INTEGRATION === 'true',
        store: store
      })
`
    })
  }

  // MCP service

  // MCP service
  if (features.mcp) {
    files.push({
      path: 'src/app/api/mcp/[transport].ts',
      content: `import { createMcpAdapter } from '@zyntra-js/adapter-mcp'
import { AppRouter } from '@/zyntra.router'

/**
 * MCP server instance for exposing API as a MCP server.
 *
 * @see https://github.com/matheuszwilk/zyntra-js/tree/main/packages/adapter-mcp
 */
export default createMcpAdapter(AppRouter, {
  serverInfo: {
    name: 'Zyntra.js MCP Server',
    version: '1.0.0',
  },
  adapter: {
    redis: {
      url: process.env.REDIS_URL!,
      maxRetriesPerRequest: null,
    },
    basePath: process.env.ZYNTRA_MCP_SERVER_BASE_PATH || '/api/mcp',
    maxDuration: process.env.ZYNTRA_MCP_SERVER_TIMEOUT || 60,
  },
})
`
    })
  }

  return files
}

/**
 * Generate client file for frontend usage
 */
export function generateZyntraClient(config: ProjectSetupConfig): TemplateFile {
  const content = `import { createZyntraClient, useZyntraQueryClient } from '@zyntra-js/core/client'
import type { AppRouterType } from './zyntra.router'

/**
  * Type-safe API client generated from your Zyntra router
  *
  * Usage in Server Components:
  * const users = await api.users.list.query()
  *
  * Usage in Client Components:
  * const { data } = api.users.list.useQuery()
  */
export const api = createZyntraClient<AppRouterType>({
  baseURL: 'http://localhost:3000',
  basePath: '/api/v1/',
  router: () => {
    if (typeof window === 'undefined') {
      return require('./zyntra.router').AppRouter
    }

    return require('./zyntra.schema').AppRouterSchema
  },
})

/**
  * Type-safe API client generated from your Zyntra router
  *
  * Usage in Server Components:
  * const users = await api.users.list.query()
  *
  * Usage in Client Components:
  * const { data } = api.users.list.useQuery()
  */
export type ApiClient = typeof api

/**
  * Type-safe query client generated from your Zyntra router
  *
  * Usage in Client Components:
  * const { invalidate } = useQueryClient()
  */
export const useQueryClient = useZyntraQueryClient<AppRouterType>;
`

  return {
    path: 'src/zyntra.client.ts',
    content
  }
}

/**
 * Generate user interfaces file with Zod schemas
 */
export function generateUserInterfaces(): TemplateFile {
  const content = `import { z } from 'zod'

/**
 * @description Zod schemas and TypeScript types for the user feature.
 */

export const CreateUserInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['user', 'admin']).default('user'),
})

export const UpdateUserInputSchema = CreateUserInputSchema.partial()

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>
`

  return {
    path: 'src/features/user/user.interfaces.ts',
    content
  }
}

/**
 * Generate package.json
 */
export function generatePackageJson(config: ProjectSetupConfig, dependencies: string[], devDependencies: string[]): TemplateFile {
  const scripts: Record<string, string> = {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }

  // Add database scripts if using Prisma
  if (config.database.provider !== 'none') {
    scripts["db:generate"] = "prisma generate"
    scripts["db:push"] = "prisma db push"
    scripts["db:studio"] = "prisma studio"
    scripts["db:migrate"] = "prisma migrate dev"
  }

  // Framework-specific script adjustments
  switch (config.framework) {
    case 'vite':
      scripts.dev = "vite"
      scripts.build = "vite build"
      scripts.start = "vite preview"
      break
    case 'nuxt':
      scripts.dev = "nuxt dev"
      scripts.build = "nuxt build"
      scripts.start = "nuxt start"
      break
    case 'sveltekit':
      scripts.dev = "vite dev"
      scripts.build = "svelte-kit build"
      scripts.start = "node build"
      break
    case 'remix':
      scripts.dev = "remix dev"
      scripts.build = "remix build"
      scripts.start = "remix-serve build"
      break
    case 'astro':
      scripts.dev = "astro dev"
      scripts.build = "astro build"
      scripts.start = "astro preview"
      break
    case 'express':
      scripts.dev = "tsx watch src/server.ts"
      scripts.build = "tsc"
      scripts.start = "node dist/server.js"
      break
  }

  const deps = dependencies.reduce((acc, dep) => {
    const [name, version] = dep.split('@')
    acc[name] = version
    return acc
  }, {} as Record<string, string>)

  const devDeps = devDependencies.reduce((acc, dep) => {
    const [name, version] = dep.split('@')
    acc[name] = version
    return acc
  }, {} as Record<string, string>)

  const packageJson = {
    name: config.projectName,
    version: "0.1.0",
    private: true,
    scripts,
    dependencies: deps,
    devDependencies: devDeps
  }

  return {
    path: 'package.json',
    content: JSON.stringify(packageJson, null, 2)
  }
}

/**
 * Generate TypeScript configuration
 */
export function generateTsConfig(framework: SupportedFramework): TemplateFile {
  let compilerOptions: any = {
    target: "ES2020",
    lib: ["ES2020", "DOM"],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "node",
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "preserve",
    incremental: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"]
    }
  }

  // Framework-specific adjustments
  switch (framework) {
    case 'nextjs':
      compilerOptions.plugins = [{ name: "next" }]
      break
    case 'vite':
      compilerOptions.types = ["vite/client"]
      break
    case 'nuxt':
      compilerOptions.paths["~/*"] = ["./src/*"]
      break
  }

  const tsConfig = {
    compilerOptions,
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"]
  }

  return {
    path: 'tsconfig.json',
    content: JSON.stringify(tsConfig, null, 2)
  }
}

/**
 * Generate environment variables file
 */
export function generateEnvFile(config: ProjectSetupConfig): TemplateFile {
  const envVars = getEnvironmentVariables(
    Object.entries(config.features).filter(([_, enabled]) => enabled).map(([key, _]) => key),
    config.database.provider,
    config.projectName
  )

  let content = `# Environment variables for ${config.projectName}
# Generated by @zyntra-js/cli

`

  envVars.forEach(envVar => {
    if (envVar.description) {
      content += `# ${envVar.description}\n`
    }
    content += `${envVar.key}=${envVar.value}\n\n`
  })

  return {
    path: '.env.example',
    content
  }
}

/**
 * Generate Docker Compose configuration
 */
export function generateDockerCompose(config: ProjectSetupConfig): TemplateFile | null {
  if (!config.dockerCompose) return null

  const services = getDockerServices(
    Object.entries(config.features).filter(([_, enabled]) => enabled).map(([key, _]) => key),
    config.database.provider
  )

  if (services.length === 0) return null

  const dockerCompose = {
    version: '3.8',
    services: services.reduce((acc, service) => {
      acc[service.name] = {
        image: service.image,
        ports: service.ports,
        environment: service.environment,
        volumes: service.volumes
      }
      return acc
    }, {} as any),
    volumes: services.some(s => s.volumes) ?
      services.reduce((acc, service) => {
        service.volumes?.forEach(volume => {
          const volumeName = volume.split(':')[0]
          if (!volumeName.startsWith('/')) {
            acc[volumeName] = {}
          }
        })
        return acc
      }, {} as any) : undefined
  }

  return {
    path: 'docker-compose.yml',
    content: `# Docker Compose for ${config.projectName}
# Generated by @zyntra-js/cli

version: '3.8'

services:
${Object.entries(dockerCompose.services).map(([name, service]: [string, any]) => `
  ${name}:
    image: ${service.image}
${service.ports ? `    ports:\n${service.ports.map((port: string) => `      - "${port}"`).join('\n')}` : ''}
${service.environment ? `    environment:\n${Object.entries(service.environment).map(([key, value]) => `      ${key}: ${value}`).join('\n')}` : ''}
${service.volumes ? `    volumes:\n${service.volumes.map((volume: string) => `      - ${volume}`).join('\n')}` : ''}
`).join('')}
${dockerCompose.volumes ? `\nvolumes:\n${Object.keys(dockerCompose.volumes).map(volume => `  ${volume}:`).join('\n')}` : ''}
`
  }
}

/**
 * Generate .gitignore file
 */
export function generateGitIgnore(): TemplateFile {
  const content = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
.nuxt/
.svelte-kit/

# Database
*.db
*.sqlite
prisma/migrations/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Coverage
coverage/
.nyc_output/

# Cache
.cache/
.tmp/
.temp/
`

  return {
    path: '.gitignore',
    content
  }
}

/**
 * Generate README.md
 */
export function generateReadme(config: ProjectSetupConfig): TemplateFile {
  const enabledFeatures = Object.entries(config.features)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => `- **${key}**: Enabled`)

  const content = `# ${config.projectName}

A modern, type-safe API built with [Zyntra.js](https://github.com/matheuszwilk/zyntra-js) and ${config.framework}.

## Features

${enabledFeatures.join('\n')}
${config.database.provider !== 'none' ? `- **Database**: ${config.database.provider}` : ''}
${config.dockerCompose ? '- **Docker**: Compose setup included' : ''}

## Development

### Prerequisites

- Node.js 18+
- ${config.packageManager}
${config.dockerCompose ? '- Docker and Docker Compose' : ''}

### Getting Started

1. **Install dependencies:**
   \`\`\`bash
   ${config.packageManager} install
   \`\`\`

${config.dockerCompose ? `2. **Start services with Docker:**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

` : ''}${config.database.provider !== 'none' ? `3. **Setup database:**
   \`\`\`bash
   ${config.packageManager} run db:push
   \`\`\`

` : ''}4. **Start development server:**
   \`\`\`bash
   ${config.packageManager} run dev
   \`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## Project Structure

\`\`\`
src/
├── zyntra.ts                     # Core initialization
├── zyntra.client.ts              # Client implementation
├── zyntra.context.ts             # Context management
├── zyntra.router.ts              # Router configuration
├── zyntra.schema.ts             # Schemas configuration
├── features/                      # Application features
│   └── user/
│       ├── controllers/           # Feature controllers
│       ├── procedures/            # Feature procedures/middleware
│       ├── user.interfaces.ts     # Type definitions
│       └── index.ts               # Feature exports
└── providers/                     # Providers layer
\`\`\`

## API Endpoints

- \`GET /api/v1/users\` - List all users
- \`GET /api/v1/users/:id\` - Get user by ID
- \`POST /api/v1/users\` - Create a new user
- \`PUT /api/v1/users/:id\` - Update an existing user
- \`DELETE /api/v1/users/:id\` - Delete a user

## Learn More

- [Zyntra.js Documentation](https://github.com/matheuszwilk/zyntra-js)
- [${config.framework} Documentation](https://docs.${config.framework === 'nextjs' ? 'nextjs.org' : config.framework + '.dev'})
${config.database.provider !== 'none' ? '- [Prisma Documentation](https://prisma.io/docs)' : ''}

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
`

  return {
    path: 'README.md',
    content
  }
}

/**
 * Generate all template files for the project
 */
export function generateAllTemplates(
  config: ProjectSetupConfig,
  isExistingProject: boolean
): TemplateFile[] {
  const templates: TemplateFile[] = [
    // Core Zyntra files - always generate
    generateZyntraRouter(config),
    generateZyntraContext(config),
    generateMainRouter(config),
    generateZyntraClient(config),

    // Feature files - always generate
    generateUserController(config),
    generateFeatureIndex(config),
    generateUserInterfaces(),

    // .env.example is safe to generate as it won't overwrite a user's .env file
    generateEnvFile(config),
  ]

  // Add service files for enabled features
  const serviceFiles = generateServiceFiles(config)
  templates.push(...serviceFiles)

  // Add Docker Compose if enabled. The generator logic handles confirmation for overwrites.
  const dockerCompose = generateDockerCompose(config)
  if (dockerCompose) {
    templates.push(dockerCompose)
  }

  // Project-level boilerplate (like package.json, tsconfig.json, etc.) is now handled
  // in the generator for new projects.

  return templates
}
