'use client';

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Zap, Gift, Shield, Calculator, BookOpen, ArrowRight, Star, CheckCircle } from "lucide-react"

import NavBar from '@/components/NavBar';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [coinFlip, setCoinFlip] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCoinFlip(prev => prev + 360)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950/95 to-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      {/* Header */}
      <NavBar/>

      {/* Hero Section */}
      <section className="relative mt-10 container mx-auto px-6 py-20 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="mb-8 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-400 border-emerald-500/30 hover:bg-gradient-to-r hover:from-emerald-500/30 hover:to-blue-500/30 transition-all duration-300 text-sm px-4 py-2">
            <Trophy className="w-4 h-4 mr-2" />
            Multiplayer Brain Battles
          </Badge>
          
           <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none tracking-tight">
              <span className=" mr-5 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">WIN</span>
              <span className=" bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">MONEY</span>
            </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Challenge Friends in Math & GK. <span className="text-green-600 font-semibold">Win with Knowledge!</span>
            <br className="hidden md:block" />
            <span className="text-white font-semibold">Winner takes all!</span>
          </p>
          
          <div className="flex mt-20 flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a 
              href='/signup'
              className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-semibold shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 px-8 flex flex-row items-center justify-center rounded-sm py-5 text-lg group"
            >
              Start Playing Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href='/how-it-works'
              className="border-green-800 bg-transparent text-slate-300 border hover:text-white hover:border-emerald-400 transition-all duration-300 px-8 py-5 text-lg"
            >
              How It Works
            </a>
          </div>

          {/* Referral Bonus Banner */}
          <div className="relative max-w-md mx-auto">
            <div 
              className="p-6 rounded-2xl backdrop-blur-sm bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300"
              style={{ transform: `rotateY(${coinFlip}deg)` }}
            >
              <Gift className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-xl mb-2">Referral Bonus!</h3>
              <p className="text-emerald-200">Get ₹10 for every friend you invite. They get ₹10 too!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Game Types */}
      <section className="container mx-auto px-6 py-20">
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Choose Your <span className="text-emerald-400">Battle</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="group bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-800/70 hover:border-emerald-500/50 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <Calculator className="h-20 w-20 text-emerald-400 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                    <span className="text-slate-900 text-xs font-bold">₹</span>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-3">Math Battle</CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  Lightning-fast math challenges. First to answer wins!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-slate-300 mb-8">
                  {['Addition, Subtraction, Multiplication', 'Real-time competition', 'Speed matters', '2-10 players per game'].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 text-base font-semibold">
                    ₹10 Entry Fee
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-800/70 hover:border-violet-500/50 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
              <CardHeader className="text-center pb-6">
                <div className="relative mb-6">
                  <BookOpen className="h-20 w-20 text-violet-600 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                    <span className="text-slate-900 text-xs font-bold">₹</span>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold mb-3">Quiz Battle</CardTitle>
                <CardDescription className="text-slate-300 text-lg">
                  General knowledge questions from around the world
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-slate-300 mb-8">
                  {['Fresh questions every time', 'Multiple choice format', 'Time-based scoring', '2-10 players per game'].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-violet-400 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-violet-800 to-violet-600  text-white px-4 py-2 text-base font-semibold">
                    ₹10 Entry Fee
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Why Choose <span className="text-emerald-400">Qchamp</span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Real-Time Multiplayer', desc: 'Face multiple opponents simultaneously in live battles', color: 'text-yellow-400' },
              { icon: Trophy, title: 'Winner Takes All', desc: '90% of total entry fees goes to the winner!', color: 'text-emerald-400' },
              { icon: Users, title: 'Multiplayer Fun', desc: '2-10 players can join each game room', color: 'text-violet-400' }
            ].map((feature, index) => (
              <Card key={index} className="group bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-800/70 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="text-center">
                  <feature.icon className={`h-16 w-16 ${feature.color} mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`} />
                  <CardTitle className="text-2xl font-bold mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-300 text-lg leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            How It <span className="text-emerald-400">Works</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create account and get ₹10 free' },
              { step: '2', title: 'Join Game', desc: 'Pay ₹10 and wait for opponents' },
              { step: '3', title: 'Battle', desc: 'Compete in real-time challenges' },
              { step: '4', title: 'Win & Earn', desc: 'Winner gets 90% of total pool' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110">
                    <span className="text-3xl font-bold text-white">{item.step}</span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent -z-10" />
                  )}
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-slate-300 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Structure */}
      <section className="container mx-auto px-6 py-20">
        <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-5xl font-bold text-white text-center mb-16">
            Prize <span className="text-emerald-400">Structure</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { players: '2 Players', prize: '₹18', total: '₹20', entry: '₹10 each', platform: '₹2', popular: false },
              { players: '5 Players', prize: '₹45', total: '₹50', entry: '₹10 each', platform: '₹5', popular: true },
              { players: '10 Players', prize: '₹90', total: '₹100', entry: '₹10 each', platform: '₹10', popular: false }
            ].map((prize, index) => (
              <Card key={index} className={`group bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-800/70 transition-all duration-500 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 ${prize.popular ? 'border-emerald-500/50 ring-2 ring-emerald-500/20' : ''}`}>
                <CardHeader className="text-center pb-6">
                  {prize.popular && (
                    <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <CardTitle className="text-2xl font-bold mb-4">{prize.players}</CardTitle>
                  <div className="text-6xl font-bold text-emerald-400 mb-2 group-hover:scale-105 transition-transform duration-300">
                    {prize.prize}
                  </div>
                  <CardDescription className="text-slate-300 text-lg">
                    Winner gets 90% of {prize.total}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-slate-300">
                    {[
                      `Entry: ${prize.entry}`,
                      `Total Pool: ${prize.total}`,
                      `Winner: ${prize.prize}`,
                      `Platform: ${prize.platform}`
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                        <span>{item.split(':')[0]}:</span>
                        <span className="font-semibold text-white">{item.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="container mx-auto px-6 py-20">
        <div className={`text-center transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative mb-8">
            <Shield className="h-20 w-20 text-emerald-400 mx-auto" />
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-8">
            100% Safe & <span className="text-emerald-400">Secure</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Your money and data are protected with <span className="text-white font-semibold">bank-level security</span>. 
            <br className="hidden md:block" />
            <span className="text-emerald-400 font-semibold">Fair play guaranteed.</span>
          </p>
        </div>
      </section>

      {/* Footer */}
     

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  )
}