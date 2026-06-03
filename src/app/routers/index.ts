import { Router } from 'express'
import { AuthRoute } from '../modules/auth/auth.route'
import { UserRoute } from '../modules/user/user.route'
import { DriverRoute } from '../modules/driver/driver.route'

export const router = Router()

const modulesRoute = [
  {
    path: '/auth',
    router: AuthRoute
  },
  {
    path: '/user',
    router: UserRoute
  },
  {
    path: '/driver',
    router: DriverRoute
  }
]

modulesRoute.forEach((route) => {
  router.use(route.path, route.router)
})
