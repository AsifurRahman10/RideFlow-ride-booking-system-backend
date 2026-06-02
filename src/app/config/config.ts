import dotenv from 'dotenv'

dotenv.config()
interface EnvProps {
  PORT: string
  MONGODB_URL: string
  FRONTEND_URL: string
  NODE_ENV: string
  BCRYPT_SALT_ROUNDS: string
  JWT_SECRET: string
  JWT_EXPIRE: string
  JWT_REFRESH_SECRET: string
  JWT_REFRESH_EXPIRE: string
}

const loadEnv = (): EnvProps => {
  const envArray: string[] = [
    'PORT',
    'MONGODB_URL',
    'FRONTEND_URL',
    'NODE_ENV',
    'BCRYPT_SALT_ROUNDS',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRE'
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
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRE: process.env.JWT_EXPIRE!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE!
  }
}

export const envVars = loadEnv()
