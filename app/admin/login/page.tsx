import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminLoginForm } from "@/components/admin-login-form"

export default function AdminLoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <AdminLoginForm />
      </main>
      <Footer />
    </>
  )
}
