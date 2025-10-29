"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Droplet, Home, Search, AlertCircle, User, LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/search", label: "Find Donors", icon: Search },
    { href: "/compatibility", label: "Blood Groups", icon: AlertCircle },
    { href: "/profile", label: "My Profile", icon: User },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-muted/50 min-h-screen flex-col fixed left-0 top-0">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image
              src="/nss-logo.png"
              alt="NSS Logo"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span>BloodConnect</span>
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

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <nav className="flex justify-around">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link key={link.href} href={link.href} className="flex-1">
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  className="w-full flex-col h-auto py-3 px-2"
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{link.label.split(' ')[0]}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
