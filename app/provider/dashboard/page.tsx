"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, LogOut, Star, User, ChevronDown, Bell, Video, Users, ClipboardList, AlertCircle, Bot, Brain, Stethoscope, Activity } from 'lucide-react'
import { PeerVideoCall } from "@/components/appointment/PeerVideoCall"
import { useAppContext } from "@/app/providers/app-provider"
import { Appointment } from "@/types/appointment"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import { HealthAssistant } from "@/components/ai/health-assistant"
import { HealthRiskPredictor } from "@/components/ai/health-risk-predictor"
import { TreatmentRecommender } from "@/components/ai/treatment-recommender"

export default function ProviderDashboard() {
  const [providerName, setProviderName] = useState("Dr. Michael Chen")
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const { appointments } = useAppContext()
  const router = useRouter()

  const handleStartCall = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setShowVideoCall(true)
      // Add appointmentId to URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.set('appointmentId', appointmentId)
      window.history.replaceState({}, '', newUrl.toString())
    }
  }

  const handleEndCall = () => {
    setShowVideoCall(false)
    setSelectedAppointment(null)
    // Remove appointmentId from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('appointmentId')
    newUrl.searchParams.delete('patientPeerId')
    window.history.replaceState({}, '', newUrl.toString())
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HealthBridge</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>

            <LanguageSelector />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={providerName} />
                    <AvatarFallback>MC</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{providerName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>My Schedule</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          {/* Welcome Section */}
          <section className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {providerName}</h1>
            <p className="text-muted-foreground">Here's your schedule and patient updates for today.</p>
          </section>

          {/* Quick Actions */}
          <section className="grid gap-4 md:grid-cols-4">
            <Button 
              className="h-auto py-4 gap-2"
              onClick={() => {
                const currentAppointment = appointments.find(
                  app => app.type === 'video' && app.status === 'scheduled'
                )
                if (currentAppointment) {
                  console.log("Starting call for appointment:", currentAppointment)
                  handleStartCall(currentAppointment.id)
                } else {
                  console.log("No scheduled video appointments found")
                  alert("No scheduled video appointments available")
                }
              }}
            >
              <Video className="h-5 w-5" />
              <div className="flex flex-col items-start">
                <span>Start Consultation</span>
                <span className="text-xs text-muted-foreground">Begin a virtual visit</span>
              </div>
            </Button>

            <Button className="h-auto py-4 gap-2" asChild>
              <Link href="/provider/patients">
                <Users className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Patient Records</span>
                  <span className="text-xs text-muted-foreground">Access medical histories</span>
                </div>
              </Link>
            </Button>

            <Button className="h-auto py-4 gap-2" asChild>
              <Link href="/provider/ai-tools">
                <Brain className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>AI Tools</span>
                  <span className="text-xs text-muted-foreground">Diagnostic assistance</span>
                </div>
              </Link>
            </Button>

            <Button className="h-auto py-4 gap-2" asChild>
              <Link href="/provider/availability">
                <Calendar className="h-5 w-5" />
                <div className="flex flex-col items-start">
                  <span>Manage Availability</span>
                  <span className="text-xs text-muted-foreground">Update your schedule</span>
                </div>
              </Link>
            </Button>
          </section>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Today's Schedule */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Today's Schedule</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/provider/schedule">View Full Schedule</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.filter(app => app.type === 'video' && app.status === 'scheduled').map((appointment) => (
                    <div key={appointment.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              Now
                            </Badge>
                            <h3 className="font-semibold">Virtual Consultation</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.patient.name} - {appointment.doctor.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-1"
                          onClick={() => handleStartCall(appointment.id)}
                        >
                          <Video className="h-4 w-4" />
                          Join Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Urgent Message</p>
                      <p className="text-xs text-muted-foreground">
                        Patient James Wilson reported severe chest pain. Urgent review required.
                      </p>
                      <Button variant="outline" size="sm" className="mt-1 h-7 text-xs">
                        View Message
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">AI Analysis Ready</p>
                      <p className="text-xs text-muted-foreground">
                        Vertex AI has completed analysis of Ramu Lal's latest test results.
                      </p>
                      <Button variant="outline" size="sm" className="mt-1 h-7 text-xs">
                        View Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Tools Section */}
          <section>
            <h2 className="text-xl font-bold mb-4">AI-Powered Clinical Tools</h2>
            <Tabs defaultValue="assistant" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="assistant" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span>Medical Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="risk" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Risk Prediction</span>
                </TabsTrigger>
                <TabsTrigger value="treatment" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Treatment Recommendations</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assistant">
                <div className="flex justify-center">
                  <HealthAssistant userType="provider" />
                </div>
              </TabsContent>

              <TabsContent value="risk">
                <HealthRiskPredictor patientId="patient-123" />
              </TabsContent>

              <TabsContent value="treatment">
                <TreatmentRecommender diagnosis="Hypertension" patientId="patient-123" />
              </TabsContent>
            </Tabs>
          </section>

          {/* Performance Metrics */}
          <section>
            <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Consultations This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 12%</span> from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Patient Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8/5</div>
                  <Progress value={96} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">AI Tool Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18 times</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 45%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">New Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 3</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full border-t bg-background">
        <div className="container py-6 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HealthBridge. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

