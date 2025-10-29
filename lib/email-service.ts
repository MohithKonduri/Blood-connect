// Email service utility for sending emergency notifications
// This sends emails using the Gmail SMTP server

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // In a client component, we need to call an API route
    console.log("📧 Sending email to:", emailData.to)
    
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 16000) // 16s client timeout

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    const result = await response.json()
    
    if (result.success) {
      console.log("✅ Email sent successfully")
      return true
    } else {
      console.error("❌ Email sending failed:", result.error)
      return false
    }
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

// Interface for emergency notification data
export interface EmergencyNotificationData {
  bloodGroup: string
  district: string
  urgency: string
  description: string
  contactName: string
  contactPhone: string
  donorEmails: string[]
}

// Function to send emergency notifications to multiple donors
export async function sendEmergencyNotifications(data: EmergencyNotificationData): Promise<{ success: number; failed: number }> {
  const results = { success: 0, failed: 0 }
  
  const emailSubject = `🚨 URGENT: Blood Donation Request - ${data.bloodGroup} needed in ${data.district}`
  
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
            ${data.bloodGroup}
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Location:</h3>
          <p style="background-color: #f8f9fa; padding: 10px; border-left: 4px solid #007bff; margin: 0;">
            ${data.district}
          </p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Urgency Level:</h3>
          <p style="background-color: ${data.urgency === 'high' ? '#fff3cd' : data.urgency === 'critical' ? '#f8d7da' : '#d1ecf1'}; 
             padding: 10px; border-left: 4px solid ${data.urgency === 'high' ? '#ffc107' : data.urgency === 'critical' ? '#dc3545' : '#17a2b8'}; 
             margin: 0; text-transform: uppercase; font-weight: bold;">
            ${data.urgency}
          </p>
        </div>
        
        ${data.description ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Description:</h3>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 0; line-height: 1.5;">
            ${data.description}
          </p>
        </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; margin-bottom: 10px;">Contact Information:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Name:</strong> ${data.contactName}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${data.contactPhone}" style="color: #007bff; text-decoration: none;">${data.contactPhone}</a></p>
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

  // Send emails to all donors
  for (const donorEmail of data.donorEmails) {
    try {
      const success = await sendEmail({
        to: donorEmail,
        subject: emailSubject,
        html: emailHtml,
        replyTo: data.contactPhone,
      })
      
      if (success) {
        results.success++
      } else {
        results.failed++
      }
    } catch (error) {
      console.error(`Failed to send email to ${donorEmail}:`, error)
      results.failed++
    }
  }

  return results
}