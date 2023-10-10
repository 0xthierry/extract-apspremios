import { JobRequest } from '@/workers/aggregate-page-content'
import { AggregatedAndAggregatedProcessedRepository } from '@/repositories/aggregated-and-aggregated-processed-repository'
import { logger } from '@/core/logger'

const childLogger = logger.child({ module: 'aggregate-page-content' })

const isAlreadyProcessedOrderError = (error: Error) => {
  if (
    error.name === 'SqliteError' &&
    error.message.includes(
      'UNIQUE constraint failed: aggregated_processed.id_order',
    )
  ) {
    return true
  }

  return false
}

export async function aggregatePageContent(job: JobRequest) {
  const repository = new AggregatedAndAggregatedProcessedRepository()
  childLogger.info(job, 'Aggregating page content')
  const { name, slug, quantity, price, orderId } = job

  try {
    await repository.updateQuantityOrCreateAndSaveProcessed({
      name,
      slug,
      quantity,
      price,
      idOrder: orderId,
    })
  } catch (error) {
    if (error instanceof Error && isAlreadyProcessedOrderError(error)) {
      childLogger.info({ orderId }, 'Already processed order')
    } else {
      throw error
    }
  } finally {
    childLogger.info('Finished aggregating page content')
  }
}
