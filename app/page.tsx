"use client"

import { useState } from "react"
import SignupForm from "@/components/signup-form"
import SigninForm from "@/components/signin-form"

export default function Home() {
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin")

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      {authMode === "signup" ? (
        <SignupForm onSwitchMode={() => setAuthMode("signin")} />
      ) : (
        <SigninForm onSwitchMode={() => setAuthMode("signup")} />
      )}
    </main>
  )
}