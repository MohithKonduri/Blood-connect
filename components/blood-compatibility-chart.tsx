"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { bloodCompatibilityChart } from "@/lib/blood-compatibility"
import { Droplet, Heart } from "lucide-react"

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]

export function BloodCompatibilityChart() {
  const [selectedGroup, setSelectedGroup] = useState("O+")

  const compatibility = bloodCompatibilityChart[selectedGroup]

  return (
    <div className="space-y-6">
      {/* Title and Subheading */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Learn About Donation</h2>
        <p className="text-lg text-muted-foreground">Select your Blood Type</p>
      </div>

      {/* Blood Group Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`p-4 rounded-lg border-2 font-bold text-lg transition-all ${
                  selectedGroup === group
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Take From (Orange Box) */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Droplet className="h-5 w-5" />
              You can take from
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compatibility.canReceive.map((group) => (
                <div key={group} className="flex items-center gap-3 p-3 bg-orange-100 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-800">
                    {group}
                  </div>
                  <span className="font-medium text-orange-800">{group}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Can Give To (Blue Box) */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Droplet className="h-5 w-5" />
              You can give to
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {compatibility.canDonate.map((group) => (
                <div key={group} className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-800">
                    {group}
                  </div>
                  <span className="font-medium text-blue-800">{group}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Illustration and Message */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Heart className="h-16 w-16 text-primary" />
              <Droplet className="h-8 w-8 text-primary absolute -top-2 -right-2" />
            </div>
          </div>
          <p className="text-lg font-semibold text-primary">
            One blood donation can save up to three lives.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
