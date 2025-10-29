"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplet, MapPin, Phone, Mail } from "lucide-react"
import type { Donor } from "@/lib/types"

interface DonorCardProps {
  donor: Donor
  onContact?: (donor: Donor) => void
}

export function DonorCard({ donor, onContact }: DonorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{donor.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{donor.age} years old</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
            <Droplet className="h-4 w-4 text-primary" />
            <span className="font-bold text-primary">{donor.bloodGroup}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{donor.district}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{donor.phone}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{donor.email}</span>
        </div>

        {donor.lastDonationDate && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Last donation: {new Date(donor.lastDonationDate).toLocaleDateString()}
          </div>
        )}

        {onContact && (
          <Button onClick={() => onContact(donor)} className="w-full mt-4">
            Contact Donor
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
