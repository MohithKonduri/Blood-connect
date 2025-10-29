"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Droplet, BarChart3, Users, AlertCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminSession")
    router.push("/admin/login")
  }

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/donors", label: "Manage Donors", icon: Users },
    { href: "/admin/emergencies", label: "Emergency Requests", icon: AlertCircle },
  ]

  return (
    <aside className="w-64 border-r border-border bg-muted/50 min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Image
            src="/nss-logo.png"
            alt="NSS Logo"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
          <span>NSS Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start" asChild>
                <span>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </span>
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
