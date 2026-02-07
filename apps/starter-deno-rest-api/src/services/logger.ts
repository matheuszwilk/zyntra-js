import { createConsoleLogger, ZyntraLogLevel } from '@zyntra-js/core'

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
