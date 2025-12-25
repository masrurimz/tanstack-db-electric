import { serverOnly } from "@tanstack/react-start"
import { auth } from "@/lib/auth"
import { db } from "@/db/connection"

export const createContext = serverOnly(
  async ({ request }: { request: Request }) => {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    return {
      session,
      db,
    }
  }
)

export type BetterAuthSessionResult = Awaited<
  ReturnType<typeof auth.api.getSession>
>

export type Context = {
  session: BetterAuthSessionResult
  db: typeof db
}
