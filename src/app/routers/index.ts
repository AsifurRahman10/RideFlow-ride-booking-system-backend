import { Router } from 'express'

export const router = Router()

const modulesRoute = [
  {
    path: '/',
    router: 
  }
]

modulesRoute.forEach(route =>{
    router.use(route.path, route.router)
})