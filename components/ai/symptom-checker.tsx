"use client"

import { useState } from "react"
import { useTranslation } from "@/components/translation-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t, translateDynamic } = useTranslation()

  const handleSubmit = async () => {
    if (!symptoms.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()
      setResult(data.analysis)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="symptoms">{t("analyze_symptoms")}</Label>
          <Textarea
            id="symptoms"
            placeholder={t("describe_symptoms")}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!symptoms.trim() || isLoading}
          className="w-full"
        >
          {isLoading ? t("processing") : t("analyze_symptoms")}
        </Button>
        {result && (
          <div className="rounded-lg border p-4">
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </Card>
  )
} 