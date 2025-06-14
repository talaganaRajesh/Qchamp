import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { doc, updateDoc, increment, addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount } = await request.json()

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Payment verification not configured" }, { status: 500 })
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature === razorpay_signature) {
      try {
        // Payment is verified, add money to wallet
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, {
          walletBalance: increment(amount),
        })

        // Record transaction
        await addDoc(collection(db, "transactions"), {
          userId,
          type: "credit",
          amount,
          description: "Wallet Recharge",
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          status: "completed",
          createdAt: new Date(),
        })

        console.log(`Payment verified and wallet updated for user ${userId}, amount: ₹${amount}`)

        return NextResponse.json({
          success: true,
          message: "Payment verified and wallet updated successfully",
        })
      } catch (dbError: any) {
        console.error("Database error during payment verification:", dbError)
        return NextResponse.json(
          {
            error: "Payment verified but failed to update wallet. Please contact support.",
          },
          { status: 500 },
        )
      }
    } else {
      console.error("Invalid payment signature")
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      {
        error: error.message || "Payment verification failed",
      },
      { status: 500 },
    )
  }
}
