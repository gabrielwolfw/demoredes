"use client"

import SignupForm from "@/components/signup-form"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <SignupForm onSwitchMode={() => (window.location.href = "/login")} />
    </main>
  )
}
