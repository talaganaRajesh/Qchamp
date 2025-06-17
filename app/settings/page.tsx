"use client";

import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User, Bell, LogOut, Loader2, Shield } from "lucide-react";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signOut } from "@/lib/auth";

export default function SettingsPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
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
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

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
      });
    }
  }, [user, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationToggle = (key: keyof typeof formData.notifications) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  const handlePrivacyToggle = (key: keyof typeof formData.privacy) => {
    setFormData((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };
  const handleSaveChanges = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      const updateData: {
        name: string;
        notifications: typeof formData.notifications;
        privacy: typeof formData.privacy;
        updatedAt: Date;
        phone?: string;
      } = {
        name: formData.name,
        notifications: formData.notifications,
        privacy: formData.privacy,
        updatedAt: new Date(),
      };

      if (formData.phone && formData.phone.trim()) {
        updateData.phone = formData.phone.trim();
      }

      await updateDoc(userRef, updateData);

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="fixed top-6 left-6 right-6 z-50">
        <div className="bg-black/80 backdrop-blur-xl border border-green-500/30 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="group flex items-center space-x-3 text-white hover:text-green-400 transition-all duration-300">
              <div className="p-2 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all duration-300">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <span className="font-medium">Dashboard</span>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mt-1"></div>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {successMessage && (
            <div className="mb-8 p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 rounded-2xl backdrop-blur-xl">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex space-x-2 bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-green-500/20">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-medium transition-all duration-300 shadow-lg ${
                  activeTab === "profile"
                    ? "bg-green-500 text-gray-900"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "notifications"
                    ? "bg-green-500 text-gray-900 shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === "privacy"
                    ? "bg-green-500 text-gray-900 shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>Privacy</span>
              </button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <div className="bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                  <p className="text-gray-400">Customize your personal details and preferences</p>
                </div>

                <div className="grid gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-white font-medium text-lg">Display Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="h-14 bg-white/5 border-2 border-green-500/30 rounded-2xl text-white placeholder:text-gray-500 text-lg px-6 focus:border-green-500 transition-all duration-300"
                        disabled={isSaving}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-2xl pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-white font-medium text-lg">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="h-14 bg-white/5 border-2 border-gray-700 rounded-2xl text-gray-400 text-lg px-6 opacity-60"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm">Protected</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm ml-2">Email address cannot be modified</p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-white font-medium text-lg">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="h-14 bg-white/5 border-2 border-green-500/30 rounded-2xl text-white placeholder:text-gray-500 text-lg px-6 focus:border-green-500 transition-all duration-300"
                        placeholder="Enter your phone number"
                        disabled={isSaving}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent rounded-2xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex space-x-4">
                  <Button
                    onClick={handleSaveChanges}
                    className="flex-1 h-14 bg-gradient-to-r from-green-500 to-green-600 text-gray-900 hover:from-green-400 hover:to-green-500 rounded-2xl font-bold text-lg shadow-xl shadow-green-500/25 transition-all duration-300"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Account Management</h2>
                  <p className="text-gray-400">Manage your account settings and security</p>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full h-14 border-2 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500 rounded-2xl font-bold text-lg transition-all duration-300"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-8">
              <div className="bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Notification Preferences</h2>
                  <p className="text-gray-400">Control how and when you receive notifications</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-green-500/20">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg">Game Invites</h3>
                      <p className="text-gray-400">Get notified when friends invite you to games</p>
                    </div>
                    <Switch
                      checked={formData.notifications.gameInvites}
                      onCheckedChange={() => handleNotificationToggle("gameInvites")}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-green-500/20">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg">Winnings & Rewards</h3>
                      <p className="text-gray-400">Receive alerts about your victories and rewards</p>
                    </div>
                    <Switch
                      checked={formData.notifications.winnings}
                      onCheckedChange={() => handleNotificationToggle("winnings")}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-green-500/20">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg">Promotions & Offers</h3>
                      <p className="text-gray-400">Stay updated with exclusive deals and promotions</p>
                    </div>
                    <Switch
                      checked={formData.notifications.promotions}
                      onCheckedChange={() => handleNotificationToggle("promotions")}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <Button
                    onClick={handleSaveChanges}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 text-gray-900 hover:from-green-400 hover:to-green-500 rounded-2xl font-bold text-lg shadow-xl shadow-green-500/25 transition-all duration-300"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-8">
              <div className="bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Privacy Controls</h2>
                  <p className="text-gray-400">Manage your visibility and data sharing preferences</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-green-500/20">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg">Public Profile</h3>
                      <p className="text-gray-400">Allow other players to view your profile information</p>
                    </div>
                    <Switch
                      checked={formData.privacy.showProfile}
                      onCheckedChange={() => handlePrivacyToggle("showProfile")}
                      disabled={isSaving}
                    />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-green-500/20">
                    <div className="space-y-1">
                      <h3 className="text-white font-bold text-lg">Game Statistics</h3>
                      <p className="text-gray-400">Share your game performance and achievements</p>
                    </div>
                    <Switch
                      checked={formData.privacy.showStats}
                      onCheckedChange={() => handlePrivacyToggle("showStats")}
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <Button
                    onClick={handleSaveChanges}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 text-gray-900 hover:from-green-400 hover:to-green-500 rounded-2xl font-bold text-lg shadow-xl shadow-green-500/25 transition-all duration-300"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      "Update Privacy"
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}