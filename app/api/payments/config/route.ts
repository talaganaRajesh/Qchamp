import { NextResponse } from "next/server"

export async function GET() {
  try {
    if (!process.env.RAZORPAY_KEY_ID) {
      return NextResponse.json({ error: "Payment service not configured" }, { status: 500 })
    }

    // Only return the public key (safe to expose)
    return NextResponse.json({
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Error getting payment config:", error)
    return NextResponse.json({ error: "Failed to get payment config" }, { status: 500 })
  }
}
