"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Stethoscope,
  ShieldAlert,
  Pill,
  ArrowRight,
  Loader2,
  ThermometerIcon,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { analyzeSymptoms, type SymptomCheckerResponse } from "@/app/actions/symptom-checker"

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SymptomCheckerResponse | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!symptoms.trim()) {
      setError("Please enter your symptoms")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await analyzeSymptoms(symptoms)

      if ("error" in response) {
        setError(response.error)
        setResult(null)
      } else {
        setResult(response)
      }
    } catch (err) {
      console.error("Error submitting symptoms:", err)
      setError("An unexpected error occurred. Please try again.")
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Symptom Checker</h1>
      <p className="text-muted-foreground mb-8">
        Describe your symptoms in detail to get AI-powered insights. Remember, this tool is for informational purposes
        only and does not replace professional medical advice.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Enter Your Symptoms
            </CardTitle>
            <CardDescription>
              Be specific and include details like duration, severity, and any triggers.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Textarea
                placeholder="Example: I've had a headache for the past 3 days, along with a mild fever and sore throat. The pain is worse in the morning..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={8}
                className="resize-none"
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    Analyze Symptoms
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ThermometerIcon className="h-5 w-5 text-primary" />
                      Possible Conditions
                    </CardTitle>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} Severity
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.possibleConditions.map((condition, index) => (
                      <li key={index} className="text-sm">
                        {condition}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    Recommended Precautions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.precautions.map((precaution, index) => (
                      <li key={index} className="text-sm">
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-primary" />
                    Suggested Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {result.suggestedMedications.map((medication, index) => (
                      <li key={index} className="text-sm">
                        {medication}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Medical Disclaimer</AlertTitle>
                <AlertDescription className="text-sm">{result.disclaimer}</AlertDescription>
              </Alert>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setResult(null)}>
                  Check Another Symptom
                </Button>
                <Button onClick={() => router.push("/patient/appointments/book")}>Book Appointment</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

