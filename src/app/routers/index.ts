import { Router } from 'express'
import { AuthRoute } from '../modules/auth/auth.route'
import { UserRoute } from '../modules/user/user.route'

export const router = Router()

const modulesRoute = [
  {
    path: '/auth',
    router: AuthRoute
  },
  {
    path: '/user',
    router: UserRoute
  }
]

modulesRoute.forEach((route) => {
  router.use(route.path, route.router)
})
