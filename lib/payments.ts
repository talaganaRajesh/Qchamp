import { doc, updateDoc, increment, addDoc, collection, getDoc } from "firebase/firestore"
import { db } from "./firebase"

// Razorpay configuration
declare global {
  interface Window {
    Razorpay: any
  }
}

export interface PaymentOrder {
  id: string
  userId: string
  amount: number
  currency: string
  status: "created" | "paid" | "failed"
  paymentId?: string
  createdAt: Date
}

export interface WithdrawalRequest {
  id: string
  userId: string
  amount: number
  bankDetails: {
    accountNumber: string
    ifscCode: string
    accountHolderName: string
  }
  status: "pending" | "approved" | "completed" | "rejected"
  createdAt: Date
  processedAt?: Date
}

// Create Razorpay order (server-side only)
export const createRazorpayOrder = async (amount: number, userId: string): Promise<any> => {
  try {
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: "INR",
        userId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

// Process Razorpay payment (client-side with server verification)
export const processRazorpayPayment = async (
  order: any,
  userId: string,
  amount: number,
  onSuccess: (paymentId: string) => void,
  onError: (error: any) => void,
) => {
  try {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      onError(new Error("Payment service not available"))
      return
    }

    // Get Razorpay public key from server
    const configResponse = await fetch("/api/payments/config")
    if (!configResponse.ok) {
      throw new Error("Failed to get payment configuration")
    }
    const config = await configResponse.json()

    const options = {
      key: config.key, // Get key from server
      amount: order.amount,
      currency: order.currency,
      name: "Qchamp",
      description: "Wallet Recharge",
      order_id: order.id,
      handler: async (response: any) => {
        try {
          // Verify payment on server
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
              amount,
            }),
          })

          if (verifyResponse.ok) {
            onSuccess(response.razorpay_payment_id)
          } else {
            const errorData = await verifyResponse.json()
            throw new Error(errorData.error || "Payment verification failed")
          }
        } catch (error) {
          onError(error)
        }
      },
      prefill: {
        name: "User",
        email: "user@example.com",
      },
      theme: {
        color: "#F59E0B", // Yellow color matching the theme
      },
      modal: {
        ondismiss: () => {
          onError(new Error("Payment cancelled by user"))
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on("payment.failed", (response: any) => {
      onError(new Error(response.error.description || "Payment failed"))
    })
    rzp.open()
  } catch (error) {
    onError(error)
  }
}

// Create withdrawal request
export const createWithdrawalRequest = async (
  userId: string,
  amount: number,
  bankDetails: WithdrawalRequest["bankDetails"],
): Promise<void> => {
  try {
    // Check if user has sufficient balance
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const userData = userDoc.data()
    if (userData.walletBalance < amount) {
      throw new Error("Insufficient balance")
    }

    if (amount < 100) {
      throw new Error("Minimum withdrawal amount is ₹100")
    }

    // Deduct amount from wallet (hold it)
    await updateDoc(userRef, {
      walletBalance: increment(-amount),
    })

    // Create withdrawal request
    await addDoc(collection(db, "withdrawals"), {
      userId,
      amount,
      bankDetails,
      status: "pending",
      createdAt: new Date(),
    })

    // Record transaction
    await addDoc(collection(db, "transactions"), {
      userId,
      type: "debit",
      amount,
      description: "Withdrawal Request",
      status: "pending",
      createdAt: new Date(),
    })
  } catch (error) {
    console.error("Error creating withdrawal request:", error)
    throw error
  }
}
