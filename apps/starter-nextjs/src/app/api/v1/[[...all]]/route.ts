import { AppRouter } from '@/zyntra.router'
import { nextRouteHandlerAdapter } from '@zyntra-js/core/adapters'

export const { GET, POST, PUT, DELETE } = nextRouteHandlerAdapter(AppRouter)