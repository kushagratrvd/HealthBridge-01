"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"
import { Peer } from "peerjs"
import { useSearchParams, useRouter } from "next/navigation"

interface PeerVideoCallProps {
  appointmentId: string
  role: 'doctor' | 'patient'
  onEndCall: () => void
}

export function PeerVideoCall({ appointmentId, role, onEndCall }: PeerVideoCallProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [peerId, setPeerId] = useState<string>("")
  const [remotePeerId, setRemotePeerId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt')

  const peerInstance = useRef<Peer | null>(null)
  const myVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const myStreamRef = useRef<MediaStream | null>(null)
  const connectionAttempts = useRef(0)
  const maxConnectionAttempts = 30 // 30 seconds

  // Add new state for video loading
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check if we're in a secure context
        if (typeof window !== 'undefined' && !window.isSecureContext) {
          throw new Error('Media devices require a secure context (HTTPS or localhost)')
        }

        const permissions = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        permissions.getTracks().forEach(track => track.stop())
        setPermissionStatus('granted')
        return true
      } catch (err: any) {
        console.error('Permission check failed:', err)
        setPermissionStatus('denied')
        if (err.name === 'NotAllowedError') {
          setError('Camera and microphone access was denied. Please allow access in your browser settings.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera or microphone found. Please check your device.')
        } else if (err.name === 'NotReadableError' || err.name === 'AbortError') {
          setError('Could not access your camera/microphone. Please make sure no other application is using them.')
        } else if (err.message.includes('secure context')) {
          setError('This feature requires a secure connection (HTTPS). Please check your connection.')
        } else {
          setError('Failed to access media devices. Please check your permissions and try again.')
        }
        setIsConnecting(false)
        return false
      }
    }

    const initializePeer = async () => {
      try {
        setIsConnecting(true)
        setError(null)

        const hasPermissions = await checkPermissions()
        if (!hasPermissions) return

        // Initialize PeerJS with enhanced configuration
        const peer = new Peer({
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:stun3.l.google.com:19302' },
              { urls: 'stun:stun4.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ],
            iceTransportPolicy: 'all',
            sdpSemantics: 'unified-plan'
          },
          debug: 3,
          secure: true
        })
        peerInstance.current = peer

        peer.on('open', async (id) => {
          console.log('My peer ID is:', id)
          setPeerId(id)

          // Get local media stream with explicit constraints
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: {
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                facingMode: 'user',
                frameRate: { ideal: 30, max: 60 }
              },
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
              }
            })
            
            // Ensure stream is valid
            if (stream.getVideoTracks().length === 0) {
              throw new Error('No video track available')
            }

            myStreamRef.current = stream
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = stream
              try {
                await myVideoRef.current.play()
              } catch (err) {
                console.error('Error playing local video:', err)
              }
            }

            // If we're the patient, update the URL with our peer ID
            if (role === 'patient') {
              const newUrl = new URL(window.location.href)
              newUrl.searchParams.set('patientPeerId', id)
              window.history.replaceState({}, '', newUrl.toString())
              console.log('Patient: Set peer ID in URL:', id)
            }
            // If we're the doctor, look for the patient's peer ID in the URL
            else if (role === 'doctor') {
              const checkForPatientPeerId = () => {
                const patientPeerId = searchParams.get('patientPeerId')
                console.log('Doctor: Checking for patient peer ID:', patientPeerId)
                if (patientPeerId) {
                  setRemotePeerId(patientPeerId)
                  if (myStreamRef.current) {
                    console.log('Doctor: Initiating call to patient:', patientPeerId)
                    const call = peer.call(patientPeerId, myStreamRef.current)
                    handleCall(call)
                  }
                } else if (connectionAttempts.current < maxConnectionAttempts) {
                  connectionAttempts.current++
                  console.log('Doctor: Retrying peer ID check, attempt:', connectionAttempts.current)
                  setTimeout(checkForPatientPeerId, 1000)
                } else {
                  setError('Could not connect to patient. Please try again.')
                  setIsConnecting(false)
                }
              }
              checkForPatientPeerId()
            }

            setIsConnecting(false)
          } catch (err: any) {
            console.error('Failed to get media devices:', err)
            setError(err.message || 'Failed to access camera/microphone. Please check your permissions.')
            setIsConnecting(false)
          }
        })

        // Handle incoming calls with better error handling
        peer.on('call', (call) => {
          console.log('Received incoming call from:', call.peer)
          if (myStreamRef.current) {
            call.answer(myStreamRef.current)
            handleCall(call)
          } else {
            console.error('No local stream available to answer call')
            setError('Failed to establish video call. Please refresh and try again.')
          }
        })

        peer.on('error', (err) => {
          console.error('PeerJS error:', err)
          setError(`Connection error: ${err.type}. Please try again.`)
          setIsConnecting(false)
        })

        peer.on('disconnected', () => {
          console.log('Peer disconnected')
          setError('Connection lost. Please refresh the page to try again.')
        })

        return () => {
          if (myStreamRef.current) {
            myStreamRef.current.getTracks().forEach(track => {
              track.stop()
              console.log('Stopped track:', track.kind)
            })
          }
          peer.destroy()
          console.log('Cleaned up peer connection')
        }
      } catch (err: any) {
        console.error('Failed to initialize peer:', err)
        setError(err.message || 'Failed to initialize video call')
        setIsConnecting(false)
      }
    }

    initializePeer()
  }, [appointmentId, role, searchParams])

  useEffect(() => {
    const setupVideo = async () => {
      if (myVideoRef.current) {
        try {
          await myVideoRef.current.play()
          setIsVideoLoading(false)
        } catch (err) {
          console.error('Error playing video:', err)
        }
      }
    }

    if (myVideoRef.current && myVideoRef.current.srcObject) {
      setupVideo()
    }
  }, [])

  const handleCall = (call: any) => {
    call.on('stream', (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream
      }
    })

    call.on('close', () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null
      }
    })
  }

  const toggleMute = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleEndCall = () => {
    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach(track => track.stop())
    }
    if (peerInstance.current) {
      peerInstance.current.destroy()
    }
    onEndCall()
  }

  const handleVideoPlay = async (videoElement: HTMLVideoElement) => {
    try {
      await videoElement.play()
    } catch (err) {
      console.error('Error playing video:', err)
    }
  }

  if (isConnecting) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="text-lg text-muted-foreground">
            {permissionStatus === 'prompt' ? 'Please allow camera and microphone access...' : 'Connecting to video call...'}
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto p-4">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleEndCall}>
            Back to Appointments
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => handleVideoPlay(myVideoRef.current!)}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            You {isVideoOff && "(Video Off)"}
          </div>
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gray-800 rounded-full p-4">
                <VideoOff size={48} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            onLoadedMetadata={() => handleVideoPlay(remoteVideoRef.current!)}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
            {role === 'doctor' ? 'Patient' : 'Doctor'}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant={isMuted ? "outline" : "default"}
          onClick={toggleMute}
          className="gap-2"
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isMuted ? "Unmute" : "Mute"}
        </Button>
        <Button
          variant={isVideoOff ? "outline" : "default"}
          onClick={toggleVideo}
          className="gap-2"
        >
          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          {isVideoOff ? "Start Video" : "Stop Video"}
        </Button>
        <Button
          variant="destructive"
          onClick={handleEndCall}
          className="gap-2"
        >
          <PhoneOff className="h-4 w-4" />
          End Call
        </Button>
      </div>
    </Card>
  )
} 