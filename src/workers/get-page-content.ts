import { env } from '@/config/env'
import { Worker, WorkerOptions } from 'bullmq'
import { pagesQueue } from '@/queues/pages'
import { getPageContent } from '@/handlers/get-page-content'

const workerConfig: WorkerOptions = {
  autorun: false,
  connection: { host: env.REDIS_HOST, port: env.REDIS_PORT },
  concurrency: 15,
}

export type JobRequest = {
  url: string
}

const worker = new Worker<JobRequest>(
  pagesQueue.name,
  async (job) => {
    await getPageContent(job.data)
  },
  workerConfig,
)

export const start = async () => {
  worker.run()
}
