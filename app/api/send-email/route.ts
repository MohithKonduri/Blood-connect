import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text, replyTo } = await request.json()

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Basic XSS protection - limit HTML size
    if (html.length > 50000) {
      return NextResponse.json(
        { success: false, error: 'Email content too large' },
        { status: 400 }
      )
    }

    // Create transporter using Gmail SMTP
    const gmailUser = process.env.GMAIL_USER || 'vignanpranadhara@gmail.com'
    const gmailPassword = process.env.GMAIL_APP_PASSWORD || 'cylm bleh whyp imfx'
    
    console.log('📧 Gmail Configuration:', {
      user: gmailUser,
      passwordSet: !!gmailPassword
    })

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      pool: true,
      maxConnections: 2,
      maxMessages: 10,
      connectionTimeout: 10000, // 10s to connect
      greetingTimeout: 10000,   // 10s to receive greeting
      socketTimeout: 15000,     // 15s overall socket idle timeout
      auth: {
        user: gmailUser,
        pass: gmailPassword,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `NSS BloodConnect <${gmailUser}>`,
      to,
      subject,
      html,
      text: text || subject,
      replyTo: replyTo || undefined,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'High',
      },
      priority: 'high',
    })

    console.log('✅ Email sent successfully:', info.messageId, {
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    })

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    })
  } catch (error: any) {
    console.error('❌ Failed to send email:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to send email',
      },
      { status: 500 }
    )
  }
}

