"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Bell, Shield, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { signOut } from "@/lib/auth"

export default function SettingsPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notifications: {
      gameInvites: true,
      winnings: true,
      promotions: false,
    },
    privacy: {
      showProfile: true,
      showStats: true,
    },
  })
  const [successMessage, setSuccessMessage] = useState("")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: user?.email || "",
        phone: userProfile.phone || "",
        notifications: {
          gameInvites: userProfile.notifications?.gameInvites !== false,
          winnings: userProfile.notifications?.winnings !== false,
          promotions: userProfile.notifications?.promotions || false,
        },
        privacy: {
          showProfile: userProfile.privacy?.showProfile !== false,
          showStats: userProfile.privacy?.showStats !== false,
        },
      })
    }
  }, [user, userProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationToggle = (key: keyof typeof formData.notifications) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handlePrivacyToggle = (key: keyof typeof formData.privacy) => {
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }))
  }

  const handleSaveProfile = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const userRef = doc(db, "users", user.uid)
      const updateData: any = {
        name: formData.name,
        notifications: formData.notifications,
        privacy: formData.privacy,
        updatedAt: new Date(),
      }

      // Only add phone if it has a value
      if (formData.phone && formData.phone.trim()) {
        updateData.phone = formData.phone.trim()
      }

      await updateDoc(userRef, updateData)

      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-white hover:text-yellow-400 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6 text-green-400">
            {successMessage}
          </div>
        )}

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-300">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 opacity-70"
                  />
                  <p className="text-gray-400 text-sm mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="Enter your phone number"
                    disabled={isSaving}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-500/20"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Notification Settings</CardTitle>
                <CardDescription className="text-gray-300">Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Game Invites</p>
                    <p className="text-gray-400 text-sm">Receive notifications for game invites</p>
                  </div>
                  <Switch
                    checked={formData.notifications.gameInvites}
                    onCheckedChange={() => handleNotificationToggle("gameInvites")}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Winnings & Rewards</p>
                    <p className="text-gray-400 text-sm">Get notified about your winnings and rewards</p>
                  </div>
                  <Switch
                    checked={formData.notifications.winnings}
                    onCheckedChange={() => handleNotificationToggle("winnings")}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Promotions & Offers</p>
                    <p className="text-gray-400 text-sm">Receive updates about promotions and special offers</p>
                  </div>
                  <Switch
                    checked={formData.notifications.promotions}
                    onCheckedChange={() => handleNotificationToggle("promotions")}
                    disabled={isSaving}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6 mt-6">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
                <CardDescription className="text-gray-300">Control your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Show Profile</p>
                    <p className="text-gray-400 text-sm">Allow other players to see your profile</p>
                  </div>
                  <Switch
                    checked={formData.privacy.showProfile}
                    onCheckedChange={() => handlePrivacyToggle("showProfile")}
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Show Game Stats</p>
                    <p className="text-gray-400 text-sm">Display your game statistics to other players</p>
                  </div>
                  <Switch
                    checked={formData.privacy.showStats}
                    onCheckedChange={() => handlePrivacyToggle("showStats")}
                    disabled={isSaving}
                  />
                </div>

                <Button
                  onClick={handleSaveProfile}
                  className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
