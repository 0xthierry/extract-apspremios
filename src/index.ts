import * as parseWorker from '@/workers/parse-page-content'
import * as getWorker from '@/workers/get-page-content'
import * as aggregateWorker from '@/workers/aggregate-page-content'
import * as createWorker from '@/workers/create-pages'
import { env } from '@/config/env'

const workers = new Map([
  ['parse', parseWorker],
  ['get', getWorker],
  ['aggregate', aggregateWorker],
  ['create', createWorker],
])

const worker = workers.get(env.WORKER)

if (!worker) {
  throw new Error(`Unknown worker: ${env.WORKER}`)
}

worker.start().catch((error) => {
  console.error(error)
  process.exit(1)
})
