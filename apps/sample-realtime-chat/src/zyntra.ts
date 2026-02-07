import { Zyntra } from '@zyntra-js/core'
import { createZyntraAppContext } from "./zyntra.context"
import { logger } from "@/services/logger"
import { telemetry } from "@/services/telemetry"
import { store } from './services/store'

import openapi from './docs/openapi.json'

/**
 * @description Initialize the Zyntra.js
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const zyntra = Zyntra
  .context(createZyntraAppContext())
  .store(store)
  .logger(logger)
  .telemetry(telemetry)
  .config({
    baseURL: process.env.NEXT_PUBLIC_ZYNTRA_API_URL || 'http://localhost:3000',
    basePATH: process.env.NEXT_PUBLIC_ZYNTRA_API_BASE_PATH || '/api/v1',
  })
  .docs({
    openapi,
    info: {
      title: 'Sample Realtime Chat',
      version: '1.0.0',
      description: 'A sample realtime chat application built with Zyntra.js',
      contact: {
        name: 'ZyntraJS',
        email: 'team@zyntrajs.com',
        url: 'https://github.com/matheuszwilk/zyntra-js'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    }
  })
  .create()
