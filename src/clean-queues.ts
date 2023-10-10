import { aggregateQueue } from '@/queues/aggregate'
import { pagesQueue } from '@/queues/pages'
import { parserQueue } from '@/queues/parser'
;(async () => {
  const queues = [pagesQueue, parserQueue, aggregateQueue]
  await Promise.all(queues.map((queue) => queue.drain()))
  process.exit(0)
})()
