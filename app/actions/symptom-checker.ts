"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Define the response structure
export interface SymptomCheckerResponse {
  possibleConditions: string[]
  precautions: string[]
  suggestedMedications: string[]
  disclaimer: string
  severity: "low" | "medium" | "high" | "emergency"
}

export async function analyzeSymptoms(symptoms: string): Promise<SymptomCheckerResponse | { error: string }> {
  try {
    // Initialize the Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Create a structured prompt for better results
    const prompt = `
      You are a medical assistant AI. Based on the following symptoms, provide:
      1. A list of 2-3 possible medical conditions that might cause these symptoms
      2. A list of recommended precautions the person should take
      3. A list of over-the-counter medications that might help alleviate the symptoms
      4. A severity assessment (low, medium, high, or emergency)
      
      Format your response as a structured JSON object with the following keys:
      - possibleConditions (array of strings)
      - precautions (array of strings)
      - suggestedMedications (array of strings)
      - severity (string: "low", "medium", "high", or "emergency")
      - disclaimer (string)
      
      Always include a medical disclaimer about seeking professional medical advice.
      
      Symptoms: ${symptoms}
    `

    // Generate content with Gemini
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract the JSON from the response
    // The response might contain markdown code blocks or other text
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0]
      const parsedResponse = JSON.parse(jsonStr) as SymptomCheckerResponse

      // Ensure the response has the expected structure
      return {
        possibleConditions: parsedResponse.possibleConditions || [],
        precautions: parsedResponse.precautions || [],
        suggestedMedications: parsedResponse.suggestedMedications || [],
        severity: parsedResponse.severity || "low",
        disclaimer:
          parsedResponse.disclaimer || "This is not medical advice. Please consult a healthcare professional.",
      }
    }

    // Fallback if JSON parsing fails
    return {
      error: "Failed to parse the AI response. Please try again.",
    }
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return {
      error: "An error occurred while analyzing symptoms. Please try again later.",
    }
  }
}

