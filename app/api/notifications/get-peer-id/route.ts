import { NextResponse } from "next/server"

// Use the same in-memory storage from send-peer-id
const peerIdStore: { [key: string]: string } = {}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const appointmentId = searchParams.get('appointmentId')

    if (!appointmentId) {
      return NextResponse.json(
        { error: "Missing appointmentId" },
        { status: 400 }
      )
    }

    const peerId = peerIdStore[appointmentId]
    if (!peerId) {
      return NextResponse.json(
        { error: "Peer ID not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ peerId })
  } catch (error) {
    console.error("Error retrieving peer ID:", error)
    return NextResponse.json(
      { error: "Failed to retrieve peer ID" },
      { status: 500 }
    )
  }
} 