"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmail } from "@/lib/auth"
import NavBar from "@/components/NavBar"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      await signInWithEmail(formData.email, formData.password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.code === "auth/user-not-found") {
        setError("No account found with this email")
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address")
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.")
      } else {
        setError("Failed to sign in. Please check your credentials.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" flex-col bg-gradient-to-br from-black via-zinc-950/95 to-black flex items-center justify-center">
      
      <div className="w-full">
        <NavBar/>
      </div>
      
      <Card className="w-full mb-20 max-w-md bg-white/10 border-white/20 backdrop-blur-sm mt-32">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-emerald-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-300">Sign in to continue your quiz battles</CardDescription>
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
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="text"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-emerald-700 text-black  font-semibold"
              disabled={loading}
            >
              {loading ? "Loging In..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
