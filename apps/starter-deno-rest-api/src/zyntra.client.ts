/* eslint-disable */
/* prettier-ignore */

import { createZyntraClient, useZyntraQueryClient } from '@zyntra-js/core/client'
import type { AppRouterType } from './zyntra.router'

/**
* Type-safe API client generated from your Zyntra router
*
* Usage in Server Components:
* const users = await api.users.list.query()
*
* Usage in Client Components:
* const { data } = api.users.list.useQuery()
*
* Note: Adjust environment variable prefixes (e.g., NEXT_PUBLIC_, BUN_PUBLIC_, DENO_PUBLIC_, REACT_APP_)
*       according to your project's framework/runtime (Next.js, Bun, Deno, React/Vite, etc.).
*/
export const api = createZyntraClient<AppRouterType>({
  baseURL: process.env.ZYNTRA_API_URL, // Adapt for your needs
  basePATH: process.env.ZYNTRA_API_BASE_PATH,
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
