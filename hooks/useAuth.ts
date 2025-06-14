"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { onAuthStateChange, type UserProfile } from "@/lib/auth"
import { db } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      try {
        setError(null)

        if (authUser) {
          setUser(authUser)

          // Set up real-time listener for user profile
          const userRef = doc(db, "users", authUser.uid)

          const unsubscribeProfile = onSnapshot(
            userRef,
            (doc) => {
              if (doc.exists()) {
                const userData = doc.data() as UserProfile
                setUserProfile(userData)
              } else {
                console.log("User profile not found in Firestore")
                setUserProfile(null)
              }
              setLoading(false)
            },
            (firestoreError) => {
              console.error("Error fetching user profile:", firestoreError)
              setError("Failed to load user profile. Please try refreshing the page.")
              setUserProfile(null)
              setLoading(false)
            },
          )

          // Return cleanup function for profile listener
          return () => unsubscribeProfile()
        } else {
          setUser(null)
          setUserProfile(null)
          setLoading(false)
        }
      } catch (authError: any) {
        console.error("Auth state change error:", authError)
        setError("Authentication error occurred")
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  return { user, userProfile, loading, error }
}
