import { getLocale, locales, setLocale } from "@/paraglide/runtime.js"

export function LocaleSwitcher() {
  const currentLocale = getLocale()

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => setLocale(locale)}
          data-active-locale={locale === currentLocale}
          className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm data-[active-locale=true]:bg-gray-700 data-[active-locale=true]:text-white"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
