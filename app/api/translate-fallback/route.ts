import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (!targetLanguage) {
      return NextResponse.json({ error: "Target language is required" }, { status: 400 })
    }

    // Get the API key from environment variables
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY

    if (!apiKey) {
      console.error("Missing Gemini API key")
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // Initialize the Google Generative AI with your API key
    const genAI = new GoogleGenerativeAI(apiKey)

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Create the prompt for translation
    const prompt = `Translate the following text to ${getLanguageName(targetLanguage)}. 
    Only return the translated text, nothing else.
    
    Text to translate: "${text}"`

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.text().trim()

    return NextResponse.json({
      success: true,
      translatedText,
    })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to translate text",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Helper function to get the full language name from code
function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    es: "Spanish",
    fr: "French",
    de: "German",
  }

  return languages[code] || code
}

