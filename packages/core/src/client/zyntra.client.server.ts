import type { ZyntraRouter, ClientConfig, InferRouterCaller } from '../types';

/**
 * Creates a server-side client for Zyntra Router
 * This version uses router.caller directly (zero browser dependencies)
 * @param config Client configuration
 * @returns A typed client for calling server actions
 */
export const createZyntraClient = <TRouter extends Omit<ZyntraRouter<any, any, any, any, any>, 'caller'>>(
  {
    router,
  }: ClientConfig<TRouter & { caller: any }>
): InferRouterCaller<TRouter & { caller: any }> => {
  
  if (!router) {
    throw new Error('Router is required to create an Zyntra client');
  }

  if (typeof router === 'function') {
    router = router();
  }

  // Server-side: Use direct router.caller (zero browser dependencies)
  return router.caller as unknown as InferRouterCaller<TRouter & { caller: any }>;
}; 