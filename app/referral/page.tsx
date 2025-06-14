"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Gift, Copy, Share2, Users, Trophy, CheckCircle, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ReferralData {
  id: string
  referredUserId: string
  referredUserName: string
  bonus: number
  createdAt: Date
  status: string
}

export default function ReferralPage() {
  const { user, userProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [referralHistory, setReferralHistory] = useState<ReferralData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalEarnings, setTotalEarnings] = useState(0)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch referral data
  useEffect(() => {
    if (!user) return

    const fetchReferralData = async () => {
      try {
        // Fetch referrals where current user is the referrer
        const referralsRef = collection(db, "referrals")
        const q = query(referralsRef, where("referrerId", "==", user.uid), orderBy("createdAt", "desc"))

        const querySnapshot = await getDocs(q)
        const referrals: ReferralData[] = []
        let earnings = 0

        for (const doc of querySnapshot.docs) {
          const data = doc.data()

          // Get referred user's name
          const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", data.referredUserId)))

          const referredUserName = userDoc.docs[0]?.data()?.name || "Unknown User"

          referrals.push({
            id: doc.id,
            referredUserId: data.referredUserId,
            referredUserName,
            bonus: data.bonus,
            createdAt: data.createdAt.toDate(),
            status: data.status,
          })

          if (data.status === "completed") {
            earnings += data.bonus
          }
        }

        setReferralHistory(referrals)
        setTotalEarnings(earnings)
      } catch (error) {
        console.error("Error fetching referral data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [user])

  const handleCopyCode = () => {
    if (userProfile?.referralCode) {
      navigator.clipboard.writeText(userProfile.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = () => {
    if (userProfile?.referralCode && navigator.share) {
      navigator.share({
        title: "Join Quiz Clash",
        text: `Join Quiz Clash using my referral code ${userProfile.referralCode} and get ₹10 bonus!`,
        url: `${window.location.origin}/signup?ref=${userProfile.referralCode}`,
      })
    }
  }

  const handleCopyLink = () => {
    if (userProfile?.referralCode) {
      const link = `${window.location.origin}/signup?ref=${userProfile.referralCode}`
      navigator.clipboard.writeText(link)
      alert("Referral link copied to clipboard!")
    }
  }

  // Show loading while checking authentication
  if (authLoading || loading) {
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
  if (!user || !userProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-white hover:text-yellow-400">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Refer & Earn</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CardHeader className="text-center">
                <Gift className="h-12 w-12 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">₹{totalEarnings}</CardTitle>
                <CardDescription className="text-green-100">Total Earnings</CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{referralHistory.length}</div>
                <p className="text-gray-300">Friends Referred</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <Trophy className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">₹10</div>
                <p className="text-gray-300">Per Referral</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* How It Works */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">How Referral Works</CardTitle>
                <CardDescription className="text-gray-300">
                  Earn money by inviting your friends to Quiz Clash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-purple-900">1</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Share Code</h3>
                    <p className="text-gray-300 text-sm">Share your unique referral code with friends</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-purple-900">2</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Friend Joins</h3>
                    <p className="text-gray-300 text-sm">They sign up using your code</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl font-bold text-purple-900">3</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Both Earn</h3>
                    <p className="text-gray-300 text-sm">You both get ₹10 bonus instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Referral Code */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Referral Code</CardTitle>
                <CardDescription className="text-gray-300">Share this code with your friends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={userProfile.referralCode}
                    readOnly
                    className="bg-white/10 border-white/20 text-white font-mono text-lg"
                  />
                  <Button onClick={handleCopyCode} className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleShare} className="bg-blue-500 text-white hover:bg-blue-600">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Code
                  </Button>
                  <Button onClick={handleCopyLink} variant="outline" className="text-white border-white/20">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>

                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Referral Benefits</h4>
                  <ul className="text-green-300 text-sm space-y-1">
                    <li>• You earn ₹10 for each successful referral</li>
                    <li>• Your friend gets ₹10 welcome bonus</li>
                    <li>• No limit on number of referrals</li>
                    <li>• Instant bonus credit to wallet</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Referral History</CardTitle>
                <CardDescription className="text-gray-300">Track your successful referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referralHistory.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {referral.referredUserName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{referral.referredUserName}</p>
                          <p className="text-gray-300 text-sm">Joined {referral.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-500 text-white">+₹{referral.bonus}</Badge>
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {referralHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No referrals yet</p>
                    <p className="text-gray-500 text-sm">Start sharing your code to earn rewards!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
