"use client"

import { useState } from "react"
import { Check, FileText, Pill, Stethoscope, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface TreatmentRecommenderProps {
  diagnosis: string
  patientId: string
}

interface Treatment {
  name: string
  type: "medication" | "therapy" | "lifestyle"
  description: string
  evidence: string
  confidence: number
}

export function TreatmentRecommender({ diagnosis, patientId }: TreatmentRecommenderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])

  // Mock treatment recommendations
  const treatments: Record<string, Treatment[]> = {
    medications: [
      {
        name: "Lisinopril",
        type: "medication",
        description: "ACE inhibitor for blood pressure control",
        evidence: "Strong evidence from multiple clinical trials",
        confidence: 92,
      },
      {
        name: "Hydrochlorothiazide",
        type: "medication",
        description: "Diuretic to reduce fluid retention",
        evidence: "Recommended in JNC 8 guidelines for hypertension",
        confidence: 85,
      },
    ],
    therapies: [
      {
        name: "Dietary Counseling",
        type: "therapy",
        description: "DASH diet approach for hypertension management",
        evidence: "Shown to reduce blood pressure by 8-14 mmHg in studies",
        confidence: 88,
      },
    ],
    lifestyle: [
      {
        name: "Regular Exercise",
        type: "lifestyle",
        description: "150 minutes of moderate aerobic activity per week",
        evidence: "Can lower blood pressure by 5-8 mmHg",
        confidence: 90,
      },
      {
        name: "Sodium Restriction",
        type: "lifestyle",
        description: "Limit sodium intake to less than 2,300mg per day",
        evidence: "Meta-analyses show significant BP reduction with sodium restriction",
        confidence: 82,
      },
    ],
  }

  const handleToggleTreatment = (treatmentName: string) => {
    setSelectedTreatments((prev) =>
      prev.includes(treatmentName) ? prev.filter((name) => name !== treatmentName) : [...prev, treatmentName],
    )
  }

  const handleSavePlan = () => {
    setIsLoading(true)
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false)
      alert("Treatment plan saved successfully!")
    }, 1500)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (confidence >= 80) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-orange-100 text-orange-800 border-orange-200"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Treatment Recommendations
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {diagnosis}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="medications">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="therapies">Therapies</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          </TabsList>

          {Object.entries(treatments).map(([category, options]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {options.map((treatment, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    selectedTreatments.includes(treatment.name) ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Pill className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{treatment.name}</h3>
                        <Badge variant="outline" className={getConfidenceColor(treatment.confidence)}>
                          {treatment.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{treatment.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>{treatment.evidence}</span>
                      </div>
                    </div>
                    <Button
                      variant={selectedTreatments.includes(treatment.name) ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => handleToggleTreatment(treatment.name)}
                    >
                      {selectedTreatments.includes(treatment.name) ? (
                        <>
                          <Check className="h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full flex justify-between">
          <Button variant="outline" className="gap-1">
            <ThumbsDown className="h-4 w-4" />
            Not Appropriate
          </Button>
          <Button variant="outline" className="gap-1">
            <ThumbsUp className="h-4 w-4" />
            Good Recommendation
          </Button>
        </div>
        <Button className="w-full" disabled={selectedTreatments.length === 0 || isLoading} onClick={handleSavePlan}>
          {isLoading ? (
            <>
              <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            "Save Treatment Plan"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

