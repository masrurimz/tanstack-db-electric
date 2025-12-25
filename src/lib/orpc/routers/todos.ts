import { type } from "arktype"
import { ORPCError } from "@orpc/server"
import { eq, and, arrayContains } from "drizzle-orm"
import { protectedProcedure, generateTxId } from "@/lib/orpc"
import { todosTable, createTodoSchema, updateTodoSchema } from "@/db/schema"

export const todosRouter = {
  create: protectedProcedure
    .input(createTodoSchema)
    .handler(async ({ context, input }) => {
      const result = await context.db.transaction(async (tx) => {
        const txid = await generateTxId(tx)
        const [newItem] = await tx.insert(todosTable).values(input).returning()
        return { item: newItem, txid }
      })

      return result
    }),

  update: protectedProcedure
    .input(
      type({
        id: `number`,
        data: updateTodoSchema,
      })
    )
    .handler(async ({ context, input }) => {
      const result = await context.db.transaction(async (tx) => {
        const txid = await generateTxId(tx)
        const [updatedItem] = await tx
          .update(todosTable)
          .set(input.data)
          .where(
            and(
              eq(todosTable.id, input.id),
              arrayContains(todosTable.user_ids, [context.session.user.id])
            )
          )
          .returning()

        if (!updatedItem) {
          throw new ORPCError(`NOT_FOUND`, {
            message: `Todo not found or you do not have permission to update it`,
          })
        }

        return { item: updatedItem, txid }
      })

      return result
    }),

  delete: protectedProcedure
    .input(type({ id: `number` }))
    .handler(async ({ context, input }) => {
      const result = await context.db.transaction(async (tx) => {
        const txid = await generateTxId(tx)
        const [deletedItem] = await tx
          .delete(todosTable)
          .where(
            and(
              eq(todosTable.id, input.id),
              arrayContains(todosTable.user_ids, [context.session.user.id])
            )
          )
          .returning()

        if (!deletedItem) {
          throw new ORPCError(`NOT_FOUND`, {
            message: `Todo not found or you do not have permission to delete it`,
          })
        }

        return { item: deletedItem, txid }
      })

      return result
    }),
}
