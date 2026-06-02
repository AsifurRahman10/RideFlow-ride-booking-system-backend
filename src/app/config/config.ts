import dotenv from 'dotenv'

dotenv.config()
interface EnvProps {
  PORT: string
  MONGODB_URL: string
  FRONTEND_URL: string
  NODE_ENV: string
  BCRYPT_SALT_ROUNDS: string
}

const loadEnv = (): EnvProps => {
  const envArray: string[] = [
    'PORT',
    'MONGODB_URL',
    'FRONTEND_URL',
    'NODE_ENV',
    'BCRYPT_SALT_ROUNDS'
  ]

  envArray.forEach((key) => {
    if (!process.env[key]) {
      throw new Error('ENV loading issue ')
    }
  })
  return {
    PORT: process.env.PORT!,
    MONGODB_URL: process.env.MONGODB_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    NODE_ENV: process.env.NODE_ENV || 'development',
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS!
  }
}

export const envVars = loadEnv()
