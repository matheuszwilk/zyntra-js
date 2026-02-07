import { zyntra } from '@/zyntra'
import { messageController } from './features/message'

/**
 * @description Main application router configuration
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const AppRouter = zyntra.router({
  controllers: {
    message: messageController
  }
})

export type AppRouterType = typeof AppRouter
