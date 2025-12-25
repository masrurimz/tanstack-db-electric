// src/server.ts
import { paraglideMiddleware } from "@/paraglide/server.js"
import handler from "@tanstack/react-start/server-entry"

export default {
  fetch(req: Request): Promise<Response> {
    // Normalize the request URL when running behind a TLS-terminating proxy
    // so Paraglide builds redirects with the external scheme/host instead of
    // the internal dev server values.
    const forwardedProto = req.headers.get(`x-forwarded-proto`)
    const forwardedHost = req.headers.get(`x-forwarded-host`)
    if (forwardedProto || forwardedHost) {
      const url = new URL(req.url)
      url.protocol = forwardedProto ?? url.protocol
      url.host = forwardedHost ?? url.host
      req = new Request(url, req)
    }

    return paraglideMiddleware(req, ({ request }) => handler.fetch(request))
  },
}
