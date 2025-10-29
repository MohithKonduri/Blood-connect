export interface Donor {
  id: string
  name: string
  rollNumber: string
  email: string
  phone: string
  bloodGroup: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"
  area: string
  district: string
  department: string
  year: string
  section: string
  age?: number
  birthdate?: string
  lastDonationDate?: string
  isAvailable: boolean
  donationStatus: "Available" | "Donated" | "Referred"
  createdAt: string
  updatedAt: string
}

export interface EmergencyRequest {
  id: string
  bloodGroup: "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-"
  district: string
  urgency: "low" | "medium" | "high" | "critical"
  description: string
  contactName: string
  contactPhone: string
  createdAt: string
  status: "open" | "fulfilled" | "closed"
}

export interface BloodCompatibility {
  canDonate: string[]
  canReceive: string[]
}
