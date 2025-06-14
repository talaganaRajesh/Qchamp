"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { createRazorpayOrder, processRazorpayPayment } from "@/lib/payments"
import { useRouter } from "next/navigation"

export default function RechargePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi")

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const quickRechargeAmounts = [20, 50, 100, 200, 500, 1000]

  const handleRecharge = async () => {
    if (!user || !rechargeAmount) return

    if (!razorpayLoaded) {
      alert("Payment service is loading. Please try again in a moment.")
      return
    }

    const amount = Number(rechargeAmount)
    if (amount < 10) {
      alert("Minimum recharge amount is ₹10")
      return
    }

    setLoading(true)

    try {
      const order = await createRazorpayOrder(amount, user.uid)

      processRazorpayPayment(
        order,
        user.uid,
        amount,
        async (paymentId) => {
          setRechargeAmount("")
          alert("Money added successfully!")
          router.push("/wallet")
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

  // Show loading while checking authentication
  if (authLoading) {
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
            <Link href="/wallet" className="text-white hover:text-yellow-400 flex items-center">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Wallet
            </Link>
            <h1 className="text-2xl font-bold text-white">Add Money</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
                    className={`text-white border-white/20 hover:bg-yellow-400 hover:text-purple-900 ${
                      rechargeAmount === amount.toString() ? "bg-yellow-400 text-purple-900" : ""
                    }`}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <Label htmlFor="recharge-amount" className="text-white">
                Or Enter Custom Amount (Min ₹10)
              </Label>
              <Input
                id="recharge-amount"
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                min="10"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <Label className="text-white mb-3 block">Payment Method</Label>
              <div className="space-y-3">
                <Card
                  className={`bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 ${
                    paymentMethod === "upi" ? "border-green-500" : ""
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                >
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

                <Card
                  className={`bg-white/5 border-white/10 cursor-pointer hover:bg-white/10 ${
                    paymentMethod === "card" ? "border-blue-500" : ""
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
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
              disabled={!rechargeAmount || loading || !razorpayLoaded || Number(rechargeAmount) < 10}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Add ₹${rechargeAmount || 0} to Wallet`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
