"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { useAuth } from "./useAuth"
import { db } from "@/lib/firebase"

export function useWallet() {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setBalance(0)
      setLoading(false)
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)

      const unsubscribe = onSnapshot(
        userRef,
        (doc) => {
          if (doc.exists()) {
            const userData = doc.data()
            setBalance(userData.walletBalance || 0)
            setError(null)
          } else {
            setBalance(0)
            setError("User wallet not found")
          }
          setLoading(false)
        },
        (error) => {
          console.error("Error listening to wallet updates:", error)
          setError("Failed to load wallet balance")
          setBalance(0)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (err: any) {
      console.error("Error setting up wallet listener:", err)
      setError("Failed to initialize wallet")
      setLoading(false)
    }
  }, [user])

  return { balance, loading, error }
}
