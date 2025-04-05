"use client"

import { useState } from "react"
import { useTranslation } from "@/components/translation-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PrescriptionScanner() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t, translateDynamic } = useTranslation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("OCR failed")

      const data = await response.json()
      setResult(data.text)
    } catch (error) {
      console.error("Error processing prescription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">{t("upload_photo")}</TabsTrigger>
          <TabsTrigger value="result">{t("fulltext")}</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="prescription">{t("scan_prescription")}</Label>
            <Input
              id="prescription"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          {preview && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={preview}
                alt="Prescription preview"
                className="object-cover"
              />
            </div>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!file || isLoading}
            className="w-full"
          >
            {isLoading ? t("processing") : t("scan_prescription")}
          </Button>
        </TabsContent>
        <TabsContent value="result">
          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="whitespace-pre-wrap">{result}</p>
              </div>
              <Button
                onClick={() => {
                  // Add to medications logic here
                }}
                className="w-full"
              >
                {t("add_to_meds")}
              </Button>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              {t("upload_photo")}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
} 