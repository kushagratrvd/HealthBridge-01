import { NextResponse } from "next/server"

// In-memory storage for peer IDs (in production, use a database)
const peerIdStore: { [key: string]: string } = {}

export async function POST(request: Request) {
  try {
    const { appointmentId, peerId } = await request.json()

    if (!appointmentId || !peerId) {
      return NextResponse.json(
        { error: "Missing appointmentId or peerId" },
        { status: 400 }
      )
    }

    // Store the peer ID for this appointment
    peerIdStore[appointmentId] = peerId

    return NextResponse.json({ success: true })
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
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Missing appointmentId' },
        { status: 400 }
      )
    }

    const peerId = peerIdStore[appointmentId]
    if (!peerId) {
      return NextResponse.json(
        { error: 'Peer ID not found for this appointment' },
        { status: 404 }
      )
    }

    return NextResponse.json({ peerId })
  } catch (error) {
    console.error('Error retrieving peer ID:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve peer ID' },
      { status: 500 }
    )
  }
} 