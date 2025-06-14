"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useWallet } from "@/hooks/useWallet"
import { createRazorpayOrder, processRazorpayPayment, createWithdrawalRequest } from "@/lib/payments"

export default function WalletPage() {
  const { user } = useAuth()
  const { balance } = useWallet()
  const [loading, setLoading] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    script.onerror = () => console.error("Failed to load Razorpay script")
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const quickRechargeAmounts = [20, 50, 100, 200, 500, 1000]

  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 48,
      description: "Quiz Win vs QuizMaster",
      time: "2 hours ago",
      status: "completed",
    },
    { id: 2, type: "debit", amount: 10, description: "Game Entry Fee", time: "2 hours ago", status: "completed" },
    { id: 3, type: "credit", amount: 100, description: "Wallet Recharge", time: "1 day ago", status: "completed" },
    { id: 4, type: "credit", amount: 10, description: "Referral Bonus", time: "2 days ago", status: "completed" },
    { id: 5, type: "debit", amount: 50, description: "Withdrawal", time: "3 days ago", status: "pending" },
  ]

  const handleRecharge = async () => {
    if (!user || !rechargeAmount) return

    if (!razorpayLoaded) {
      alert("Payment service is loading. Please try again in a moment.")
      return
    }

    setLoading(true)

    try {
      const order = await createRazorpayOrder(Number(rechargeAmount), user.uid)

      processRazorpayPayment(
        order,
        user.uid,
        Number(rechargeAmount),
        async (paymentId) => {
          setRechargeAmount("")
          alert("Money added successfully!")
        },
        (error) => {
          console.error("Payment failed:", error)
          alert("Payment failed. Please try again.")
        },
      )
    } catch (error: any) {
      console.error("Error processing payment:", error)
      alert(error.message || "Failed to process payment")
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount) return

    setLoading(true)

    try {
      // You'll need to collect bank details from user
      const bankDetails = {
        accountNumber: "1234567890", // Get from form
        ifscCode: "SBIN0001234", // Get from form
        accountHolderName: "User Name", // Get from form
      }

      await createWithdrawalRequest(user.uid, Number(withdrawAmount), bankDetails)
      setWithdrawAmount("")
      alert("Withdrawal request submitted successfully!")
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const walletBalance = balance

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-white hover:text-yellow-400">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white">Wallet</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Balance */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 text-purple-900 mb-6">
              <CardHeader className="text-center">
                <Wallet className="h-12 w-12 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold">₹{walletBalance}</CardTitle>
                <CardDescription className="text-purple-800">Available Balance</CardDescription>
              </CardHeader>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-green-500/20 border-green-500/50">
                <CardContent className="p-4 text-center">
                  <Plus className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-semibold">Add Money</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/20 border-blue-500/50">
                <CardContent className="p-4 text-center">
                  <Minus className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-semibold">Withdraw</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="recharge" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger
                  value="recharge"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
                >
                  Add Money
                </TabsTrigger>
                <TabsTrigger
                  value="withdraw"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
                >
                  Withdraw
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-purple-900"
                >
                  History
                </TabsTrigger>
              </TabsList>

              {/* Recharge Tab */}
              <TabsContent value="recharge" className="space-y-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Add Money to Wallet</CardTitle>
                    <CardDescription className="text-gray-300">Choose amount and payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!razorpayLoaded && (
                      <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                        <p className="text-yellow-400 text-sm">Loading payment service...</p>
                      </div>
                    )}

                    {/* Quick Amount Selection */}
                    <div>
                      <Label className="text-white mb-3 block">Quick Select</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {quickRechargeAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            onClick={() => setRechargeAmount(amount.toString())}
                            className="text-white border-white/20 hover:bg-yellow-400 hover:text-purple-900"
                          >
                            ₹{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <Label htmlFor="recharge-amount" className="text-white">
                        Or Enter Custom Amount
                      </Label>
                      <Input
                        id="recharge-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <Label className="text-white mb-3 block">Payment Method</Label>
                      <div className="space-y-3">
                        <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <Smartphone className="h-6 w-6 text-green-400" />
                              <div>
                                <p className="text-white font-semibold">UPI Payment</p>
                                <p className="text-gray-300 text-sm">Pay using any UPI app</p>
                              </div>
                              <Badge className="ml-auto bg-green-500 text-white">Instant</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/10">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <CreditCard className="h-6 w-6 text-blue-400" />
                              <div>
                                <p className="text-white font-semibold">Credit/Debit Card</p>
                                <p className="text-gray-300 text-sm">Visa, Mastercard, RuPay</p>
                              </div>
                              <Badge className="ml-auto bg-blue-500 text-white">Secure</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Button
                      onClick={handleRecharge}
                      className="w-full bg-yellow-400 text-purple-900 hover:bg-yellow-300"
                      disabled={!rechargeAmount || loading || !razorpayLoaded}
                    >
                      {loading ? "Processing..." : `Add ₹${rechargeAmount || 0} to Wallet`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Withdraw Tab */}
              <TabsContent value="withdraw" className="space-y-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Withdraw Money</CardTitle>
                    <CardDescription className="text-gray-300">Minimum withdrawal amount: ₹100</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="withdraw-amount" className="text-white">
                        Withdrawal Amount
                      </Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        placeholder="Enter amount (min ₹100)"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">Withdrawal Information</h4>
                      <ul className="text-blue-300 text-sm space-y-1">
                        <li>• Processing time: 1-3 business days</li>
                        <li>• No withdrawal fees</li>
                        <li>• Money will be transferred to your registered bank account</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleWithdraw}
                      className="w-full bg-blue-500 text-white hover:bg-blue-600"
                      disabled={!withdrawAmount || Number.parseInt(withdrawAmount) < 100 || loading}
                    >
                      {loading ? "Processing..." : `Withdraw ₹${withdrawAmount || 0}`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                      <History className="h-6 w-6" />
                      <span>Transaction History</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`p-2 rounded-full ${
                                transaction.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"
                              }`}
                            >
                              {transaction.type === "credit" ? (
                                <ArrowDownLeft className="h-5 w-5 text-green-400" />
                              ) : (
                                <ArrowUpRight className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{transaction.description}</p>
                              <p className="text-gray-300 text-sm">{transaction.time}</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center space-x-3">
                            <div>
                              <p
                                className={`font-bold ${
                                  transaction.type === "credit" ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                              </p>
                              <div className="flex items-center space-x-1">
                                {transaction.status === "completed" && (
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                )}
                                {transaction.status === "pending" && <Clock className="h-4 w-4 text-yellow-400" />}
                                {transaction.status === "failed" && <XCircle className="h-4 w-4 text-red-400" />}
                                <span
                                  className={`text-xs ${
                                    transaction.status === "completed"
                                      ? "text-green-400"
                                      : transaction.status === "pending"
                                        ? "text-yellow-400"
                                        : "text-red-400"
                                  }`}
                                >
                                  {transaction.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
