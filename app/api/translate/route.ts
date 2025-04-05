import { VertexAI } from "@google-cloud/vertexai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { text, targetLanguage } = await req.json()

  if (!text || !targetLanguage) {
    return NextResponse.json({ error: "Missing text or targetLanguage" }, { status: 400 })
  }

  try {
    const projectId = process.env.GOOGLE_PROJECT_ID
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL

    if (!projectId || !privateKey || !clientEmail) {
      return NextResponse.json({ error: "Missing Google Cloud credentials" }, { status: 500 })
    }

    // Create credentials object
    const credentials = {
      type: "service_account",
      project_id: projectId,
      private_key: privateKey.replace(/\\n/g, '\n'),
      client_email: clientEmail
    }

    const vertexAI = new VertexAI({
      project: projectId,
      location: "us-central1",
      googleAuthOptions: {
        credentials
      }
    })

    const model = vertexAI.getGenerativeModel({
      model: "gemini-pro",
    })

    const prompt = `Translate the following text to ${getLanguageName(targetLanguage)}: ${text}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const translatedText = response.candidates?.[0]?.content?.parts?.[0]?.text || text

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation error:", error)
    // Try Gemini API as fallback
    try {
      const geminiKey = process.env.GOOGLE_GEMINI_API_KEY
      if (!geminiKey) throw new Error("Missing Gemini API key")

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${geminiKey}`,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following text to ${getLanguageName(targetLanguage)}: ${text}`
            }]
          }]
        }),
      })

      if (!response.ok) throw new Error("Gemini API request failed")

      const data = await response.json()
      const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text
      return NextResponse.json({ translatedText })
    } catch (geminiError) {
      console.error("Gemini fallback error:", geminiError)
      return NextResponse.json({ error: "Translation failed" }, { status: 500 })
    }
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

