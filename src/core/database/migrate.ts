import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'

const connection = new Database('sqlite.db')
const db = drizzle(connection)

migrate(db, { migrationsFolder: './drizzle' })
