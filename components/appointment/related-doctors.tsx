"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppContext, type Doctor } from "@/app/providers/app-provider"
import { DoctorCard } from "./doctor-card"
import { Button } from "@/components/ui/button"

interface RelatedDoctorsProps {
  docId: string
  specialty: string
}

export function RelatedDoctors({ docId, specialty }: RelatedDoctorsProps) {
  const { doctors } = useAppContext()
  const router = useRouter()
  const [relatedDocs, setRelatedDocs] = useState<Doctor[]>([])

  useEffect(() => {
    if (doctors && doctors.length > 0 && specialty) {
      const relatedDoctors = doctors.filter((doc) => doc.specialty === specialty && doc._id !== docId)
      setRelatedDocs(relatedDoctors.slice(0, 5))
    }
  }, [doctors, specialty, docId])

  if (relatedDocs.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">Simply browse through our extensive list of trusted doctors.</p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relatedDocs.map((doctor) => (
          <DoctorCard key={doctor._id} doctor={doctor} compact />
        ))}
      </div>
      <Button
        onClick={() => router.push("/patient/appointments/book")}
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-blue-100"
      >
        More
      </Button>
    </div>
  )
}

