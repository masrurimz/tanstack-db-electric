import { defineConfig } from "vite"
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"
import { caddyPlugin } from "./src/vite-plugin-caddy"

// Use aws-lambda preset for SST deployments (CI), otherwise use default for local dev
const nitroPreset = process.env.CI ? `aws-lambda` : undefined

const config = defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: `./project.inlang`,
      outdir: `./src/paraglide`,
      outputStructure: `message-modules`,
      cookieName: `PARAGLIDE_LOCALE`,
      strategy: [`url`, `cookie`, `preferredLanguage`, `baseLocale`],
      urlPatterns: [
        {
          pattern: `/`,
          localized: [
            [`en`, `/en`],
            [`de`, `/de`],
          ],
        },
        {
          pattern: `/login`,
          localized: [
            [`en`, `/en/login`],
            [`de`, `/de/login`],
          ],
        },
        {
          pattern: `/project/:projectId`,
          localized: [
            [`en`, `/en/project/:projectId`],
            [`de`, `/de/projekt/:projectId`],
          ],
        },
        {
          pattern: `/:path(.*)?`,
          localized: [
            [`en`, `/en/:path(.*)?`],
            [`de`, `/de/:path(.*)?`],
          ],
        },
      ],
    }),
    devtools(),
    nitro({
      preset: nitroPreset,
      awsLambda: {
        streaming: true,
      },
    }),
    viteTsConfigPaths({
      projects: [`./tsconfig.json`],
    }),
    caddyPlugin(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  optimizeDeps: {
    exclude: [`@tanstack/start-server-core`],
  },
})

export default config
