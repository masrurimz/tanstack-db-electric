import type { RouterClient } from "@orpc/server"

import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import { createRouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { QueryClient } from "@tanstack/react-query"
import { createIsomorphicFn } from "@tanstack/react-start"

import router from "./routers"
import { createContext } from "./context"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
})

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      context: async ({ signal }) => {
        const headers = new Headers()
        return createContext({
          request: new Request(`http://localhost`, { headers, signal }),
        })
      },
    })
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/rpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: `include`,
        })
      },
    })

    return createORPCClient(link)
  })

export const client: RouterClient<typeof router> = getORPCClient()

export const orpc = createTanstackQueryUtils(client)
