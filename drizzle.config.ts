import type { Config } from 'drizzle-kit'

export default {
  schema: './src/core/database/schemas',
  driver: 'better-sqlite',
  out: './drizzle',
} satisfies Config
