"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DonorSearchForm } from "@/components/donor-search-form"
import { DonorCard } from "@/components/donor-card"
import { searchDonors } from "@/lib/firestore-utils"
import type { Donor } from "@/lib/types"

export default function SearchPage() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (bloodGroup: string, district: string) => {
    setLoading(true)
    try {
      const results = await searchDonors(bloodGroup || undefined, district || undefined)
      setDonors(results)
      setSearched(true)
    } catch (error) {
      console.error("Search error:", error)
      setDonors([])
    } finally {
      setLoading(false)
    }
  }

  const handleContact = (donor: Donor) => {
    // Open email client or show contact modal
    window.location.href = `mailto:${donor.email}?subject=Blood Donation Request`
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden pb-20 lg:pb-0">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <DonorSearchForm onSearch={handleSearch} loading={loading} />

            {searched && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {donors.length} Donor{donors.length !== 1 ? "s" : ""} Found
                </h2>

                {donors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donors.map((donor) => (
                      <DonorCard key={donor.id} donor={donor} onContact={handleContact} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No donors found matching your criteria.</p>
                    <p className="text-muted-foreground text-sm mt-2">Try adjusting your search filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
