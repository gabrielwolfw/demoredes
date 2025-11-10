"use client"

import SigninForm from "@/components/signin-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <SigninForm onSwitchMode={() => (window.location.href = "/signup")} />
    </main>
  )
}
