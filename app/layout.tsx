import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google";

const _geist = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const _geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "NSS BloodConnect - Blood Donor Platform",
  description: "Connect voluntary blood donors across campus for emergencies",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
