"use client"

import { useAppContext } from "@/app/providers/app-provider"
import { useTranslation } from "@/components/translation-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Video, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { PeerVideoCall } from "@/components/appointment/PeerVideoCall"
import { Appointment } from "@/types/appointment"

// Add dynamic rendering configuration
export const dynamic = "force-dynamic"

export default function MyAppointmentsPage() {
  const { appointments, removeAppointment, isLoading } = useAppContext()
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const handleRemoveAppointment = (index: number) => {
    removeAppointment(index)
    setConfirmDelete(null)
  }

  const handleStartCall = (index: number) => {
    setSelectedAppointment(appointments[index])
    setShowVideoCall(true)
  }

  const handleEndCall = () => {
    setShowVideoCall(false)
    setSelectedAppointment(null)
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  // If there's an active call, show the video call component
  if (showVideoCall && selectedAppointment) {
    return (
      <div className="container max-w-4xl py-8">
        <PeerVideoCall
          appointmentId={selectedAppointment.id}
          role="patient"
          onEndCall={handleEndCall}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">My Appointments</h1>

      {appointments && appointments.length > 0 ? (
        <div className="space-y-6">
          {appointments.map((appointment, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-[1fr_3fr] sm:flex sm:gap-6 p-4 border-b">
                  <div className="aspect-square relative w-32 bg-indigo-100 rounded-md overflow-hidden">
                    <Image
                      src={appointment.doctor.image || "/placeholder.svg"}
                      alt={appointment.doctor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-sm text-zinc-700">
                    <p className="text-neutral-900 font-semibold text-lg">{appointment.doctor.name}</p>
                    <p className="text-primary">{appointment.doctor.specialty}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.doctor.address.line1}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex flex-col gap-2 justify-end mt-4 sm:mt-0">
                    {appointment.type === 'video' && (
                      <Button className="gap-2" onClick={() => handleStartCall(index)}>
                        <Video className="h-4 w-4" />
                        Join Consultation
                      </Button>
                    )}
                    {confirmDelete === index ? (
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveAppointment(index)}>
                          Confirm
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2"
                        onClick={() => setConfirmDelete(index)}
                      >
                        <X className="h-4 w-4" />
                        Cancel Appointment
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">You don't have any appointments scheduled yet.</p>
            <Button asChild>
              <Link href="/patient/appointments/book">Book an Appointment</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

