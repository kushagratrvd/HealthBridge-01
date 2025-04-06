"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Star, MapPin, Phone, Mail, Award, Stethoscope, Building, CheckCircle, ArrowLeft, Video, Calendar } from "lucide-react"
import { useAppContext, type Doctor } from "@/app/providers/app-provider"
import { useTranslation } from "@/components/translation-provider"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { RelatedDoctors } from "@/components/appointment/related-doctors"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add dynamic rendering configuration
export const dynamic = "force-dynamic"

// Update the availableTimeSlots to use dynamic dates
// Replace the static availableTimeSlots with this dynamic implementation
export default function DoctorProfilePage({ params }: { params: { doctorId: string } }) {
  const { doctors, addAppointment, currencySymbol, isLoading: contextLoading } = useAppContext()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('video')
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  // Get available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split("T")[0]
  })

  // Mock available time slots
  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "02:00 PM", "03:00 PM", "04:00 PM"
  ]

  useEffect(() => {
    if (!contextLoading && doctors && doctors.length > 0) {
      const foundDoctor = doctors.find((doc) => doc._id === params.doctorId)
      if (foundDoctor) {
        setDoctor(foundDoctor)
        setError(null)
      } else {
        setError("Doctor not found")
      }
      setLoading(false)
    }
  }, [doctors, params.doctorId, contextLoading])

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime || !doctor) return

    try {
      addAppointment({
        doctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType
      })
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
        router.push("/patient/appointments/my-appointments")
      }, 3000)
    } catch (err) {
      setError("Failed to book appointment. Please try again.")
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  if (loading || contextLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading doctor details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{error}</h1>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Doctor not found</h1>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6 pl-0 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back to Doctors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Profile */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                      <Image src={doctor.image || "/placeholder.svg"} alt={doctor.name} fill className="object-cover" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-1">{doctor.name}</h1>
                    <p className="text-primary mb-2">{doctor.specialty}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">4.9</span>
                      </div>
                      <span className="text-sm text-muted-foreground">(124 reviews)</span>
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                        Available
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{doctor.address.line1}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>+91 {Math.floor(Math.random() * 9000000000 + 1000000000)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{doctor.name.toLowerCase().replace(/\s+/g, ".")}@healthbridge.org</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>{doctor.experience} experience</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">English</Badge>
                      <Badge variant="secondary">Hindi</Badge>
                      {doctor.name.includes("Kumar") && <Badge variant="secondary">Punjabi</Badge>}
                      {doctor.name.includes("Sharma") && <Badge variant="secondary">Hindi</Badge>}
                      {doctor.name.includes("Patel") && <Badge variant="secondary">Gujarati</Badge>}
                      {doctor.name.includes("Reddy") && <Badge variant="secondary">Telugu</Badge>}
                      {doctor.name.includes("Gupta") && <Badge variant="secondary">Bengali</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="about" className="mt-8">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>About Doctor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{doctor.about}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Education & Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Building className="h-4 w-4 text-primary" />
                          Education
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>{doctor.degree}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Residency, University Medical Center</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Fellowship, National Medical Institute</span>
                          </li>
                        </ul>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Certifications
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Board Certified in {doctor.specialty}</span>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Advanced Life Support</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">Comprehensive Evaluation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">Preventive Care</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">Specialized Treatments</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Stethoscope className="h-4 w-4 text-primary mt-0.5" />
                        <span className="text-sm">Follow-up Care</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold">4.9</div>
                        <div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">Based on 124 reviews</p>
                        </div>
                      </div>
                      <Button>Write a Review</Button>
                    </div>

                    <div className="space-y-6">
                      {/* Sample reviews */}
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              JD
                            </div>
                            <div>
                              <p className="font-medium">John Doe</p>
                              <p className="text-xs text-muted-foreground">2 weeks ago</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">
                          Dr. {doctor.name.split(" ")[1]} is an excellent doctor. He took the time to explain my
                          condition thoroughly and answered all my questions. His staff is also very professional and
                          friendly.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              MS
                            </div>
                            <div>
                              <p className="font-medium">Maria Smith</p>
                              <p className="text-xs text-muted-foreground">1 month ago</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">
                          I've been seeing Dr. {doctor.name.split(" ")[1]} for my condition for over a year now. He's
                          very knowledgeable and caring. The wait times can be a bit long sometimes, but it's worth it
                          for the quality of care.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Appointment Booking */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Appointment Type */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Appointment Type</h3>
                    <RadioGroup
                      defaultValue="video"
                      className="grid grid-cols-2 gap-4"
                      onValueChange={(value: string) => {
                        if (value === 'video' || value === 'in-person') {
                          setAppointmentType(value)
                        }
                      }}
                    >
                      <div>
                        <RadioGroupItem value="video" id="video" className="peer sr-only" />
                        <Label
                          htmlFor="video"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Video className="mb-3 h-6 w-6" />
                          Video Call
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="in-person" id="in-person" className="peer sr-only" />
                        <Label
                          htmlFor="in-person"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <MapPin className="mb-3 h-6 w-6" />
                          In-Person
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Select Date</h3>
                    <Select onValueChange={setSelectedDate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a date" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDates.map((date) => (
                          <SelectItem key={date} value={date}>
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric"
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Select Time</h3>
                    <Select onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Appointment Fee</p>
                    <p className="text-lg font-bold">
                      {currencySymbol}
                      {doctor.fees}
                    </p>
                  </div>

                  <Button className="w-full" size="lg" disabled={!selectedDate || !selectedTime} onClick={handleBookAppointment}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("book_appointment")}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By booking this appointment you agree to our{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Doctors */}
        {doctor && <RelatedDoctors docId={params.doctorId} speciality={doctor.specialty} />}

        {/* Success Popup */}
        {showPopup && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-400 rounded-lg shadow-lg p-6 text-center z-50">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-lg font-medium text-gray-800 mb-2">Appointment booked successfully!</p>
              <p className="text-sm text-gray-600">
                Your appointment with Dr. {doctor.name.split(" ")[1]} has been confirmed.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

