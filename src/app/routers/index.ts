import { Router } from 'express'
import { AuthRoute } from '../modules/auth/auth.route'

export const router = Router()

const modulesRoute = [
  {
    path: '/auth',
    router: AuthRoute
  }
]

modulesRoute.forEach((route) => {
  router.use(route.path, route.router)
})
