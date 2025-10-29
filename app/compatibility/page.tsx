import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BloodCompatibilityChart } from "@/components/blood-compatibility-chart"
import { BloodFacts } from "@/components/blood-facts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet } from "lucide-react"

export default function CompatibilityPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <Droplet className="h-16 w-16 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Blood Group Compatibility</h1>
              <p className="text-lg text-muted-foreground text-balance">
                Understand blood type compatibility and learn which blood groups can donate to and receive from each
                other.
              </p>
            </div>
          </div>
        </section>

        {/* Compatibility Chart */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <BloodCompatibilityChart />
          </div>
        </section>

        {/* Blood Facts */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-balance">Important Facts</h2>
            <BloodFacts />
          </div>
        </section>

        {/* Donation Guidelines */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-balance">Donation Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Before Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Get adequate sleep (7-8 hours)</p>
                  <p>• Eat a healthy meal 2-3 hours before</p>
                  <p>• Drink plenty of water</p>
                  <p>• Avoid alcohol 24 hours before</p>
                  <p>• Wear comfortable clothing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>After Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Rest for 10-15 minutes</p>
                  <p>• Drink fluids and eat snacks</p>
                  <p>• Avoid strenuous activity for 24 hours</p>
                  <p>• Keep the bandage on for 4-6 hours</p>
                  <p>• Drink extra water for 48 hours</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Blood Type Distribution */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-balance">Blood Type Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { type: "O+", percentage: "37%", description: "Most common" },
                { type: "A+", percentage: "36%", description: "Second most common" },
                { type: "B+", percentage: "8%", description: "Less common" },
                { type: "AB+", percentage: "3%", description: "Rarest positive" },
                { type: "O-", percentage: "6%", description: "Universal donor" },
                { type: "A-", percentage: "6%", description: "Can donate to A & AB" },
                { type: "B-", percentage: "2%", description: "Can donate to B & AB" },
                { type: "AB-", percentage: "1%", description: "Rarest type" },
              ].map((item) => (
                <Card key={item.type}>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{item.type}</div>
                    <div className="text-2xl font-bold mb-2">{item.percentage}</div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
