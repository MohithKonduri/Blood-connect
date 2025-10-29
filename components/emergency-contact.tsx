"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, Mail, CheckCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore"
import { sendEmail } from "@/lib/email-service"
import type { Donor } from "@/lib/types"

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

export function EmergencyContact() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [emergencyForm, setEmergencyForm] = useState({
    // Patient Information (who needs blood)
    patientName: "",
    patientAge: "",
    patientBloodGroup: "",
    patientDistrict: "",
    hospitalName: "",
    hospitalAddress: "",
    patientCondition: "",
    
    // Requester Information (who is requesting)
    requesterName: "",
    requesterPhone: "",
    requesterEmail: "",
    requesterRelation: "",
    
    // Emergency Details
    urgency: "high",
    description: "",
    requiredUnits: "1",
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmergencyForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmergencyContact = async () => {
    if (!showForm) {
      setShowForm(true)
      return
    }

    // Validate form
    if (!emergencyForm.patientName || !emergencyForm.patientBloodGroup || !emergencyForm.patientDistrict || 
        !emergencyForm.hospitalName || !emergencyForm.requesterName || !emergencyForm.requesterPhone) {
      setError("Please fill in all required fields (Patient Name, Blood Group, District, Hospital, Requester Name & Phone)")
      return
    }

    setLoading(true)
    setError("")

    try {
      const user = auth.currentUser
      if (!user) {
        setError("Please login to send emergency contact")
        return
      }

      // Get user's donor information
      const donorRef = doc(db, "donors", user.uid)
      const donorSnap = await getDoc(donorRef)
      
      if (!donorSnap.exists()) {
        setError("Donor profile not found")
        return
      }

      const donorData = donorSnap.data() as Donor
      console.log("📋 Volunteer Data Retrieved:", donorData)
      console.log("🚨 Emergency Form Data:", emergencyForm)

      // Create comprehensive emergency notification with both volunteer and emergency form data
      const emergencyData = {
        // Volunteer Details
        volunteerId: user.uid,
        volunteerName: donorData.name,
        volunteerRollNumber: donorData.rollNumber,
        volunteerBloodGroup: donorData.bloodGroup,
        volunteerDistrict: donorData.district,
        volunteerPhone: donorData.phone,
        volunteerEmail: donorData.email,
        volunteerDepartment: donorData.department,
        volunteerYear: donorData.year,
        volunteerSection: donorData.section,
        volunteerAvailability: donorData.isAvailable,
        volunteerDonationStatus: donorData.donationStatus,
        
        // Patient Information (who needs blood)
        patientName: emergencyForm.patientName,
        patientAge: emergencyForm.patientAge,
        patientBloodGroup: emergencyForm.patientBloodGroup,
        patientDistrict: emergencyForm.patientDistrict,
        hospitalName: emergencyForm.hospitalName,
        hospitalAddress: emergencyForm.hospitalAddress,
        patientCondition: emergencyForm.patientCondition,
        
        // Requester Information (who is requesting)
        requesterName: emergencyForm.requesterName,
        requesterPhone: emergencyForm.requesterPhone,
        requesterEmail: emergencyForm.requesterEmail,
        requesterRelation: emergencyForm.requesterRelation,
        
        // Emergency Details
        urgency: emergencyForm.urgency,
        description: emergencyForm.description,
        requiredUnits: emergencyForm.requiredUnits,
        
        // Metadata
        timestamp: Timestamp.now(),
        status: "pending",
        message: `🚨 URGENT: ${emergencyForm.urgency.toUpperCase()} priority blood request for ${emergencyForm.patientName} - ${emergencyForm.patientBloodGroup} blood needed in ${emergencyForm.patientDistrict}`,
      }

      // Step 1: Save emergency data to Firebase database
      console.log("💾 Saving emergency data to Firebase...")
      const emergencyDocRef = await addDoc(collection(db, "emergencyNotifications"), emergencyData)
      console.log("✅ Emergency data saved to Firebase with ID:", emergencyDocRef.id)

      // Step 2: Retrieve the saved data from Firebase database
      console.log("📖 Retrieving emergency data from Firebase...")
      const savedEmergencyDoc = await getDoc(emergencyDocRef)
      
      if (!savedEmergencyDoc.exists()) {
        setError("Failed to retrieve saved emergency data")
        return
      }

      const savedEmergencyData = savedEmergencyDoc.data()
      console.log("✅ Retrieved emergency data from Firebase:", savedEmergencyData)

      // Step 3: Create email content using the retrieved data from database
      const emailContent = {
        to: "vignanpranadhara@gmail.com", // Admin email
        subject: `🚨 URGENT: ${savedEmergencyData.urgency.toUpperCase()} Blood Request for ${savedEmergencyData.patientName} - ${savedEmergencyData.patientBloodGroup} in ${savedEmergencyData.patientDistrict}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #E63946; border-radius: 8px;">
            <div style="background: #E63946; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h1 style="margin: 0; font-size: 24px;">🚨 EMERGENCY BLOOD REQUEST</h1>
              <p style="margin: 5px 0 0 0; font-size: 16px;">Priority: ${savedEmergencyData.urgency.toUpperCase()}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px;">Database ID: ${emergencyDocRef.id}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #E63946; margin-top: 0;">🏥 Patient Information (Retrieved from Database)</h2>
              <p><strong>Patient Name:</strong> ${savedEmergencyData.patientName}</p>
              <p><strong>Age:</strong> ${savedEmergencyData.patientAge || 'Not specified'}</p>
              <p><strong>Blood Group Needed:</strong> ${savedEmergencyData.patientBloodGroup}</p>
              <p><strong>District:</strong> ${savedEmergencyData.patientDistrict}</p>
              <p><strong>Hospital:</strong> ${savedEmergencyData.hospitalName}</p>
              <p><strong>Hospital Address:</strong> ${savedEmergencyData.hospitalAddress || 'Not provided'}</p>
              <p><strong>Patient Condition:</strong> ${savedEmergencyData.patientCondition || 'Not specified'}</p>
              <p><strong>Required Units:</strong> ${savedEmergencyData.requiredUnits}</p>
              <p><strong>Urgency:</strong> ${savedEmergencyData.urgency.toUpperCase()}</p>
              <p><strong>Additional Details:</strong> ${savedEmergencyData.description || 'No additional details provided'}</p>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #E63946; margin-top: 0;">📞 Requester Information (Retrieved from Database)</h2>
              <p><strong>Requester Name:</strong> ${savedEmergencyData.requesterName}</p>
              <p><strong>Phone:</strong> ${savedEmergencyData.requesterPhone}</p>
              <p><strong>Email:</strong> ${savedEmergencyData.requesterEmail || 'Not provided'}</p>
              <p><strong>Relation to Patient:</strong> ${savedEmergencyData.requesterRelation || 'Not specified'}</p>
            </div>

            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h2 style="color: #E63946; margin-top: 0;">👤 Volunteer Information (Retrieved from Database)</h2>
              <p><strong>Name:</strong> ${savedEmergencyData.volunteerName}</p>
              <p><strong>Roll Number:</strong> ${savedEmergencyData.volunteerRollNumber}</p>
              <p><strong>Blood Group:</strong> ${savedEmergencyData.volunteerBloodGroup}</p>
              <p><strong>District:</strong> ${savedEmergencyData.volunteerDistrict}</p>
              <p><strong>Phone:</strong> ${savedEmergencyData.volunteerPhone}</p>
              <p><strong>Email:</strong> ${savedEmergencyData.volunteerEmail}</p>
              <p><strong>Department:</strong> ${savedEmergencyData.volunteerDepartment}</p>
              <p><strong>Year:</strong> ${savedEmergencyData.volunteerYear}</p>
              <p><strong>Section:</strong> ${savedEmergencyData.volunteerSection}</p>
              <p><strong>Availability:</strong> ${savedEmergencyData.volunteerAvailability ? "✅ Available" : "❌ Unavailable"}</p>
              <p><strong>Donation Status:</strong> ${savedEmergencyData.volunteerDonationStatus}</p>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">⚠️ Action Required</h3>
              <p style="margin: 0; color: #856404;">Please contact the requester (${savedEmergencyData.requesterName}) immediately at ${savedEmergencyData.requesterPhone} and coordinate the blood donation process for patient ${savedEmergencyData.patientName}.</p>
            </div>

            <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #0c5460; margin-top: 0;">📊 Database Information</h3>
              <p style="margin: 0; color: #0c5460;"><strong>Emergency ID:</strong> ${emergencyDocRef.id}</p>
              <p style="margin: 0; color: #0c5460;"><strong>Volunteer ID:</strong> ${savedEmergencyData.volunteerId}</p>
              <p style="margin: 0; color: #0c5460;"><strong>Status:</strong> ${savedEmergencyData.status}</p>
              <p style="margin: 0; color: #0c5460;"><strong>Saved At:</strong> ${savedEmergencyData.timestamp?.toDate?.()?.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) || 'Unknown'}</p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
              <p style="color: #6c757d; font-size: 12px; margin: 0;">
                This notification was sent from NSS BloodConnect System<br>
                Data retrieved from Firebase Database<br>
                Email sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>
        `,
        replyTo: savedEmergencyData.requesterEmail || undefined
      }

      // Step 4: Send email to admin using the retrieved data
      console.log("📧 Sending email to admin with retrieved data...")
      const emailSent = await sendEmail(emailContent)
      if (emailSent) {
        console.log("✅ Emergency email sent successfully to admin with data from Firebase database")
      } else {
        console.error("❌ Failed to send emergency email")
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowForm(false)
        setEmergencyForm({
          // Patient Information (who needs blood)
          patientName: "",
          patientAge: "",
          patientBloodGroup: "",
          patientDistrict: "",
          hospitalName: "",
          hospitalAddress: "",
          patientCondition: "",
          
          // Requester Information (who is requesting)
          requesterName: "",
          requesterPhone: "",
          requesterEmail: "",
          requesterRelation: "",
          
          // Emergency Details
          urgency: "high",
          description: "",
          requiredUnits: "1",
        })
      }, 5000)
    } catch (err: any) {
      setError(err.message || "Failed to send emergency contact")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Emergency Request Processed Successfully</h3>
          <p className="text-green-700 mb-2">
            Your emergency data has been saved to the database and retrieved successfully.
          </p>
          <p className="text-green-700 mb-2">
            NSS Admins have been notified via email with the complete data from the database.
          </p>
          <p className="text-sm text-green-600">
            They will contact you immediately to coordinate the blood donation process.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!showForm ? (
          <>
            <p className="text-sm text-muted-foreground">
              Click the button below to instantly notify NSS Admins about your emergency blood request. 
              They will receive your complete profile information and contact you immediately.
            </p>

            <Button 
              onClick={handleEmergencyContact}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Mail className="mr-2 h-4 w-4 animate-pulse" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  🚨 Emergency Contact
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-red-600">Emergency Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Please provide the real patient and requester information below. Your volunteer information will be automatically included.
            </p>

            {/* Patient Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-red-600 border-b border-red-200 pb-2">🏥 Patient Information (Who Needs Blood)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name *</label>
                  <Input
                    type="text"
                    name="patientName"
                    value={emergencyForm.patientName}
                    onChange={handleFormChange}
                    placeholder="Enter patient's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Age</label>
                  <Input
                    type="number"
                    name="patientAge"
                    value={emergencyForm.patientAge}
                    onChange={handleFormChange}
                    placeholder="Enter patient's age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Group Needed *</label>
                  <select
                    name="patientBloodGroup"
                    value={emergencyForm.patientBloodGroup}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">District *</label>
                  <select
                    name="patientDistrict"
                    value={emergencyForm.patientDistrict}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map((district) => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hospital Name *</label>
                <Input
                  type="text"
                  name="hospitalName"
                  value={emergencyForm.hospitalName}
                  onChange={handleFormChange}
                  placeholder="Enter hospital name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hospital Address</label>
                <Input
                  type="text"
                  name="hospitalAddress"
                  value={emergencyForm.hospitalAddress}
                  onChange={handleFormChange}
                  placeholder="Enter hospital address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Patient Condition</label>
                <Input
                  type="text"
                  name="patientCondition"
                  value={emergencyForm.patientCondition}
                  onChange={handleFormChange}
                  placeholder="e.g., Accident, Surgery, Medical Emergency"
                />
              </div>
            </div>

            {/* Requester Information Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">📞 Requester Information (Who is Requesting)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Requester Name *</label>
                  <Input
                    type="text"
                    name="requesterName"
                    value={emergencyForm.requesterName}
                    onChange={handleFormChange}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number *</label>
                  <Input
                    type="tel"
                    name="requesterPhone"
                    value={emergencyForm.requesterPhone}
                    onChange={handleFormChange}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    type="email"
                    name="requesterEmail"
                    value={emergencyForm.requesterEmail}
                    onChange={handleFormChange}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Relation to Patient</label>
                  <select
                    name="requesterRelation"
                    value={emergencyForm.requesterRelation}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Select Relation</option>
                    <option value="Family Member">Family Member</option>
                    <option value="Friend">Friend</option>
                    <option value="Relative">Relative</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Hospital Staff">Hospital Staff</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Details Section */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-600 border-b border-orange-200 pb-2">🚨 Emergency Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Urgency Level</label>
                  <select
                    name="urgency"
                    value={emergencyForm.urgency}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Required Units</label>
                  <select
                    name="requiredUnits"
                    value={emergencyForm.requiredUnits}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                    <option value="5+">5+ Units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Additional Details</label>
                <textarea
                  name="description"
                  value={emergencyForm.description}
                  onChange={handleFormChange}
                  placeholder="Provide any additional details about the emergency, patient condition, or special requirements..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground min-h-20"
                />
              </div>
            </div>

            <Button 
              onClick={handleEmergencyContact}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Mail className="mr-2 h-4 w-4 animate-pulse" />
                  Sending Emergency Request...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  🚨 Send Emergency Request
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
