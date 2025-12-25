import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import router from "@/lib/orpc/routers"

const link = new RPCLink({
  url:
    typeof window !== `undefined`
      ? `${window.location.origin}/api/rpc`
      : `http://localhost:5173/api/rpc`,
})

export const orpc: RouterClient<typeof router> = createORPCClient(link)
