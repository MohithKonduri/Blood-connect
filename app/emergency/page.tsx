"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createEmergencyRequest } from "@/lib/firestore-utils"
import { sendEmail, sendEmergencyNotifications } from "@/lib/email-service"
import { searchDonors } from "@/lib/firestore-utils"

const BLOOD_GROUPS = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
const DISTRICTS = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalpally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Komaram Bheem Asifabad",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal-Malkajgiri",
  "Mulugu",
  "Nagarkurnool",
  "Nalgonda",
  "Narayanpet",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Rangareddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal Urban",
  "Warangal Rural",
  "Yadadri Bhuvanagiri"
]

export default function EmergencyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    bloodGroup: "",
    district: "",
    urgency: "high",
    description: "",
    contactName: "",
    contactPhone: "",
  })

  const resetForm = () => {
    setFormData({
      bloodGroup: "",
      district: "",
      urgency: "high",
      description: "",
      contactName: "",
      contactPhone: "",
    })
    setSuccess(false)
    setError("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.bloodGroup || !formData.district || !formData.contactName || !formData.contactPhone) {
      setError("All fields are required")
      return
    }

    setLoading(true)

    try {
      // Create emergency request in database
      await createEmergencyRequest({
        bloodGroup: formData.bloodGroup as any,
        district: formData.district,
        urgency: formData.urgency as any,
        description: formData.description,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        status: "open",
      })

      // Send email notification with emergency details
      const emailSubject = `🚨 URGENT: Blood Donation Request - ${formData.bloodGroup} needed in ${formData.district}`
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: #dc3545; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY BLOOD REQUEST</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #dc3545; margin-top: 0;">Emergency Details</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Blood Group Required:</h3>
              <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #dc3545; margin: 0; font-size: 18px; font-weight: bold;">
                ${formData.bloodGroup}
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Location:</h3>
              <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #007bff; margin: 0;">
                ${formData.district}
              </p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Urgency Level:</h3>
              <p style="background-color: ${formData.urgency === 'high' ? '#fff3cd' : formData.urgency === 'critical' ? '#f8d7da' : '#d1ecf1'}; 
                 padding: 10px; border-left: 4px solid ${formData.urgency === 'high' ? '#ffc107' : formData.urgency === 'critical' ? '#dc3545' : '#17a2b8'}; 
                 margin: 0; text-transform: uppercase; font-weight: bold;">
                ${formData.urgency}
              </p>
            </div>
            
            ${formData.description ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Description:</h3>
              <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 0; line-height: 1.5;">
                ${formData.description}
              </p>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin-bottom: 10px;">Contact Information:</h3>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
                <p style="margin: 5px 0;"><strong>Name:</strong> ${formData.contactName}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${formData.contactPhone}" style="color: #007bff; text-decoration: none;">${formData.contactPhone}</a></p>
              </div>
            </div>
            
            <div style="background-color: #e9ecef; padding: 20px; border-radius: 4px; margin-top: 30px;">
              <h3 style="color: #495057; margin-top: 0;">⚠️ Important Notes:</h3>
              <ul style="color: #495057; margin: 0; padding-left: 20px;">
                <li>Please contact the requester directly using the phone number provided</li>
                <li>Verify your blood group compatibility before donating</li>
                <li>Ensure you meet all donation requirements</li>
                <li>This is an urgent request - please respond promptly if you can help</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                This email was sent from NSS BloodConnect Emergency System<br>
                <strong>Time:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      `

      // Send email to admin/coordinators (you can modify the recipient email)
      const adminEmail = process.env.ADMIN_EMAIL || 'vignanpranadhara@gmail.com'
      
      await sendEmail({
        to: adminEmail,
        subject: emailSubject,
        html: emailHtml,
        replyTo: formData.contactPhone, // Use phone as reply-to for quick contact
      })

      // Find compatible donors and send them notifications
      try {
        const compatibleDonors = await searchDonors(formData.bloodGroup, formData.district)
        const donorEmails = compatibleDonors
          .filter(donor => donor.email && donor.isAvailable)
          .map(donor => donor.email)
          .filter(Boolean) as string[]

        if (donorEmails.length > 0) {
          console.log(`📧 Sending notifications to ${donorEmails.length} compatible donors`)
          
          const notificationResults = await sendEmergencyNotifications({
            bloodGroup: formData.bloodGroup,
            district: formData.district,
            urgency: formData.urgency,
            description: formData.description,
            contactName: formData.contactName,
            contactPhone: formData.contactPhone,
            donorEmails: donorEmails,
          })

          console.log(`✅ Emergency notifications sent: ${notificationResults.success} successful, ${notificationResults.failed} failed`)
        } else {
          console.log("ℹ️ No compatible donors found in the same district")
        }
      } catch (donorError) {
        console.error("Failed to send donor notifications:", donorError)
        // Don't fail the entire request if donor notifications fail
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to create emergency request")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-md bg-green-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">Request Submitted!</h2>
              <p className="text-green-700">
                Your emergency blood request has been posted. Available donors will be notified immediately.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="default" onClick={resetForm}>Create Another</Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-primary" />
                Emergency Blood Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Blood Group Needed</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Urgency Level</label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Provide details about the emergency..."
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground min-h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Name</label>
                  <Input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <Input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Emergency Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
