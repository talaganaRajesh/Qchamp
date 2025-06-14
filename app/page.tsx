import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Trophy, Zap, Gift, Shield, Calculator, BookOpen } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">Qchamp</span>
          </div>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline" className="text-white bg-transparent border-white hover:bg-white hover:text-purple-900">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-yellow-400 text-purple-900 hover:bg-yellow-300">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-yellow-400 text-purple-900 hover:bg-yellow-300">🏆 Multiplayer Brain Battles</Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Q<span className="text-yellow-400">champ</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Challenge your friends in real-time multiplayer games and earn money. Winner takes all!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup">
            <Button size="lg" className="bg-yellow-400 rounded-lg text-purple-900 hover:bg-yellow-300">
              Start Playing Now
            </Button>
          </a>
          <Link href="/how-it-works">
            <Button
              size="lg"
              variant="outline"
              className="text-white bg-transparent border-white hover:bg-white hover:text-purple-900"
            >
              How It Works
            </Button>
          </Link>
        </div>

        {/* Referral Bonus Banner */}
        <div className="mt-12 p-6 border-green-400 border rounded-lg max-w-md mx-auto">
          <Gift className="h-8 w-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-bold text-lg">Referral Bonus!</h3>
          <p className="text-green-100">Get ₹10 for every friend you invite. They get ₹10 too!</p>
        </div>
      </section>

      {/* Game Types */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Choose Your Battle</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <Calculator className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Math Battle</CardTitle>
              <CardDescription className="text-gray-300">
                Lightning-fast math challenges. First to answer wins!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• Addition, Subtraction, Multiplication</li>
                <li>• Real-time competition</li>
                <li>• Speed matters</li>
                <li>• 2-10 players per game</li>
              </ul>
              <div className="text-center">
                <Badge className="bg-green-500 text-white">₹10 Entry Fee</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all">
            <CardHeader className="text-center">
              <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Quiz Battle</CardTitle>
              <CardDescription className="text-gray-300">
                General knowledge questions from around the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• Fresh questions every time</li>
                <li>• Multiple choice format</li>
                <li>• Time-based scoring</li>
                <li>• 2-10 players per game</li>
              </ul>
              <div className="text-center">
                <Badge className="bg-green-500 text-white">₹10 Entry Fee</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose Qchamp?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle>Real-Time Multiplayer</CardTitle>
              <CardDescription className="text-gray-300">
                Face multiple opponents simultaneously in live battles
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle>Winner Takes All</CardTitle>
              <CardDescription className="text-gray-300">80% of total entry fees goes to the winner!</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <Users className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle>Multiplayer Fun</CardTitle>
              <CardDescription className="text-gray-300">2-10 players can join each game room</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-900">1</span>
            </div>
            <h3 className="text-white font-bold mb-2">Sign Up</h3>
            <p className="text-gray-300">Create account and get ₹10 free</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-900">2</span>
            </div>
            <h3 className="text-white font-bold mb-2">Join Game</h3>
            <p className="text-gray-300">Pay ₹10 and wait for opponents</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-900">3</span>
            </div>
            <h3 className="text-white font-bold mb-2">Battle</h3>
            <p className="text-gray-300">Compete in real-time challenges</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-900">4</span>
            </div>
            <h3 className="text-white font-bold mb-2">Win & Earn</h3>
            <p className="text-gray-300">Winner gets 80% of total pool</p>
          </div>
        </div>
      </section>

      {/* Prize Structure */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-12">Prize Structure</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">2 Players</CardTitle>
              <div className="text-4xl font-bold text-yellow-400">₹16</div>
              <CardDescription className="text-gray-300">Winner gets 80% of ₹20</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li>• Entry: ₹10 each</li>
                <li>• Total Pool: ₹20</li>
                <li>• Winner: ₹16</li>
                <li>• Platform: ₹4</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white border-yellow-400">
            <CardHeader className="text-center">
              <Badge className="mb-2 bg-yellow-400 text-purple-900">Popular</Badge>
              <CardTitle className="text-2xl">5 Players</CardTitle>
              <div className="text-4xl font-bold text-yellow-400">₹40</div>
              <CardDescription className="text-gray-300">Winner gets 80% of ₹50</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li>• Entry: ₹10 each</li>
                <li>• Total Pool: ₹50</li>
                <li>• Winner: ₹40</li>
                <li>• Platform: ₹10</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">10 Players</CardTitle>
              <div className="text-4xl font-bold text-yellow-400">₹80</div>
              <CardDescription className="text-gray-300">Winner gets 80% of ₹100</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li>• Entry: ₹10 each</li>
                <li>• Total Pool: ₹100</li>
                <li>• Winner: ₹80</li>
                <li>• Platform: ₹20</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">100% Safe & Secure</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your money and data are protected with bank-level security. Fair play guaranteed.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-yellow-400" />
                <span className="text-xl font-bold text-white">Qchamp</span>
              </div>
              <p className="text-gray-400">The ultimate multiplayer brain battle platform</p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Games</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/games/math">Math Battle</Link>
                </li>
                <li>
                  <Link href="/games/quiz">Quiz Battle</Link>
                </li>
                <li>
                  <Link href="/how-it-works">How It Works</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/fair-play">Fair Play</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Qchamp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
