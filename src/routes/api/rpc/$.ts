import { createFileRoute } from "@tanstack/react-router"
import { RPCHandler } from "@orpc/server/fetch"
import { createContext } from "@/lib/orpc/context"
import router from "@/lib/orpc/routers"

const handler = new RPCHandler(router)

async function handle({ request }: { request: Request }) {
  const context = await createContext({ request })

  const { response } = await handler.handle(request, {
    prefix: `/api/rpc`,
    context,
  })

  return response ?? new Response(`Not Found`, { status: 404 })
}

export const Route = createFileRoute(`/api/rpc/$`)({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
})
