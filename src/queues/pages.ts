import { env } from '@/config/env'
import { Queue } from 'bullmq'

export const pagesQueue = new Queue('pages', {
  connection: { host: env.REDIS_HOST, port: env.REDIS_PORT },
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})
