import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Droplet, Users, Search, AlertCircle, Heart } from "lucide-react"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/nss-logo.png"
                  alt="NSS Logo"
                  width={120}
                  height={120}
                  className="h-32 w-32 md:h-40 md:w-40 object-contain"
                />
              </div>
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance">Vignan's NSS BloodConnect – A Life-Saving Initiative</h1>
              </div>
              <p className="text-lg text-muted-foreground mb-8 text-balance">
                Connecting voluntary blood donors across our college to help during emergencies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/register">Register Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/admin/login">Admin Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-balance">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Register as Donor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create your profile with your blood group, district, and availability status.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Search className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Search & Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find available donors by blood group and district. Connect directly with them.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <AlertCircle className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Emergency Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Post emergency blood requests and notify available donors instantly.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Active Donors</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Lives Saved</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Emergency Support</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Make a Difference?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join our community of blood donors and help save lives in your college.
              </p>
              <Button size="lg" asChild>
                <Link href="/register">Get Started Today</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
