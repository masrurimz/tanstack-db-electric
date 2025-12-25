import { useNavigate, useLocation, useRouter } from "@tanstack/react-router"
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js"

export function LocaleSwitcher() {
  const currentLocale = getLocale()

  const handleLocaleChange = (locale: (typeof locales)[number]) => {
    setLocale(locale)
  }

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          data-active-locale={locale === currentLocale}
          className="cursor-pointer rounded border border-gray-300 px-2 py-1 text-sm data-[active-locale=true]:bg-gray-700 data-[active-locale=true]:text-white"
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
