"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Mail, Lock, User, Phone, Gift, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUpWithEmail, createUserProfile } from "@/lib/auth"
import NavBar from "@/components/NavBar"

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    referralCode: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

   

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      // Create Firebase Auth user
      const userCredential = await signUpWithEmail(formData.email, formData.password)
      const user = userCredential.user

      // Create user profile in Firestore
      await createUserProfile(user, {
        name: formData.name,
        referralCode: formData.referralCode || undefined,
      })

      console.log("User created successfully:", user.uid)

      // Show success message
      if (formData.referralCode) {
        setSuccess("Account created successfully! You've received ₹20 bonus (₹10 welcome + ₹10 referral)!")
      } else {
        setSuccess("Account created successfully! You've received ₹10 welcome bonus!")
      }

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Signup error:", error)

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists")
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address")
      } else if (error.message === "Invalid referral code") {
        setError("Invalid referral code. Please check and try again.")
      } else {
        setError(error.message || "Failed to create account. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-950/95 to-black">
      
      <div className="w-full">
        <NavBar/> 
      </div>
    
      
      <Card className="w-full max-w-md mt-24 mb-20 bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Join Qchamp</CardTitle>
          <CardDescription className="text-gray-300">Create your account and start battling!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-500/20 border-red-500">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-500/20 border-green-500">
                <AlertDescription className="text-green-200">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 bg-white/10  border-white/20 text-white placeholder:text-gray-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password *
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="text"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                  disabled={loading}
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="referralCode" className="text-white">
                Referral Code (Optional)
              </Label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  placeholder="Enter referral code for ₹10 bonus"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-semibold text-base transition-colors duration-300 "
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-500 hover:text-emerald-300 font-semibold">
                Log In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
