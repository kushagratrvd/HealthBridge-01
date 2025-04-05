"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/components/translation-provider"
import { Loader2 } from "lucide-react"

interface DynamicTranslationProps {
  text: string
  className?: string
}

export function DynamicTranslation({ text, className = "" }: DynamicTranslationProps) {
  const { language, translateDynamic } = useTranslation()
  const [translatedText, setTranslatedText] = useState(text)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    // Reset when text changes
    if (isMounted) {
      setTranslatedText(text)
    }

    // Don't translate if language is English or text is empty
    if (language === "en" || !text) return

    const translate = async () => {
      if (isMounted) {
        setIsTranslating(true)
        setError(null)
      }

      try {
        const result = await translateDynamic(text)
        if (isMounted) {
          setTranslatedText(result)
        }
      } catch (error) {
        console.error("Translation error:", error)
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Translation failed")
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false)
        }
      }
    }

    translate()

    return () => {
      isMounted = false
    }
  }, [text, language, translateDynamic])

  if (isTranslating) {
    return (
      <span className={className}>
        <span className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span className="text-muted-foreground">Translating...</span>
        </span>
      </span>
    )
  }

  if (error) {
    return (
      <span className={className}>
        {text}
        <span className="text-xs text-red-500 mt-1">(Translation error)</span>
      </span>
    )
  }

  return <span className={className}>{translatedText}</span>
}

