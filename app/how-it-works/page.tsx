import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Trophy, Wallet, Gift, Zap, Shield, Clock } from "lucide-react"
import Link from "next/link"
import NavBar from "@/components/NavBar"

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">

    <NavBar/>

      <div className="container pt-24 mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">How Qchamp Works</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Battle your way to victory in the ultimate quiz competition. Here's everything you need to know to get
            started and start winning!
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <Users className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-white">Sign Up & Get Bonus</CardTitle>
              <CardDescription className="text-gray-300">
                Create your account and receive ₹10 welcome bonus instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Quick email or phone signup</li>
                <li>• ₹10 welcome bonus</li>
                <li>• Secure profile creation</li>
                <li>• Referral code support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <Wallet className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-white">Add Money to Wallet</CardTitle>
              <CardDescription className="text-gray-300">Top up your wallet to join paid quiz battles</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Secure payment gateway</li>
                <li>• Multiple payment options</li>
                <li>• Instant wallet credit</li>
                <li>• Transaction history</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <Brain className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-white">Join Quiz Battles</CardTitle>
              <CardDescription className="text-gray-300">
                Enter quiz rooms and compete with other players
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Multiple quiz categories</li>
                <li>• Different entry fees</li>
                <li>• Real-time multiplayer</li>
                <li>• Fair matchmaking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  4
                </div>
                <Zap className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-white">Answer Questions</CardTitle>
              <CardDescription className="text-gray-300">
                Race against time to answer quiz questions correctly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• 10 questions per battle</li>
                <li>• 30 seconds per question</li>
                <li>• Multiple choice format</li>
                <li>• Live scoring system</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  5
                </div>
                <Trophy className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-white">Win & Earn Money</CardTitle>
              <CardDescription className="text-gray-300">
                Top performers win cash prizes added to their wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Winner takes prize pool</li>
                <li>• Instant wallet credit</li>
                <li>• Leaderboard rankings</li>
                <li>• Achievement badges</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  6
                </div>
                <Gift className="h-6 w-6 text-emerald-700" />
              </div>
              <CardTitle className="text-white">Withdraw Earnings</CardTitle>
              <CardDescription className="text-gray-300">Cash out your winnings to your bank account</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2">
                <li>• Minimum ₹100 withdrawal</li>
                <li>• Direct bank transfer</li>
                <li>• Quick processing</li>
                <li>• Secure transactions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Game Rules */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Game Rules & Scoring</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-yellow-400" />
                  Timing Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <div className="flex justify-between">
                  <span>Question Time Limit:</span>
                  <Badge variant="secondary">30 seconds</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <Badge variant="secondary">10 questions</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Game Duration:</span>
                  <Badge variant="secondary">~5 minutes</Badge>
                </div>
                <p className="text-sm">Faster answers get bonus points!</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Scoring System
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-3">
                <div className="flex justify-between">
                  <span>Correct Answer:</span>
                  <Badge variant="secondary">+10 points</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Speed Bonus:</span>
                  <Badge variant="secondary">+1-5 points</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Wrong Answer:</span>
                  <Badge variant="destructive">0 points</Badge>
                </div>
                <p className="text-sm">Highest score wins the prize pool!</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety & Security */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Safety & Security</h2>
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Secure Payments</h3>
                  <p className="text-gray-300 text-sm">
                    All transactions are encrypted and processed through secure payment gateways
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Fair Play</h3>
                  <p className="text-gray-300 text-sm">
                    Advanced anti-cheat systems ensure fair competition for all players
                  </p>
                </div>
                <div className="text-center">
                  <Wallet className="h-12 w-12 text-violet-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Quick Withdrawals</h3>
                  <p className="text-gray-300 text-sm">
                    Fast and secure withdrawal process with multiple payout options
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Winning?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of players already earning money through quiz battles. Sign up now and get your ₹10 welcome
            bonus!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-black ">
                Sign Up & Get ₹10 Bonus
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-white hover:bg-transparent  border-white/20 bg-white/10">
                Already Have Account? Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
