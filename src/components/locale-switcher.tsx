import { getLocale, locales, setLocale } from "@/paraglide/runtime.js"
import * as m from "@/paraglide/messages.js"

export function LocaleSwitcher() {
  const currentLocale = getLocale()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{m.language()}</span>
      <select
        value={currentLocale}
        onChange={(e) => setLocale(e.target.value as (typeof locales)[number])}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  )
}
