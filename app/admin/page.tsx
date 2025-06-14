"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Users, Wallet, Trophy, TrendingUp, CheckCircle, XCircle, Eye, Ban } from "lucide-react"

export default function AdminPage() {
  const [totalUsers] = useState(1247)
  const [activeGames] = useState(23)
  const [totalRevenue] = useState(45680)
  const [todayRevenue] = useState(2340)

  const recentGames = [
    {
      id: "G001",
      players: ["Player1", "Player2", "Player3"],
      entryFee: 10,
      winner: "Player1",
      prize: 24,
      commission: 6,
      status: "completed",
    },
    {
      id: "G002",
      players: ["QuizMaster", "BrainBox"],
      entryFee: 20,
      winner: "QuizMaster",
      prize: 32,
      commission: 8,
      status: "completed",
    },
    {
      id: "G003",
      players: ["User123", "Player456", "QuizPro"],
      entryFee: 5,
      winner: "QuizPro",
      prize: 12,
      commission: 3,
      status: "completed",
    },
  ]

  const withdrawalRequests = [
    { id: "W001", user: "john_doe", amount: 150, requestDate: "2024-01-15", status: "pending" },
    { id: "W002", user: "quiz_master", amount: 200, requestDate: "2024-01-14", status: "approved" },
    { id: "W003", user: "brain_box", amount: 100, requestDate: "2024-01-14", status: "completed" },
  ]

  const userManagement = [
    {
      id: "U001",
      name: "John Doe",
      email: "john@example.com",
      walletBalance: 250,
      totalGames: 15,
      winRate: 67,
      status: "active",
    },
    {
      id: "U002",
      name: "Quiz Master",
      email: "quiz@example.com",
      walletBalance: 180,
      totalGames: 22,
      winRate: 73,
      status: "active",
    },
    {
      id: "U003",
      name: "Suspicious User",
      email: "sus@example.com",
      walletBalance: 500,
      totalGames: 3,
      winRate: 100,
      status: "flagged",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <Badge className="bg-red-500 text-white">Admin Access</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-10 w-10 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{totalUsers.toLocaleString()}</p>
                  <p className="text-gray-300">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Trophy className="h-10 w-10 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{activeGames}</p>
                  <p className="text-gray-300">Active Games</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Wallet className="h-10 w-10 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-gray-300">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-10 w-10 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">₹{todayRevenue.toLocaleString()}</p>
                  <p className="text-gray-300">Today's Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger
              value="games"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              Game History
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              Withdrawals
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Game History */}
          <TabsContent value="games">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Games</CardTitle>
                <CardDescription className="text-gray-300">Monitor game activity and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGames.map((game) => (
                    <div key={game.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-blue-500 text-white">{game.id}</Badge>
                          <span className="text-white font-semibold">₹{game.entryFee} Entry</span>
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {game.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-semibold">Commission: ₹{game.commission}</p>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-300">Players:</p>
                          <p className="text-white">{game.players.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">Winner:</p>
                          <p className="text-yellow-400 font-semibold">{game.winner}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">Prize Distributed:</p>
                          <p className="text-white">₹{game.prize}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-300">Monitor and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userManagement.map((user) => (
                    <div key={user.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-semibold">{user.name}</p>
                            <p className="text-gray-300 text-sm">{user.email}</p>
                          </div>
                          <Badge
                            className={`${
                              user.status === "active"
                                ? "bg-green-500"
                                : user.status === "flagged"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                            } text-white`}
                          >
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right text-sm">
                            <p className="text-white">Wallet: ₹{user.walletBalance}</p>
                            <p className="text-gray-300">
                              Games: {user.totalGames} | Win: {user.winRate}%
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-white border-white/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-400 border-red-400">
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals */}
          <TabsContent value="withdrawals">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Withdrawal Requests</CardTitle>
                <CardDescription className="text-gray-300">Process user withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div key={request.id} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className="bg-blue-500 text-white">{request.id}</Badge>
                          <div>
                            <p className="text-white font-semibold">{request.user}</p>
                            <p className="text-gray-300 text-sm">Requested: {request.requestDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-white font-bold">₹{request.amount}</p>
                            <Badge
                              className={`${
                                request.status === "pending"
                                  ? "bg-yellow-500"
                                  : request.status === "approved"
                                    ? "bg-blue-500"
                                    : request.status === "completed"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                              } text-white`}
                            >
                              {request.status}
                            </Badge>
                          </div>
                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-green-500 text-white hover:bg-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-400 border-red-400">
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>Revenue Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Today's Revenue</span>
                      <span className="text-white font-bold">₹{todayRevenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">This Week</span>
                      <span className="text-white font-bold">₹{(todayRevenue * 7).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">This Month</span>
                      <span className="text-white font-bold">₹{(todayRevenue * 30).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Revenue</span>
                      <span className="text-green-400 font-bold">₹{totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Users</span>
                      <span className="text-white font-bold">{totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Active Users (24h)</span>
                      <span className="text-white font-bold">{Math.floor(totalUsers * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Games Played Today</span>
                      <span className="text-white font-bold">{Math.floor(todayRevenue / 2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Game Value</span>
                      <span className="text-white font-bold">₹12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
