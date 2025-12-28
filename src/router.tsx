import { QueryClientProvider } from "@tanstack/react-query"
import { createRouter as createTanstackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

import { routeTree } from "./routeTree.gen"
import { deLocalizeHref } from "@/paraglide/runtime.js"
import { orpc, queryClient } from "@/lib/orpc/query"
import "./styles.css"

export function getRouter() {
  const router = createTanstackRouter({
    routeTree,
    context: { queryClient, orpc },
    defaultPreload: `viewport`,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      input: ({ url }) => deLocalizeHref(url.toString()),
      output: ({ url }) => url,
    },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

// eslint-disable-next-line quotes
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
