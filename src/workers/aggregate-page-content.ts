import { env } from '@/config/env'
import { Worker, WorkerOptions } from 'bullmq'
import { aggregateQueue } from '@/queues/aggregate'
import { aggregatePageContent } from '@/handlers/aggregate-page-content'

const workerConfig: WorkerOptions = {
  autorun: false,
  connection: { host: env.REDIS_HOST, port: env.REDIS_PORT },
  concurrency: 25,
}

export type JobRequest = {
  name: string
  slug: string
  quantity: number
  price: number
  orderId: string
}

const worker = new Worker<JobRequest>(
  aggregateQueue.name,
  async (job) => {
    await aggregatePageContent(job.data)
  },
  workerConfig,
)

export const start = async () => {
  worker.run()
}
