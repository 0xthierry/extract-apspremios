import { env } from '@/config/env'
import { pagesQueue } from '@/queues/pages'
import { logger } from '@/core/logger'

const childLogger = logger.child({ module: 'create-pages' })

const { startOrderId: START_ORDER_ID, endOrderId: END_ORDER_ID } =
  env.CREATE_PAGES_WORKER_PARAMS

export const start = async () => {
  const urlBase = `https://apspremios.com.br/pedidos`

  for (let i = START_ORDER_ID; i <= END_ORDER_ID; i++) {
    const url = `${urlBase}/${i}`
    childLogger.info({ url }, 'Creating page')
    await pagesQueue.add(pagesQueue.name, { url }, { jobId: url })
    childLogger.info({ url }, 'Finished creating page')
  }
}
