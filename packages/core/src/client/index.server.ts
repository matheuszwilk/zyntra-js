// Server-specific barrel file
// React-specific exports (work in server environment)
export { ZyntraProvider, useZyntraQueryClient } from "./zyntra.context";
export { useRealtime } from "./zyntra.hooks";

// Server-specific createZyntraClient (uses router.caller directly)
export { createZyntraClient } from './zyntra.client.server';
