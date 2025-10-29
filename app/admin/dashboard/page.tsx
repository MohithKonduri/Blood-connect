"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { BarChart3, Users, AlertCircle, TrendingUp } from "lucide-react"
import type { Donor } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalDonors: 0,
    availableDonors: 0,
    emergencyRequests: 0,
    bloodGroups: {} as Record<string, number>,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    const fetchStats = async () => {
      try {
        if (!db) {
          setError("Firebase not initialized")
          setLoading(false)
          return
        }

        // Get all donors
        const donorsSnapshot = await getDocs(collection(db, "donors"))
        const donors = donorsSnapshot.docs.map((doc) => doc.data() as Donor)

        // Count available donors
        const availableDonors = donors.filter((d) => d.isAvailable).length

        // Count by blood group
        const bloodGroups: Record<string, number> = {}
        donors.forEach((donor) => {
          bloodGroups[donor.bloodGroup] = (bloodGroups[donor.bloodGroup] || 0) + 1
        })

        // Get emergency requests
        const emergencySnapshot = await getDocs(
          query(collection(db, "emergencyRequests"), where("status", "==", "open")),
        )

        setStats({
          totalDonors: donors.length,
          availableDonors,
          emergencyRequests: emergencySnapshot.size,
          bloodGroups,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setError("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (error) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-background px-6 py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Total Donors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalDonors}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    Available Donors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{stats.availableDonors}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Emergency Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{stats.emergencyRequests}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Availability Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.totalDonors > 0 ? Math.round((stats.availableDonors / stats.totalDonors) * 100) : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blood Group Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Blood Group Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(stats.bloodGroups).map(([group, count]) => (
                    <div key={group} className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">{group}</div>
                      <div className="text-sm text-muted-foreground">{count} donors</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Use the sidebar to manage donors, view emergency requests, and export data.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
