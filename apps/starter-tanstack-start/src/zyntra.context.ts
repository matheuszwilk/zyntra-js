/**
 * @description Create the context of the Zyntra.js application
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const createZyntraAppContext = () => {
  // Add application-wide context properties here, like database clients.
  return {};
};

/**
 * @description The context of the Zyntra.js application.
 * This type is enhanced by Zyntra's built-in features like logger, store, etc.
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export type ZyntraAppContext = Awaited<
  ReturnType<typeof createZyntraAppContext>
>;
