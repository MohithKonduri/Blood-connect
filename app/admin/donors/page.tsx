"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Download, Droplet, MapPin, Search, Filter } from "lucide-react"
import type { Donor } from "@/lib/types"

export default function AdminDonorsPage() {
  const router = useRouter()
  const [donors, setDonors] = useState<Donor[]>([])
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [bloodGroupFilter, setBloodGroupFilter] = useState("")
  const [districtFilter, setDistrictFilter] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("")

  const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
  const DISTRICTS = [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar",
    "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool",
    "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
    "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet",
    "Vikarabad", "Wanaparthy", "Warangal Urban", "Warangal Rural", "Yadadri Bhuvanagiri"
  ]

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    const fetchDonors = async () => {
      try {
        const donorsSnapshot = await getDocs(collection(db, "donors"))
        const donorsList = donorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Donor)
        setDonors(donorsList)
        setFilteredDonors(donorsList)
      } catch (error) {
        console.error("Error fetching donors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [router])

  // Filter donors based on search and filter criteria
  useEffect(() => {
    let filtered = donors

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donor =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Blood group filter
    if (bloodGroupFilter) {
      filtered = filtered.filter(donor => donor.bloodGroup === bloodGroupFilter)
    }

    // District filter
    if (districtFilter) {
      filtered = filtered.filter(donor => donor.district === districtFilter)
    }

    // Availability filter
    if (availabilityFilter) {
      const isAvailable = availabilityFilter === "available"
      filtered = filtered.filter(donor => donor.isAvailable === isAvailable)
    }

    setFilteredDonors(filtered)
  }, [donors, searchTerm, bloodGroupFilter, districtFilter, availabilityFilter])

  const handleExportCSV = () => {
    const headers = ["Name", "Roll Number", "Email", "Phone", "Blood Group", "Area", "District", "Department", "Year", "Section", "Last Donation", "Available", "Status"]
    const rows = filteredDonors.map((donor) => [
      donor.name,
      donor.rollNumber,
      donor.email,
      donor.phone,
      donor.bloodGroup,
      donor.area,
      donor.district,
      donor.department,
      donor.year,
      donor.section,
      donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "",
      donor.isAvailable ? "Yes" : "No",
      donor.donationStatus,
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donors-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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
        <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Donors</h1>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search and Filter Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter Donors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or roll number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Group</label>
                    <select
                      value={bloodGroupFilter}
                      onChange={(e) => setBloodGroupFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">All Blood Groups</option>
                      {BLOOD_GROUPS.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">District</label>
                    <select
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">All Districts</option>
                      {DISTRICTS.map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Availability</label>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">All</option>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donors Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Donors ({filteredDonors.length} of {donors.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Roll Number</th>
                        <th className="text-left py-3 px-4 font-semibold">Email</th>
                        <th className="text-left py-3 px-4 font-semibold">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold">Blood Group</th>
                        <th className="text-left py-3 px-4 font-semibold">District</th>
                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                        <th className="text-left py-3 px-4 font-semibold">Year</th>
                        <th className="text-left py-3 px-4 font-semibold">Last Donation</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDonors.map((donor) => (
                        <tr key={donor.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{donor.name}</td>
                          <td className="py-3 px-4 font-mono text-sm">{donor.rollNumber}</td>
                          <td className="py-3 px-4 text-muted-foreground">{donor.email}</td>
                          <td className="py-3 px-4">{donor.phone}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Droplet className="h-4 w-4 text-primary" />
                              <span className="font-semibold">{donor.bloodGroup}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {donor.district}
                            </div>
                          </td>
                          <td className="py-3 px-4">{donor.department}</td>
                          <td className="py-3 px-4">{donor.year}</td>
                          <td className="py-3 px-4">{donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : "—"}</td>
                          <td className="py-3 px-4">
                            <div
                              className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${
                                donor.isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${donor.isAvailable ? "bg-green-600" : "bg-gray-600"}`}
                              />
                              {donor.isAvailable ? "Available" : "Unavailable"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
