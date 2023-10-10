import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { Aggregated } from './aggregated'

export const AggregatedProcessed = sqliteTable(
  'aggregated_processed',
  {
    id: integer('id').primaryKey(),
    idAggregated: integer('id_aggregated').references(() => Aggregated.id),
    idOrder: text('id_order'),
  },
  (aggregatedProcessed) => ({
    idOrderIdx: uniqueIndex('idOrderIdx').on(aggregatedProcessed.idOrder),
  }),
)
