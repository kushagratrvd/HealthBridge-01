"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function AppointmentBanner() {
  const router = useRouter()

  return (
    <div className="flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
      {/* LEFT */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <Button
          onClick={() => router.push("/patient/appointments/book")}
          className="bg-white text-primary hover:bg-white/90 px-8 py-6 rounded-full mt-6 hover:scale-105 transition-all"
        >
          Create Account
        </Button>
      </div>
      {/* RIGHT */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <Image
          className="w-full absolute right-0 max-w-md"
          src="/placeholder.svg?height=400&width=300"
          alt="Doctor with patient"
          width={300}
          height={400}
        />
      </div>
    </div>
  )
}

