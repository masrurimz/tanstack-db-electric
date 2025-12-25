import { createRouter as createTanstackRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"
import { deLocalizeHref } from "@/paraglide/runtime.js"
import "./styles.css"

// Create a new router instance
export function getRouter() {
  return createTanstackRouter({
    routeTree,
    defaultPreload: `viewport`,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    rewrite: {
      // Map localized URLs (e.g., /en/...) to base paths so the route tree matches
      input: ({ url }) => deLocalizeHref(url.toString()),
      // Do not re-localize on navigation; localization is handled by middleware/URLs
      output: ({ url }) => url,
    },
  })
}
