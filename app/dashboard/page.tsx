"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"
import type { User } from "firebase/auth"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, Heart, AlertCircle, Calendar } from "lucide-react"
import Link from "next/link"
import type { Donor } from "@/lib/types"
import { EmergencyContact } from "@/components/emergency-contact"

export default function DashboardPage() {
  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        try {
          // Prefer fetching by UID (new write strategy)
          const donorDocRef = doc(db, "donors", user.uid)
          const donorDocSnap = await getDoc(donorDocRef)
          if (donorDocSnap.exists()) {
            const donorData = { id: donorDocSnap.id, ...donorDocSnap.data() } as Donor
            setDonor(donorData)
            setLoading(false)
            return
          }

          // Fallback: query by email for legacy records
          console.log("Looking for donor with email:", user.email)
          const q = query(collection(db, "donors"), where("email", "==", user.email))
          const querySnapshot = await getDocs(q)
          console.log("Query result:", querySnapshot.docs.length, "documents found")
          if (!querySnapshot.empty) {
            const donorDoc = querySnapshot.docs[0]
            const donorData = { id: donorDoc.id, ...donorDoc.data() } as Donor
            console.log("Found donor data:", donorData)
            setDonor(donorData)
          } else {
            console.log("No donor found with email:", user.email)
            // No donor record → block access
            await auth.signOut()
            router.push("/register")
            return
          }
        } catch (error) {
          console.error("Error fetching donor:", error)
          await auth.signOut()
          router.push("/register")
          return
        }
      } else {
        // Not authenticated → go to login
        router.push("/login")
        return
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Welcome Back!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Thank you for being a blood donor. Your contribution saves lives in our community.
                </p>
              </CardContent>
            </Card>

            {/* Profile Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Blood Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold">{donor?.bloodGroup}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">District</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{donor?.district}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Roll Number</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{donor?.rollNumber}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Last Donation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {donor?.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "—"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${donor?.isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
                    <span className="font-semibold">{donor?.isAvailable ? "Available" : "Unavailable"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild className="w-full">
                  <Link href="/search">Find Donors</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/profile">Edit Profile</Link>
                </Button>
                <Button asChild variant="destructive" className="w-full">
                  <Link href="/emergency">🚨 Emergency Contact</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <EmergencyContact />

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    How to Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>1. Keep your profile updated with current availability</p>
                  <p>2. Respond quickly to emergency requests</p>
                  <p>3. Share your experience with others</p>
                  <p>4. Maintain good health for regular donations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Donation Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Minimum age: 18 years</p>
                  <p>• Minimum weight: 50 kg</p>
                  <p>• Wait 56 days between donations</p>
                  <p>• Eat well and stay hydrated</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
