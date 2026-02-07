// import { database } from "@/services/database"

/**
 * @description Create the context of the Zyntra.js application
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const createZyntraAppContext = () => {
  return {
    // database,
  }
}

/**
 * @description The context of the Zyntra.js application
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export type ZyntraAppContext = Awaited<ReturnType<typeof createZyntraAppContext>>
