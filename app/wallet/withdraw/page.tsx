"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useWallet } from "@/hooks/useWallet"
import { createWithdrawalRequest } from "@/lib/payments"
import { useRouter } from "next/navigation"

export default function WithdrawPage() {
  const { user, loading: authLoading } = useAuth()
  const { balance } = useWallet()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [accountName, setAccountName] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!withdrawAmount) {
      errors.amount = "Amount is required"
    } else if (Number(withdrawAmount) < 100) {
      errors.amount = "Minimum withdrawal amount is ₹100"
    } else if (Number(withdrawAmount) > balance) {
      errors.amount = "Amount exceeds available balance"
    }

    if (!accountNumber) {
      errors.accountNumber = "Account number is required"
    } else if (accountNumber.length < 9 || accountNumber.length > 18) {
      errors.accountNumber = "Invalid account number"
    }

    if (!ifscCode) {
      errors.ifscCode = "IFSC code is required"
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      errors.ifscCode = "Invalid IFSC code format"
    }

    if (!accountName) {
      errors.accountName = "Account holder name is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleWithdraw = async () => {
    if (!user) return

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const bankDetails = {
        accountNumber,
        ifscCode,
        accountHolderName: accountName,
      }

      await createWithdrawalRequest(user.uid, Number(withdrawAmount), bankDetails)
      alert("Withdrawal request submitted successfully! You will receive the money in 1-3 business days.")
      router.push("/wallet")
    } catch (error: any) {
      alert(error.message || "Failed to process withdrawal")
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
            <h1 className="text-2xl font-bold text-white">Withdraw Money</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Withdraw Money</CardTitle>
            <CardDescription className="text-gray-300">
              Available Balance: <span className="text-yellow-400 font-bold">₹{balance}</span>
            </CardDescription>
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
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  formErrors.amount ? "border-red-500" : ""
                }`}
                min="100"
                max={balance}
              />
              {formErrors.amount && <p className="text-red-400 text-sm mt-1">{formErrors.amount}</p>}
            </div>

            <div>
              <Label htmlFor="account-number" className="text-white">
                Bank Account Number
              </Label>
              <Input
                id="account-number"
                type="text"
                placeholder="Enter your bank account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  formErrors.accountNumber ? "border-red-500" : ""
                }`}
              />
              {formErrors.accountNumber && <p className="text-red-400 text-sm mt-1">{formErrors.accountNumber}</p>}
            </div>

            <div>
              <Label htmlFor="ifsc-code" className="text-white">
                IFSC Code
              </Label>
              <Input
                id="ifsc-code"
                type="text"
                placeholder="Enter bank IFSC code (e.g., SBIN0001234)"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  formErrors.ifscCode ? "border-red-500" : ""
                }`}
              />
              {formErrors.ifscCode && <p className="text-red-400 text-sm mt-1">{formErrors.ifscCode}</p>}
            </div>

            <div>
              <Label htmlFor="account-name" className="text-white">
                Account Holder Name
              </Label>
              <Input
                id="account-name"
                type="text"
                placeholder="Enter account holder name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                  formErrors.accountName ? "border-red-500" : ""
                }`}
              />
              {formErrors.accountName && <p className="text-red-400 text-sm mt-1">{formErrors.accountName}</p>}
            </div>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Withdrawal Information</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Processing time: 1-3 business days</li>
                <li>• No withdrawal fees</li>
                <li>• Minimum withdrawal amount: ₹100</li>
                <li>• Money will be transferred to your registered bank account</li>
              </ul>
            </div>

            <Button
              onClick={handleWithdraw}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading || !withdrawAmount || Number(withdrawAmount) < 100}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Withdraw ₹${withdrawAmount || 0}`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
