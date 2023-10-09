import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  // Queues
})

export const env = envSchema.parse(process.env)
