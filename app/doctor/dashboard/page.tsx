"use client"

import { useState } from "react"
import { useAppContext } from "@/app/providers/app-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Video, X } from "lucide-react"
import Image from "next/image"
import { PeerVideoCall } from "@/components/appointment/PeerVideoCall"
import { Appointment } from "@/types/appointment"

export default function DoctorDashboardPage() {
  const { appointments, removeAppointment, isLoading } = useAppContext()
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

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
          role="doctor"
          onEndCall={handleEndCall}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Video Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(app => app.type === 'video').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <p className="text-neutral-900 font-semibold text-lg">
                          {appointment.patient?.name || "Patient Name"}
                        </p>
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
                          <Button
                            className="gap-2"
                            onClick={(e) => {
                              e.preventDefault()
                              handleStartCall(index)
                            }}
                          >
                            <Video className="h-4 w-4" />
                            Start Consultation
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No appointments scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 