"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Trophy, ArrowLeft, Loader2, Globe } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { createQuizGame, joinQuizGame, subscribeToQuizGame } from "@/lib/quizGame"

interface QuizGameRoom {
  id: string
  players: Array<{
    uid: string
    name: string
    score: number
    isReady: boolean
  }>
  status: "waiting" | "starting" | "playing" | "finished"
  maxPlayers: number
  entryFee: number
  prizePool: number
  createdAt: Date
}

export default function QuizGamePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [gameRooms, setGameRooms] = useState<QuizGameRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch available game rooms
  useEffect(() => {
    if (!user) return

    // Subscribe to available quiz game rooms
    const unsubscribe = subscribeToQuizGame((rooms) => {
      setGameRooms(rooms.filter((room) => room.status === "waiting"))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleCreateGame = async () => {
    if (!user) return

    setCreating(true)
    try {
      const gameId = await createQuizGame(user.uid)
      router.push(`/games/quiz/${gameId}`)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setCreating(false)
    }
  }

  const handleJoinGame = async (gameId: string) => {
    if (!user) return

    setJoining(gameId)
    try {
      await joinQuizGame(gameId, user.uid)
      router.push(`/games/quiz/${gameId}`)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setJoining(null)
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
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Quiz Battle</h1>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Info */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                  <span>Quiz Battle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-gray-300">
                  <h3 className="text-white font-semibold mb-2">How to Play:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Answer general knowledge questions</li>
                    <li>• Multiple choice format</li>
                    <li>• Fresh questions from API</li>
                    <li>• Speed and accuracy matter</li>
                  </ul>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2 flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Fresh Questions</span>
                  </h4>
                  <p className="text-blue-300 text-sm">
                    Questions are fetched from Open Trivia Database API - never repeated!
                  </p>
                </div>

                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Prize Structure</h4>
                  <div className="text-green-300 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Entry Fee:</span>
                      <span>₹10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Winner Gets:</span>
                      <span>80% of Pool</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateGame}
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  disabled={creating}
                >
                  {creating ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create New Game"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Available Games */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Available Game Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                {gameRooms.length > 0 ? (
                  <div className="space-y-4">
                    {gameRooms.map((room) => (
                      <Card key={room.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5 text-blue-400" />
                                <div>
                                  <p className="text-white font-semibold">Quiz Battle #{room.id.slice(-6)}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                                    <div className="flex items-center space-x-1">
                                      <Users className="h-4 w-4" />
                                      <span>
                                        {room.players.length}/{room.maxPlayers}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Trophy className="h-4 w-4" />
                                      <span>₹{Math.floor(room.prizePool * 0.8)} Prize</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <Badge className="bg-green-500 text-white">₹10 Entry</Badge>
                              <Button
                                onClick={() => handleJoinGame(room.id)}
                                className="bg-blue-500 text-white hover:bg-blue-600"
                                disabled={joining === room.id || room.players.length >= room.maxPlayers}
                              >
                                {joining === room.id ? (
                                  <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Joining...</span>
                                  </div>
                                ) : room.players.length >= room.maxPlayers ? (
                                  "Full"
                                ) : (
                                  "Join Game"
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Players List */}
                          {room.players.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-gray-300 text-sm mb-2">Players:</p>
                              <div className="flex flex-wrap gap-2">
                                {room.players.map((player) => (
                                  <Badge key={player.uid} variant="outline" className="text-white border-white/20">
                                    {player.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-semibold mb-2">No Active Games</h3>
                    <p className="text-gray-300 mb-6">Be the first to create a quiz battle!</p>
                    <Button
                      onClick={handleCreateGame}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      disabled={creating}
                    >
                      {creating ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create First Game"
                      )}
                    </Button>
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
