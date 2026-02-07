import { Zyntra } from '@zyntra-js/core'
import { createZyntraAppContext } from "./zyntra.context"
import { store } from "@/services/store"
import { REGISTERED_JOBS } from "@/services/jobs"
import { logger } from "@/services/logger"
import { telemetry } from "@/services/telemetry"

/**
 * @description Initialize the Zyntra.js
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const zyntra = Zyntra
  .context(createZyntraAppContext())
  .store(store)
  .jobs(REGISTERED_JOBS)
  .logger(logger)
  .telemetry(telemetry)
  .config({
    baseURL: process.env.ZYNTRA_API_URL || 'http://localhost:3000',
    basePATH: process.env.ZYNTRA_API_BASE_PATH || '/api/v1',
  })
  .docs({
    openapi: require('./docs/openapi.json'),
    info: {
      title: 'Zyntra.js Starter (Express REST API)',
      version: '1.0.0',
      description: 'A sample Express REST API built with Zyntra.js',
    }
  })
  .create()
