import "@dotenvx/dotenvx/config"
import { drizzle } from "drizzle-orm/bun-sql"
import { SQL } from "bun"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error(`DATABASE_URL is not set`)
}

const sql = new SQL({
  url: databaseUrl,
  max: 20,
  idleTimeout: 30,
  maxLifetime: 3600,
  connectionTimeout: 10,
})

export const db = drizzle({ client: sql, casing: `snake_case` })
