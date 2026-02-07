// React-specific exports (client-side only)
export { ZyntraProvider, useZyntraQueryClient } from "./zyntra.context";
export { useRealtime } from "./zyntra.hooks";

// Re-export createZyntraClient - will be environment-aware via imports
export { createZyntraClient } from './zyntra.client.browser';
