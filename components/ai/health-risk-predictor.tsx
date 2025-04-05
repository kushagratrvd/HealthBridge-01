"use client"

import type React from "react"

import { useState } from "react"
import { Activity, AlertTriangle, ArrowRight, Heart, TreesIcon as Lungs, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HealthRiskPredictorProps {
  patientId: string
}

interface RiskFactor {
  name: string
  risk: number
  description: string
  icon: React.ReactNode
}

export function HealthRiskPredictor({ patientId }: HealthRiskPredictorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)

  // Mock risk factors
  const riskFactors: Record<string, RiskFactor[]> = {
    cardiovascular: [
      {
        name: "Hypertension",
        risk: 65,
        description: "Based on blood pressure readings and family history",
        icon: <Heart className="h-5 w-5 text-red-500" />,
      },
      {
        name: "Cholesterol",
        risk: 42,
        description: "LDL levels slightly elevated in recent tests",
        icon: <Activity className="h-5 w-5 text-orange-500" />,
      },
    ],
    respiratory: [
      {
        name: "Asthma",
        risk: 28,
        description: "Some respiratory symptoms reported, but limited risk factors",
        icon: <Lungs className="h-5 w-5 text-blue-500" />,
      },
    ],
    metabolic: [
      {
        name: "Type 2 Diabetes",
        risk: 37,
        description: "Family history and slightly elevated glucose levels",
        icon: <Pill className="h-5 w-5 text-purple-500" />,
      },
    ],
  }

  const handleAnalyze = () => {
    setIsLoading(true)
    // Simulate analysis
    setTimeout(() => {
      setIsLoading(false)
      setHasAnalyzed(true)
    }, 2000)
  }

  const getRiskColor = (risk: number) => {
    if (risk < 30) return "bg-green-500"
    if (risk < 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return "Low"
    if (risk < 60) return "Moderate"
    return "High"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Health Risk Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAnalyzed ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analyze Patient Health Data</h3>
            <p className="text-muted-foreground mb-6">
              Use AI to analyze patient data and predict potential health risks based on medical history, lab results,
              and lifestyle factors.
            </p>
            <Button onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Run Risk Analysis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="cardiovascular">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="cardiovascular">Cardiovascular</TabsTrigger>
              <TabsTrigger value="respiratory">Respiratory</TabsTrigger>
              <TabsTrigger value="metabolic">Metabolic</TabsTrigger>
            </TabsList>

            {Object.entries(riskFactors).map(([category, factors]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {factors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {factor.icon}
                        <span className="font-medium">{factor.name}</span>
                      </div>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded-full ${
                          getRiskLevel(factor.risk) === "Low"
                            ? "bg-green-100 text-green-800"
                            : getRiskLevel(factor.risk) === "Moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getRiskLevel(factor.risk)} Risk
                      </span>
                    </div>
                    <Progress value={factor.risk} className={getRiskColor(factor.risk)} />
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {hasAnalyzed && (
          <>
            <Button variant="outline" onClick={() => setHasAnalyzed(false)}>
              Reset Analysis
            </Button>
            <Button>Generate Detailed Report</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

