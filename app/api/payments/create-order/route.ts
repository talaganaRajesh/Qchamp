import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, userId } = await request.json()

    // Validate input
    if (!amount || !currency || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (amount < 1000) {
      // Minimum ₹10 (1000 paise)
      return NextResponse.json({ error: "Minimum amount is ₹10" }, { status: 400 })
    }

    // Check if environment variables are available
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay environment variables not configured")
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    // Dynamically import and initialize Razorpay only when needed
    const Razorpay = (await import("razorpay")).default

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_${Date.now()}_${userId}`,
      notes: {
        userId,
        purpose: "wallet_recharge",
      },
    })

    console.log("Razorpay order created:", order.id)

    // Return order details without exposing the key
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    })
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
