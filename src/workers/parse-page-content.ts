import { env } from '@/config/env'
import { Worker, WorkerOptions } from 'bullmq'
import { parserQueue } from '@/queues/parser'
import { parsePageContent } from '@/handlers/parse-page-content'
import { logger } from '@/core/logger'

const workerConfig: WorkerOptions = {
  autorun: false,
  connection: { host: env.REDIS_HOST, port: env.REDIS_PORT },
  concurrency: 25,
}

export type JobRequest = {
  url: string
  content: string
}

const worker = new Worker<JobRequest>(
  parserQueue.name,
  async (job) => {
    try {
      await parsePageContent(job.data)
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid page content') {
        logger.info('Invalid page content', job.data)
      }
    }
  },
  workerConfig,
)

export const start = async () => {
  worker.run()
}
