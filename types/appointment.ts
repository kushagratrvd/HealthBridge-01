export interface Appointment {
  id: string
  date: string
  time: string
  type: 'video' | 'in-person'
  status: 'scheduled' | 'completed' | 'cancelled'
  doctor: {
    _id: string
    name: string
    specialty: string
    image?: string
  }
  patient: {
    _id: string
    name: string
    image?: string
  }
  location?: {
    address: string
    city: string
    state: string
    zipCode: string
  }
} 