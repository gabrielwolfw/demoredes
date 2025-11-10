"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SigninForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setSuccess(true)

    // Reset form after success
    setTimeout(() => {
      setFormData({ email: "", password: "" })
      setSuccess(false)
    }, 3000)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">₹</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">SecureBank</h1>
          </div>
          <p className="text-muted-foreground text-sm">Sign in to your account</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800 text-sm font-medium">Sign in successful! Redirecting to dashboard...</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full px-4 py-2.5 border rounded-md bg-input text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.email ? "border-destructive" : "border-border"
              }`}
            />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 border rounded-md bg-input text-foreground placeholder-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.password ? "border-destructive" : "border-border"
              }`}
            />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="#" className="text-accent hover:underline font-medium text-sm">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full mt-6 bg-primary hover:bg-primary text-primary-foreground font-medium py-2.5 rounded-md transition-all disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : success ? "Signed In!" : "Sign In"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline font-medium">
            Create Account
          </Link>
        </p>

        {/* Security Info */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-accent text-xs font-bold">✓</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Secure Login</p>
              <p>Your session is protected with encryption and two-factor authentication options.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
