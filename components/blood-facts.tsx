import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Droplet, Clock, AlertCircle } from "lucide-react"

export function BloodFacts() {
  const facts = [
    {
      icon: Droplet,
      title: "Blood Types",
      description: "There are 8 main blood types: O+, O-, A+, A-, B+, B-, AB+, and AB-.",
    },
    {
      icon: Heart,
      title: "Universal Donor",
      description: "O- blood type is the universal donor and can be given to anyone.",
    },
    {
      icon: Clock,
      title: "Donation Frequency",
      description: "You can donate blood every 56 days (8 weeks) to allow your body to replenish.",
    },
    {
      icon: AlertCircle,
      title: "Health Requirements",
      description: "Donors must be at least 18 years old, weigh 50kg, and be in good health.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {facts.map((fact, index) => {
        const Icon = fact.icon
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                {fact.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{fact.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
