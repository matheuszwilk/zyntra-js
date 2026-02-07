import { zyntra } from '@/zyntra'
import { userController } from '@/features/user/controllers/user.controller'
import { postController } from '@/features/post/controllers/post.controller'
import { commentController } from '@/features/comment/controllers/comment.controller'

/**
 * @description Main application router configuration
 * @see https://github.com/matheuszwilk/zyntra-js
 */
export const AppRouter = zyntra.router({
  controllers: {
    user: userController,
    post: postController,
    comment: commentController
  }
})

export type AppRouterType = typeof AppRouter
