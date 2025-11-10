"use client"

import { useState } from "react"
import SignupForm from "@/components/signup-form"
import SigninForm from "@/components/signin-form"

const Signin = SigninForm as any

export default function Home() {
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin")

  return (
    <main className="min-h-screen bg-linear-to-br from-background to-secondary flex items-center justify-center p-4">
      {authMode === "signup" ? (
        <SignupForm onSwitchMode={() => setAuthMode("signin")} />
      ) : (
        <Signin onSwitchMode={() => setAuthMode("signup")} />
      )}
    </main>
  )
}