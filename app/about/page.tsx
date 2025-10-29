import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Target, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">About NSS BloodConnect</h1>
              <p className="text-lg text-muted-foreground text-balance">
                A social-impact platform dedicated to connecting voluntary blood donors across campus.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">About NSS</h2>
                <p className="text-muted-foreground mb-4">
                  The National Service Scheme (NSS) is a voluntary service program that aims to develop students' 
                  personality through community service. NSS volunteers work towards the welfare of society and 
                  contribute to nation-building through various social service activities.
                </p>
                <p className="text-muted-foreground mb-4">
                  Our mission is to create awareness about voluntary blood donation and establish a robust network 
                  of blood donors within our college community. We believe that every drop of blood can save a life, 
                  and we're committed to making blood donation accessible and convenient.
                </p>
                <p className="text-muted-foreground">
                  Through our platform, we connect donors with those in need, manage donor availability, and respond to
                  emergencies with speed and efficiency.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <Heart className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Compassion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">We care deeply about saving lives.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Target className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Purpose</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Every action has a meaningful impact.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Together we are stronger.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Zap className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Speed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Quick response in emergencies.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-32 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We maintain clear communication about donor availability and emergency requests.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our platform is designed to be easy to use for all members of the college community.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We ensure 24/7 support for emergency blood requests and donor management.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Importance of Blood Donation */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Importance of Voluntary Blood Donation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Why Blood Donation Matters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Blood cannot be manufactured - it can only come from donors</p>
                  <p>• Every 2 seconds, someone needs blood</p>
                  <p>• One donation can save up to three lives</p>
                  <p>• Blood has a limited shelf life and must be constantly replenished</p>
                  <p>• Emergency situations require immediate blood availability</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Benefits for Donors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Reduces risk of heart disease and stroke</p>
                  <p>• Helps maintain healthy iron levels</p>
                  <p>• Stimulates production of new blood cells</p>
                  <p>• Provides free health screening</p>
                  <p>• Creates a sense of fulfillment and purpose</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 md:py-32 bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Join hands with us to save lives</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Become a part of our life-saving mission. Register as a blood donor today and make a difference 
                in someone's life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/register">Register as Donor</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/compatibility">Learn About Blood Groups</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Powered by NSS Volunteers</h2>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg text-muted-foreground mb-6">
                NSS BloodConnect is a student-led initiative under the National Service Scheme (NSS), dedicated to
                social service and community welfare at Vignan Institute of Technology and Science.
              </p>
              <p className="text-muted-foreground">
                Our team of passionate volunteers works tirelessly to ensure that blood donation is accessible to
                everyone in our college community. We believe in the power of unity and service to make a positive 
                impact on society.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
