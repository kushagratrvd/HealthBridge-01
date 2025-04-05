import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) {
      throw new Error('News API key is not configured')
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=(healthcare OR medical OR medicine OR doctor OR hospital OR treatment OR disease OR health) AND india&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
} 