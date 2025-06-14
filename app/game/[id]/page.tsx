"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Trophy, Zap, CheckCircle, XCircle, Crown, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { subscribeToGame, submitAnswer, endGame, type GameRoom } from "@/lib/game"
import Link from "next/link"

export default function GamePage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [gameData, setGameData] = useState<GameRoom | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [gamePhase, setGamePhase] = useState<"waiting" | "playing" | "result" | "finished">("playing")
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Subscribe to game updates
  useEffect(() => {
    if (!user) return

    const gameId = params.id
    const unsubscribe = subscribeToGame(gameId, (game) => {
      setGameData(game)
      setLoading(false)

      // Update game phase based on game status
      if (game.status === "finished") {
        setGamePhase("finished")
      } else if (game.status === "playing") {
        setGamePhase("playing")
        setCurrentQuestion(game.currentQuestion)
      }
    })

    return () => unsubscribe()
  }, [params.id, user])

  // Timer effect
  useEffect(() => {
    if (gamePhase === "playing" && timeLeft > 0 && gameData) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gamePhase === "playing") {
      handleTimeUp()
    }
  }, [timeLeft, gamePhase, gameData])

  // Reset timer when question changes
  useEffect(() => {
    if (gameData && gameData.questions && gameData.questions[currentQuestion]) {
      setTimeLeft(gameData.questions[currentQuestion].timeLimit || 10)
    }
  }, [currentQuestion, gameData])

  const handleTimeUp = () => {
    if (selectedAnswer === null && gameData) {
      setUserAnswers([...userAnswers, -1]) // -1 for no answer

      // Submit answer to backend
      submitAnswer(
        params.id,
        user!.uid,
        currentQuestion,
        -1, // No answer
        0, // No time left
      ).catch((err) => console.error("Error submitting answer:", err))
    }
    showAnswerResult()
  }

  const handleAnswerSelect = async (answerIndex: number) => {
    if (!gameData || selectedAnswer !== null || showCorrectAnswer) return

    setSelectedAnswer(answerIndex)
    setUserAnswers([...userAnswers, answerIndex])

    // Calculate time spent
    const questionTimeLimit = gameData.questions[currentQuestion].timeLimit || 10
    const timeSpent = questionTimeLimit - timeLeft

    // Submit answer to backend
    try {
      await submitAnswer(params.id, user!.uid, currentQuestion, answerIndex, timeSpent)
    } catch (err) {
      console.error("Error submitting answer:", err)
    }

    showAnswerResult()
  }

  const showAnswerResult = () => {
    setShowCorrectAnswer(true)
    setGamePhase("result")

    setTimeout(() => {
      if (gameData && currentQuestion < gameData.questions.length - 1) {
        nextQuestion()
      } else {
        finishGame()
      }
    }, 3000)
  }

  const nextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1)
    setTimeLeft(gameData?.questions[currentQuestion + 1]?.timeLimit || 10)
    setSelectedAnswer(null)
    setShowCorrectAnswer(false)
    setGamePhase("playing")
  }

  const finishGame = async () => {
    setGamePhase("finished")

    // End game in backend
    try {
      if (gameData && user && gameData.hostId === user.uid) {
        await endGame(params.id)
      }
    } catch (err) {
      console.error("Error ending game:", err)
    }
  }

  // Show loading while checking authentication
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading game...</span>
        </div>
      </div>
    )
  }

  // Don't render if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/dashboard">
              <Button className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Game Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white mb-4">The game you're looking for doesn't exist or has ended.</p>
            <Link href="/dashboard">
              <Button className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gamePhase === "finished" || gameData.status === "finished") {
    // Sort players by score
    const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score)
    const winner = sortedPlayers[0]
    const userRank = sortedPlayers.findIndex((p) => p.uid === user?.uid) + 1
    const userWon = userRank === 1
    const prizeAmount = Math.floor(gameData.prizePool * 0.85) // 85% to winner, 15% platform fee

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {userWon ? (
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="h-10 w-10 text-purple-900" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl text-white mb-2">{userWon ? "🎉 Congratulations!" : "Game Over"}</CardTitle>
            <p className="text-gray-300">
              {userWon
                ? "You won the quiz battle!"
                : `You finished in ${userRank}${userRank === 2 ? "nd" : userRank === 3 ? "rd" : "th"} place`}
            </p>
          </CardHeader>
          <CardContent>
            {/* Final Leaderboard */}
            <div className="space-y-3 mb-6">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.uid}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    player.uid === user?.uid ? "bg-yellow-400/20 border border-yellow-400" : "bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{index === 0 ? "👑" : `#${index + 1}`}</span>
                      <span className="text-2xl">
                        {index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮"}
                      </span>
                    </div>
                    <span className={`font-semibold ${player.uid === user?.uid ? "text-yellow-400" : "text-white"}`}>
                      {player.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${player.uid === user?.uid ? "text-yellow-400" : "text-white"}`}>
                      {player.score} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prize Information */}
            <div className="text-center mb-6">
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                <p className="text-green-400 font-semibold">
                  {userWon ? `You won ₹${prizeAmount}!` : "Better luck next time!"}
                </p>
                {userWon && <p className="text-green-300 text-sm">Prize money added to your wallet</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300">Play Again</Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full text-white border-white/20">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If game is still active
  const currentQ = gameData.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / gameData.questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Badge className="bg-yellow-400 text-purple-900">
              Question {currentQuestion + 1} of {gameData.questions.length}
            </Badge>
            <div className="flex items-center space-x-2 text-white">
              <Users className="h-5 w-5" />
              <span>{gameData.players.length} Players</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5" />
            <span className="text-xl font-bold">{timeLeft}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border-white/20 mb-6">
              <CardHeader>
                <CardTitle className="text-2xl text-white">{currentQ.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQ.options.map((option, index) => {
                    let buttonClass = "w-full p-4 text-left transition-all duration-200 "

                    if (showCorrectAnswer) {
                      if (index === currentQ.correct) {
                        buttonClass += "bg-green-500 text-white border-green-500"
                      } else if (index === selectedAnswer && index !== currentQ.correct) {
                        buttonClass += "bg-red-500 text-white border-red-500"
                      } else {
                        buttonClass += "bg-white/5 text-gray-300 border-white/20"
                      }
                    } else if (selectedAnswer === index) {
                      buttonClass += "bg-yellow-400 text-purple-900 border-yellow-400"
                    } else {
                      buttonClass += "bg-white/10 text-white border-white/20 hover:bg-white/20"
                    }

                    return (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={buttonClass}
                        disabled={selectedAnswer !== null || showCorrectAnswer}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-current/20 flex items-center justify-center">
                            <span className="font-bold">{String.fromCharCode(65 + index)}</span>
                          </div>
                          <span>{option}</span>
                          {showCorrectAnswer && index === currentQ.correct && (
                            <CheckCircle className="h-5 w-5 ml-auto" />
                          )}
                          {showCorrectAnswer && index === selectedAnswer && index !== currentQ.correct && (
                            <XCircle className="h-5 w-5 ml-auto" />
                          )}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span>Live Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gameData.players
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                      <div
                        key={player.uid}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          player.uid === user?.uid ? "bg-yellow-400/20 border border-yellow-400" : "bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{index === 0 ? "👑" : `#${index + 1}`}</span>
                          <span className="text-lg">
                            {index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮"}
                          </span>
                          <span
                            className={`font-semibold ${player.uid === user?.uid ? "text-yellow-400" : "text-white"}`}
                          >
                            {player.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-yellow-400" />
                          <span className={`font-bold ${player.uid === user?.uid ? "text-yellow-400" : "text-white"}`}>
                            {player.score}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
