"use client"
import Image from "next/image"

// Mock data for specialties
const specialtyData = [
  { id: 1, name: "General physician", image: "/placeholder.svg?height=96&width=96" },
  { id: 2, name: "Gynecologist", image: "/placeholder.svg?height=96&width=96" },
  { id: 3, name: "Dermatologist", image: "/placeholder.svg?height=96&width=96" },
  { id: 4, name: "Pediatricians", image: "/placeholder.svg?height=96&width=96" },
  { id: 5, name: "Neurologist", image: "/placeholder.svg?height=96&width=96" },
  { id: 6, name: "Gastroenterologist", image: "/placeholder.svg?height=96&width=96" },
  { id: 7, name: "Orthopedics", image: "/placeholder.svg?height=96&width=96" },
  { id: 8, name: "Ophthalmology", image: "/placeholder.svg?height=96&width=96" },
]

export function SpecialtyMenu({
  selectedSpecialty,
  onSelectSpecialty,
}: {
  selectedSpecialty?: string | null
  onSelectSpecialty?: (specialty: string | null) => void
}) {
  const handleSpecialtyClick = (specialty: string) => {
    if (onSelectSpecialty) {
      // Toggle selection: if already selected, deselect it
      onSelectSpecialty(specialty === selectedSpecialty ? null : specialty)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800 dark:text-gray-200" id="speciality">
      <h1 className="text-3xl font-medium">Find by Specialty</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free
      </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-x-auto pb-4">
        {specialtyData.map((specialty) => (
          <div
            key={specialty.id}
            className={`flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 ${
              selectedSpecialty === specialty.name ? "text-primary" : ""
            }`}
            onClick={() => handleSpecialtyClick(specialty.name)}
          >
            <div
              className={`w-16 sm:w-24 h-16 sm:h-24 mb-2 rounded-full overflow-hidden border-2 ${
                selectedSpecialty === specialty.name ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={specialty.image || "/placeholder.svg"}
                alt={specialty.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <p>{specialty.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

