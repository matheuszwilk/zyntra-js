import { zyntra } from '@/zyntra'
import { userController } from '@/features/user/controllers/user.controller'

/**
 * @description Main application router configuration
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const AppRouter = zyntra.router({
  controllers: {
    user: userController
  }
})

export type AppRouterType = typeof AppRouter
