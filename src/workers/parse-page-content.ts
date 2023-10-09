import { env } from '@/config/env'
import { Worker, WorkerOptions } from 'bullmq'
import { parserQueue } from '@/queues/parser'
import { parsePageContent } from '@/handlers/parse-page-content'

const workerConfig: WorkerOptions = {
  autorun: false,
  connection: { host: env.REDIS_HOST, port: env.REDIS_PORT },
  concurrency: 15,
}

export type JobRequest = {
  url: string
  content: string
}

const worker = new Worker<JobRequest>(
  parserQueue.name,
  async (job) => {
    await parsePageContent(job.data)
  },
  workerConfig,
)

worker.run()
