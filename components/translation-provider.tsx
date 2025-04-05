"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { SUPPORTED_LANGUAGES, uiTranslations, translateWithAPI } from "@/lib/translation-service"

type TranslationKey = keyof typeof uiTranslations
type LanguageCode = keyof typeof uiTranslations.welcome

// Interface for our translation context
interface TranslationContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: TranslationKey, params?: Record<string, string>) => string
  translateDynamic: (text: string) => Promise<string>
}

// Create the context with default values
const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
  translateDynamic: async (text: string) => text,
})

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as LanguageCode
    if (savedLang && SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  const changeLanguage = (lang: LanguageCode) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: TranslationKey, params?: Record<string, string>): string => {
    const translation = uiTranslations[key]?.[language] || key
    if (!params) return translation

    return Object.entries(params).reduce(
      (acc: string, [key, value]) => acc.replace(`{{${key}}}`, value),
      translation
    )
  }

  const translateDynamic = async (text: string): Promise<string> => {
    return translateWithAPI(text, language)
  }

  const contextValue = {
    language,
    setLanguage: changeLanguage,
    t,
    translateDynamic,
  }

  return <TranslationContext.Provider value={contextValue}>{children}</TranslationContext.Provider>
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
} 