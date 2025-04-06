"use client"

import { useState } from "react"
import { Doctor } from "@/app/providers/app-provider"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Video } from "lucide-react"

interface DoctorCardProps {
  doctor: Doctor
  compact?: boolean
}

export function DoctorCard({ doctor, compact }: DoctorCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const imageSrc = imageError || !doctor.image ? "/placeholder.svg" : doctor.image

  const handleBookAppointment = () => {
    router.push(`/patient/appointments/book/${doctor._id}`)
  }

  const handleVideoCall = () => {
    router.push(`/patient/appointments/video/${doctor._id}`)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative w-full aspect-[4/3] bg-muted">
          <Image
            src={imageSrc}
            alt={`Dr. ${doctor.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
            onError={() => setImageError(true)}
            loading="eager"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-green-600">Available</span>
            </span>
            {doctor.videoConsultation && (
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span className="text-sm text-blue-600">Video Available</span>
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg">{doctor.name}</h3>
          <p className="text-muted-foreground">{doctor.specialty}</p>
          {!compact && doctor.fees && (
            <p className="text-sm text-muted-foreground mt-1">
              ₹{doctor.fees} per consultation
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <Button
              onClick={handleBookAppointment}
              className="flex-1"
            >
              Book Appointment
            </Button>
            {doctor.videoConsultation && (
              <Button
                variant="outline"
                onClick={handleVideoCall}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Video Call
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

