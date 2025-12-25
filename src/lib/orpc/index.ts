import { ORPCError, os } from "@orpc/server"
import { sql } from "drizzle-orm"
import type { Context } from "./context"
import type { db } from "@/db/connection"

export const o = os.$context<Context>()

export const publicProcedure = o

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError(`UNAUTHORIZED`)
  }
  return next({
    context: {
      session: context.session,
      db: context.db,
    },
  })
})

export const protectedProcedure = publicProcedure.use(requireAuth)

export async function generateTxId(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0]
): Promise<number> {
  const result = await tx.execute(
    sql`SELECT pg_current_xact_id()::xid::text as txid`
  )
  const txid = result[0]?.txid

  if (txid === undefined) {
    throw new Error(`Failed to get transaction ID`)
  }

  return parseInt(txid as string, 10)
}
