# 📧 Email Setup Guide - Emergency Notifications

## ✅ What's Configured

The emergency contact system now sends real emails to **vignanpranadhara@gmail.com** when volunteers submit emergency blood requests.

### 📋 Email Flow

1. **Volunteer clicks "🚨 Emergency Contact" on dashboard**
2. **Form appears** with emergency details fields:
   - Blood Group Needed
   - District
   - Urgency Level
   - Description
   - Contact Name
   - Contact Phone

3. **Volunteer fills form and submits**
4. **System collects:**
   - Volunteer's complete profile (name, roll number, blood group, department, etc.)
   - Emergency request details
   - Combines them into comprehensive notification

5. **Email is sent to admin** with:
   - Professional HTML formatting
   - Emergency details section
   - Volunteer information section
   - Action required callout
   - Timestamp

6. **Data is saved to Firestore** in `emergencyNotifications` collection

### 🔧 Configuration

The email system uses Gmail SMTP with these credentials:
- **Email:** vignanpranadhara@gmail.com
- **App Password:** cylm bleh whyp imfx (configured in API route)

### 📁 Files Created/Modified

1. **`lib/email-service.ts`** - Email utility functions
2. **`app/api/send-email/route.ts`** - API endpoint for sending emails
3. **`components/emergency-contact.tsx`** - Enhanced emergency contact UI
4. **`.env.local`** - Environment variables (created via PowerShell)

### 🧪 Testing the Email System

1. **Start the development server** (already running in background)
2. **Login to dashboard** as a registered volunteer
3. **Click "🚨 Emergency Contact" button**
4. **Fill out the emergency form:**
   - Select Blood Group
   - Select District
   - Choose Urgency Level
   - Add Description (optional)
   - Enter Contact Name
   - Enter Contact Phone
5. **Click "Send Emergency Request"**
6. **Check the admin email** (vignanpranadhara@gmail.com)

### 📊 Email Format

The admin will receive a professional HTML email with:

#### **Header Section:**
- 🚨 EMERGENCY BLOOD REQUEST
- Priority Level (CRITICAL/HIGH/MEDIUM/LOW)

#### **Emergency Details:**
- Blood Group Needed
- District
- Urgency Level
- Description
- Contact Name
- Contact Phone

#### **Volunteer Information:**
- Name
- Roll Number
- Blood Group
- District
- Phone
- Email
- Department
- Year
- Section
- Availability Status
- Donation Status

#### **Action Required:**
- Warning callout to contact volunteer immediately

### 🔍 How to View Email Logs

Check the terminal where `npm run dev` is running. You'll see:
- `📧 Gmail Configuration` - Shows when email config is loaded
- `✅ Email sent successfully` - Confirms email delivery
- `❌ Failed to send email` - Shows any errors

### ⚠️ Troubleshooting

If emails are not being sent:

1. **Check Gmail Settings:**
   - Ensure "Less secure app access" is enabled OR
   - Use App Password (recommended - already configured)

2. **Verify Environment Variables:**
   - Check `.env.local` file exists in project root
   - Restart development server after creating `.env.local`

3. **Check Console Logs:**
   - Look for email-related errors in terminal
   - Check browser console for API call errors

4. **Test API Endpoint:**
   - Open: `http://localhost:3000/api/send-email`
   - Should show error (POST method required)

### 📝 Important Notes

- Email is sent from `vignanpranadhara@gmail.com` to `vignanpranadhara@gmail.com`
- App password is hardcoded in the API route for simplicity
- In production, move credentials to environment variables
- The system continues even if email fails (saves to Firestore)

### 🎯 Next Steps

1. The system is ready to send emails!
2. Test by submitting an emergency request from a volunteer dashboard
3. Monitor email inbox for notifications
4. All data is also saved to Firestore for admin review

