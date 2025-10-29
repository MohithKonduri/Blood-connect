"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { User } from "lucide-react"

export function DashboardHeader() {
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.email?.split("@")[0] || "User")
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium capitalize">{userName}</p>
          <p className="text-xs text-muted-foreground">Blood Donor</p>
        </div>
      </div>
    </header>
  )
}
