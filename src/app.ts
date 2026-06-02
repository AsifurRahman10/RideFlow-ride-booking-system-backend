import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import { envVars } from './app/config/config'
import { router } from './app/routers'
import notFound from './app/middleware/notFound'
import globalErrorHandler from './app/middleware/globalErrorHandler'

const app = express()
app.use(
  expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1)
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
  })
)
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to RideFlow API')
})

app.use('/api/v1', router)

app.use(globalErrorHandler)

app.use(notFound)

export default app
