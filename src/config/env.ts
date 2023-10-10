import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string().transform(Number),
  CREATE_PAGES_WORKER_PARAMS: z
    .string()
    .transform((text) => JSON.parse(text))
    .pipe(
      z.object({
        startOrderId: z.string().transform(Number),
        endOrderId: z.string().transform(Number),
      }),
    ),
  WORKER: z.enum(['parse', 'get', 'aggregate', 'create']),
})

export const env = envSchema.parse(process.env)
