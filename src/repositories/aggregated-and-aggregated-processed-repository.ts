import { db } from '@/core/database'
import {
  CreateOrUpdateAggregated,
  Aggregated,
} from '@/core/database/schemas/aggregated'
import { AggregatedProcessed } from '@/core/database/schemas/aggregated-processed'
import { sql } from 'drizzle-orm'

type UpdateAggregatedAndAggregatedProcessed = CreateOrUpdateAggregated & {
  idOrder: string
}

export class AggregatedAndAggregatedProcessedRepository {
  private readonly db = db

  async updateQuantityOrCreateAndSaveProcessed({
    name,
    price,
    quantity,
    slug,
    idOrder,
  }: UpdateAggregatedAndAggregatedProcessed) {
    await this.db.transaction(async (tx) => {
      const [aggregate] = await tx
        .insert(Aggregated)
        .values({ name, price, quantity, slug })
        .onConflictDoUpdate({
          set: {
            quantity: sql`quantity + ${quantity}`,
          },
          target: Aggregated.slug,
        })
        .returning({ id: Aggregated.id })
      console.log({ aggregate })
      await tx
        .insert(AggregatedProcessed)
        .values({ idAggregated: aggregate.id, idOrder })
    })
  }
}
