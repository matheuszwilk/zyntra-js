// Browser-specific barrel file
// React-specific exports (client-side only)
export { ZyntraProvider, useZyntraQueryClient } from "./zyntra.context";
export { useRealtime } from "./zyntra.hooks";

// Browser-specific createZyntraClient (uses fetch + hooks)
export { createZyntraClient } from './zyntra.client.browser';
