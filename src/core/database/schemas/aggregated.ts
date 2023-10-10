import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const Aggregated = sqliteTable(
  'aggregated',
  {
    id: integer('id').primaryKey(),
    slug: text('slug'),
    name: text('name'),
    quantity: integer('quantity'),
    price: integer('price'),
  },
  (aggregated) => ({
    slugIdx: uniqueIndex('slugIdx').on(aggregated.slug),
  }),
)

export type CreateOrUpdateAggregated = {
  name: string
  slug: string
  quantity: number
  price: number
}
