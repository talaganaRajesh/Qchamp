"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Wallet,
  Users,
  Trophy,
  Plus,
  Calculator,
  BookOpen,
  Gift,
  History,
  Settings,
  LogOut,
  Crown,
  Target,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useWallet } from "@/hooks/useWallet"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface GameHistory {
  id: string
  gameType: "math" | "quiz"
  players: number
  result: "Won" | "Lost"
  prize: string
  time: string
}

export default function Dashboard() {
  const { user, userProfile, loading, error: authError } = useAuth()
  const { balance, error: walletError } = useWallet()
  const router = useRouter()
  const [currentRank, setCurrentRank] = useState("Bronze")
  const [nextRankProgress, setNextRankProgress] = useState(45)
  const [recentGames, setRecentGames] = useState<GameHistory[]>([])
  const [loadingGames, setLoadingGames] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Fetch recent games
  useEffect(() => {
    if (!user) return

    const fetchRecentGames = async () => {
      try {
        const gamesRef = collection(db, "games")
        const q = query(
          gamesRef,
          where("players", "array-contains", { uid: user.uid }),
          orderBy("finishedAt", "desc"),
          limit(5),
        )

        const querySnapshot = await getDocs(q)
        const games: GameHistory[] = []

        querySnapshot.forEach((doc) => {
          const gameData = doc.data()
          const userWon = gameData.winnerId === user.uid
          const totalPool = gameData.players.length * 10
          const winnerPrize = Math.floor(totalPool * 0.8)

          games.push({
            id: doc.id,
            gameType: gameData.gameType || "quiz",
            players: gameData.players.length,
            result: userWon ? "Won" : "Lost",
            prize: userWon ? `+₹${winnerPrize}` : `-₹10`,
            time: formatTimeAgo(gameData.finishedAt?.toDate() || new Date()),
          })
        })

        setRecentGames(games)
      } catch (error) {
        console.error("Error fetching recent games:", error)
        setRecentGames([])
      } finally {
        setLoadingGames(false)
      }
    }

    fetchRecentGames()
  }, [user])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin text-green-400" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    )
  }

  // Show error if there are authentication or database issues
  if (authError || walletError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-zinc-900 to-black p-4">
        <div className="container mx-auto max-w-2xl mt-20">
          <Alert className="bg-red-500/20 border-red-500 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">
              <strong>Database Connection Error:</strong>
              <br />
              {authError || walletError}
              <br />
              <br />
              <strong>To fix this:</strong>
              <br />
              1. Go to Firebase Console → Firestore Database → Rules
              <br />
              2. Update the security rules to allow authenticated access
              <br />
              3. Or contact the administrator to configure database permissions
            </AlertDescription>
          </Alert>

          <div className="mt-6 text-center">
            <Button onClick={() => window.location.reload()} className="bg-green-500 text-white hover:bg-green-600 transition-all duration-200">
              Retry Connection
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="ml-4 text-white border-green-500/50 hover:bg-green-500/10">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Use default values if userProfile is not loaded yet
  const walletBalance = balance || 0
  const totalWins = userProfile?.totalWins || 0
  const totalGames = userProfile?.totalGames || 0
  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0
  const userName = userProfile?.name || user.email?.split("@")[0] || "User"

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-green-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href='/'
                className="flex items-center space-x-3 transition-all duration-700 translate-x-0 opacity-100">
                <div className="relative">
                  <Brain className="h-10 w-10 text-emerald-400" />

                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 bg-clip-text text-transparent">
                  <span className='text-green-300'>Q</span>
                  champ
                </span>
              </a>
              <Badge className="bg-green-950 text-green-100 hover:bg-green-600 transition-colors duration-200">
                Welcome back, {userName}!
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-500/30">
                <Wallet className="h-5 w-5 text-green-400" />
                <span className="text-white font-bold">₹{walletBalance}</span>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm" className="text-white bg-green-400/10 border-green-500/50 hover:bg-green-500/20 hover:border-green-400 transition-all duration-200">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="text-white bg-green-400/10 border-green-500/50 hover:bg-green-500/20 hover:border-green-400 transition-all duration-200" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold">{totalWins}</p>
                      <p className="text-sm text-gray-300">Total Wins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold">{winRate}%</p>
                      <p className="text-sm text-gray-300">Win Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold">{totalGames}</p>
                      <p className="text-sm text-gray-300">Games Played</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/30 text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Crown className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold">{currentRank}</p>
                      <p className="text-sm text-gray-300">Current Rank</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Game Selection */}
            <Card className="bg-green-900/10 border-green-900/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-green-400" />
                  <span>Choose Your Battle</span>
                </CardTitle>
                <CardDescription className="text-gray-300">Select a game type and join the battle!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Math Battle */}
                  <Card className="bg-black/10 border-green-700/20 hover:bg-green-900/15 transition-all duration-300 hover:shadow-green-500/20">
                    <CardContent className="p-6 text-center">
                      <Calculator className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Math Battle</h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Lightning-fast math challenges. First to answer correctly wins!
                      </p>
                      <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <p>• Addition, Subtraction, Multiplication</p>
                        <p>• Real-time competition</p>
                        <p>• 2-10 players</p>
                      </div>
                      <Badge className="mb-4 bg-green-800 text-green-100 hover:bg-green-600 transition-colors duration-200">₹10 Entry Fee</Badge>
                      <Link href="/games/math" className="block">
                        <Button className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-emerald-700 py-6 text-black font-semibold transition-all duration-200 ">
                          Join Math Battle
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Quiz Battle */}
                  <Card className="bg-black/10 border-green-700/20 hover:bg-green-900/15 transition-all duration-300 hover:shadow-green-500/20">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Quiz Battle</h3>
                      <p className="text-gray-300 text-sm mb-4">General knowledge questions from around the world. Knowledge wins!</p> 
                      <div className="space-y-2 text-sm text-gray-300 mb-4">
                        <p>• Fresh questions every time</p>
                        <p>• Multiple choice format</p>
                        <p>• 2-10 players</p>
                      </div>
                      <Badge className="mb-4 bg-green-800 text-green-100 hover:bg-green-600 transition-colors duration-200">₹10 Entry Fee</Badge>
                      <Link href="/games/quiz" className="block">
                        <Button className="w-full py-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-semibold transition-all duration-200">
                          Join Quiz Battle
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Recent Games */}
            <Card className="bg-green-500/10 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <History className="h-6 w-6 text-green-400" />
                  <span>Recent Games</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingGames ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-2" />
                    <div className="text-gray-400">Loading recent games...</div>
                  </div>
                ) : recentGames.length > 0 ? (
                  <div className="space-y-4">
                    {recentGames.map((game, index) => (
                      <div
                        key={game.id}
                        className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20 hover:bg-green-500/10 transition-all duration-200 hover:scale-[1.02]"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {game.gameType === "math" ? (
                              <Calculator className="h-5 w-5 text-green-400" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-green-400" />
                            )}
                            <div
                              className={`w-3 h-3 rounded-full ${game.result === "Won" ? "bg-green-400" : "bg-red-400"
                                }`}
                            />
                          </div>
                          <div>
                            <p className="text-white font-semibold">
                              {game.gameType === "math" ? "Math Battle" : "Quiz Battle"} ({game.players} players)
                            </p>
                            <p className="text-gray-300 text-sm">{game.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${game.result === "Won" ? "text-green-400" : "text-red-400"}`}>
                            {game.result}
                          </p>
                          <p className={`text-sm ${game.prize.startsWith("-") ? "text-red-400" : "text-green-400"}`}>
                            {game.prize}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-green-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">No games played yet</p>
                    <p className="text-gray-500 text-sm">Start playing to see your game history!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Card */}
            <Card className="bg-gradient-to-br border-gray-700 border from-green-950 to-teal-950 text-white hover:to-green-950 hover:from-teal-950 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-6 w-6" />
                  <span>Wallet</span>
                <h1 className=" font-bold">₹{walletBalance}</h1>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-row items-center justify-start ">
                  <Link href="/wallet/recharge">
                    <Button className="w-full font-semibold bg-transparent border  border-green-500 text-white hover:bg-green-900 transition-all duration-200">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Money
                    </Button>
                  </Link>
                  <Link href="/wallet/withdraw">
                    <Button
                      variant="outline"
                      className="w-full border-green-600 text-white bg-green-800 hover:bg-green-900 font-semibold hover:text-green-100 transition-all duration-200 "
                    >
                      Withdraw money
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Referral */}
            <Card className="bg-gradient-to-br border-gray-700 border from-green-950 to-emerald-950 text-white hover:to-green-950 hover:from-emerald-950 transition-all duration-300 ">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="h-6 w-6" />
                  <span>Refer & Earn</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Invite friends and earn ₹10 for each signup!</p>
                <Link href="/referral">
                  <Button className="w-full bg-green-300 text-black text-base font-semibold hover:bg-green-400 transition-all duration-200">
                    Share Referral Code
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Prize Info */}
            <Card className="bg-green-500/10 border-green-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">How Prizes Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Entry Fee:</span>
                    <span className="text-white font-bold">₹10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winner Gets:</span>
                    <span className="text-green-400 font-bold">90% of Pool</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee:</span>
                    <span className="text-green-600 font-bold">10%</span>
                  </div>
                  <div className="border-t border-green-500/20 pt-2">
                    <p className="text-xs">Example: 5 players = ₹50 pool</p>
                    <p className="text-xs">Winner gets ₹45, Platform gets ₹5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}