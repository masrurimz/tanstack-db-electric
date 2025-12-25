import { type } from "arktype"
import { ORPCError } from "@orpc/server"
import { protectedProcedure } from "@/lib/orpc"

export const usersRouter = {
  create: protectedProcedure
    .input(type(`unknown`))
    .handler(async () => {
      throw new ORPCError(`FORBIDDEN`, {
        message: `Can't create new users through API`,
      })
    }),

  update: protectedProcedure
    .input(type({ id: `string`, data: `unknown` }))
    .handler(async () => {
      throw new ORPCError(`FORBIDDEN`, {
        message: `Can't edit users through API`,
      })
    }),

  delete: protectedProcedure
    .input(type({ id: `string` }))
    .handler(async () => {
      throw new ORPCError(`FORBIDDEN`, {
        message: `Can't delete users through API`,
      })
    }),
}
