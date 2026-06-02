interface EnvProps {
  PORT: string
  MONGODB_URL: string
  FRONTEND_URL: string
}

const loadEnv = (): EnvProps => {
  const envArray: string[] = ['PORT', 'MONGODB_URL', 'FRONTEND_URL']

  envArray.forEach((key) => {
    if (!process.env[key]) {
      throw new Error('ENV loading issue ')
    }
  })
  return {
    PORT: process.env.PORT!,
    MONGODB_URL: process.env.MONGODB_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!
  }
}

export const envVars = loadEnv()
