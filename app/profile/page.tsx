"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { User } from "firebase/auth"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Donor } from "@/lib/types"

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
const DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
]

export default function ProfilePage() {
  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    rollNumber: "",
    area: "",
    department: "",
    year: "",
    section: "",
    isAvailable: true,
    lastDonationDate: "",
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        try {
          const donorRef = doc(db, "donors", user.uid)
          const donorSnap = await getDoc(donorRef)

          if (donorSnap.exists()) {
            const donorData = { id: donorSnap.id, ...donorSnap.data() } as Donor
            setDonor(donorData)
            setFormData({
              name: donorData.name,
              phone: donorData.phone,
              age: donorData.age?.toString() || "",
              rollNumber: donorData.rollNumber,
              area: donorData.area,
              department: donorData.department,
              year: donorData.year,
              section: donorData.section,
              isAvailable: donorData.isAvailable,
              lastDonationDate: donorData.lastDonationDate || "",
            })
          }
        } catch (err) {
          setError("Error loading profile")
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSaving(true)

    try {
      const user = auth.currentUser
      if (!user) throw new Error("Not authenticated")

      const donorRef = doc(db, "donors", user.uid)
      
      // Prepare update data, filtering out undefined values
      const updateData: any = {
        name: formData.name,
        phone: formData.phone,
        rollNumber: formData.rollNumber,
        area: formData.area,
        department: formData.department,
        year: formData.year,
        section: formData.section,
        isAvailable: formData.isAvailable,
        updatedAt: new Date(),
      }
      
      // Only add age if it's not empty
      if (formData.age && formData.age.trim() !== "") {
        updateData.age = Number.parseInt(formData.age)
      }
      
      // Only add lastDonationDate if it's not empty
      if (formData.lastDonationDate && formData.lastDonationDate.trim() !== "") {
        updateData.lastDonationDate = formData.lastDonationDate
      }
      
      await updateDoc(donorRef, updateData)

      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden pb-20 lg:pb-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Edit Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input type="text" name="name" value={formData.name} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Roll Number</label>
                    <Input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="65"
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Area</label>
                    <Input type="text" name="area" value={formData.area} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <Input type="text" name="department" value={formData.department} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <Input type="text" name="year" value={formData.year} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Section</label>
                    <Input type="text" name="section" value={formData.section} onChange={handleChange} disabled={saving} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Last Donation Date</label>
                    <Input
                      type="date"
                      name="lastDonationDate"
                      value={formData.lastDonationDate}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                      disabled={saving}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium cursor-pointer">I am available to donate blood</label>
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Group:</span>
                  <span className="font-semibold">{donor?.bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">District:</span>
                  <span className="font-semibold">{donor?.district}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-semibold">{donor?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roll Number:</span>
                  <span className="font-semibold">{donor?.rollNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-semibold">{donor?.age || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Area:</span>
                  <span className="font-semibold">{donor?.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold">{donor?.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year:</span>
                  <span className="font-semibold">{donor?.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Section:</span>
                  <span className="font-semibold">{donor?.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Donation:</span>
                  <span className="font-semibold">
                    {donor?.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "Never"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-semibold ${donor?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {donor?.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-semibold">
                    {donor?.createdAt ? new Date(donor.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
