import { NextResponse } from "next/server"
import { headers } from 'next/headers'

// In-memory storage for peer IDs (in production, use a database)
const peerIdStore: { [key: string]: string } = {}

export async function POST(request: Request) {
  try {
    // Handle CORS
    const origin = request.headers.get('origin') || ''
    const headersList = headers()
    
    // Add CORS headers
    const responseHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: responseHeaders
      })
    }

    const { appointmentId, peerId } = await request.json()

    if (!appointmentId || !peerId) {
      return NextResponse.json(
        { error: "Missing appointmentId or peerId" },
        { 
          status: 400,
          headers: responseHeaders
        }
      )
    }

    // Store the peer ID for this appointment
    peerIdStore[appointmentId] = peerId
    console.log(`Stored peer ID ${peerId} for appointment ${appointmentId}`)

    return NextResponse.json(
      { success: true },
      { headers: responseHeaders }
    )
  } catch (error) {
    console.error("Error storing peer ID:", error)
    return NextResponse.json(
      { error: "Failed to store peer ID" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Handle CORS
    const origin = request.headers.get('origin') || ''
    const headersList = headers()
    
    // Add CORS headers
    const responseHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Missing appointmentId' },
        { 
          status: 400,
          headers: responseHeaders
        }
      )
    }

    const peerId = peerIdStore[appointmentId]
    console.log(`Retrieved peer ID for appointment ${appointmentId}:`, peerId || 'not found')

    if (!peerId) {
      return NextResponse.json(
        { error: 'Peer ID not found for this appointment' },
        { 
          status: 404,
          headers: responseHeaders
        }
      )
    }

    return NextResponse.json(
      { peerId },
      { headers: responseHeaders }
    )
  } catch (error) {
    console.error('Error retrieving peer ID:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve peer ID' },
      { status: 500 }
    )
  }
} 