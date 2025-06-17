"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import NavBar from "@/components/NavBar"


export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!email) {
      setError("Please enter your email address")
      setLoading(false)
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (error: any) {
      console.error("Password reset error:", error)

      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address")
      } else {
        setError("Failed to send reset email. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className=" flex-col bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        
        
        <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Check Your Email</CardTitle>
            <CardDescription className="text-gray-300">We've sent a password reset link to {email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-500/20 border-green-500">
              <AlertDescription className="text-green-200">
                Please check your email and click the reset link to create a new password.
              </AlertDescription>
            </Alert>

            <div className="text-center space-y-4">
              <p className="text-gray-300 text-sm">Didn't receive the email? Check your spam folder or try again.</p>

              <Button
                onClick={() => {
                  setSuccess(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full text-white border-white/20"
              >
                Try Different Email
              </Button>

              <Link href="/login">
                <Button className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-col  bg-gradient-to-br from-black via-zinc-950/95 to-black  flex items-center justify-center">

       <div className="w-full">
        <NavBar/>
      </div>

      <Card className="w-full mt-48 mb-32 max-w-md bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
          <CardDescription className="text-gray-300">Enter your email to receive a password reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-500/20 border-red-500">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-semibold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-yellow-400 hover:text-yellow-300 font-semibold inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
