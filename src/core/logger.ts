import { env } from '@/config/env'
import pino from 'pino'

export const logger = pino({
  name: env.WORKER,
})
