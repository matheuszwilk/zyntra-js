import { Zyntra } from '@zyntra-js/core'
import { createZyntraAppContext } from "./zyntra.context"
import { store } from "@/services/store"
import { REGISTERED_JOBS } from "@/services/jobs"
import { logger } from "@/services/logger"
import { telemetry } from "@/services/telemetry"

import openapi from './docs/openapi.json'

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
    baseURL: process.env.REACT_APP_ZYNTRA_API_URL || 'http://localhost:3000',
    basePATH: process.env.REACT_APP_ZYNTRA_API_BASE_PATH || '/api/v1',
  })
  .docs({
    openapi,
    info: {
      title: 'Zyntra.js Starter (Tanstack Start)',
      version: '1.0.0',
      description: 'A sample Tanstack Start App built with Zyntra.js',
    }
  })
  .create()
