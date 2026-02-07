import { createConsoleLogger, ZyntraLogLevel } from '@zyntra-js/core'

/**
  * Logger instance for application logging.
  *
  * @remarks
  * Provides structured logging with configurable log levels.
  * This is used by the Zyntra instance to log events.
  *
  * @see https://github.com/matheuszwilk/zyntra-js
  */
export const logger = createConsoleLogger({
  level: ZyntraLogLevel.INFO, // Change to DEBUG for more verbose logs
  showTimestamp: true,
})
