"use client"

import { useState, useEffect } from "react"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/components/translation-provider"
import { SUPPORTED_LANGUAGES } from "@/lib/translation-service"

type Language = typeof SUPPORTED_LANGUAGES[number]

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.find((lang) => lang.code === language) || SUPPORTED_LANGUAGES[0],
  )

  useEffect(() => {
    setMounted(true)
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === language)
    if (lang) setCurrentLanguage(lang)
  }, [language])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    setLanguage(language.code as "en" | "hi" | "ta" | "te" | "kn" | "ml")

    // Show a notification that language has been changed
    const notification = document.createElement("div")
    notification.className = "fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded shadow-lg z-50"
    notification.textContent = `Language changed to ${language.nativeName}`
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 3000)
  }

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang)}
            className="flex items-center justify-between"
          >
            <span>
              {lang.nativeName} <span className="text-muted-foreground text-xs">({lang.name})</span>
            </span>
            {currentLanguage.code === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

