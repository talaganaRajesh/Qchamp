import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore"
import { auth, db } from "./firebase"

export interface UserProfile {
  uid: string
  name: string
  email: string
  phone?: string
  walletBalance: number
  referralCode: string
  referredBy?: string
  totalGames: number
  totalWins: number
  createdAt: Date
  lastActive: Date
  notifications?: {
    gameInvites: boolean
    winnings: boolean
    promotions: boolean
  }
  privacy?: {
    showProfile: boolean
    showStats: boolean
  }
}

// Generate unique referral code
export const generateReferralCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Create user profile in Firestore
export const createUserProfile = async (
  user: User,
  additionalData: {
    name: string
    phone?: string
    referralCode?: string
  },
): Promise<void> => {
  try {
    const userRef = doc(db, "users", user.uid)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      const referralCode = generateReferralCode()
      const welcomeBonus = 10 // Base welcome bonus

      // Create user data object
      const userData: any = {
        uid: user.uid,
        name: additionalData.name,
        email: user.email || "",
        walletBalance: welcomeBonus,
        referralCode,
        totalGames: 0,
        totalWins: 0,
        createdAt: new Date(),
        lastActive: new Date(),
        notifications: {
          gameInvites: true,
          winnings: true,
          promotions: false,
        },
        privacy: {
          showProfile: true,
          showStats: true,
        },
      }

      // Add optional fields if they have values
      if (additionalData.phone && additionalData.phone.trim()) {
        userData.phone = additionalData.phone.trim()
      }

      if (additionalData.referralCode && additionalData.referralCode.trim()) {
        userData.referredBy = additionalData.referralCode.trim()
      }

      await setDoc(userRef, userData)
      console.log("User profile created successfully:", user.uid)

      // Process referral bonus if referred
      if (additionalData.referralCode && additionalData.referralCode.trim()) {
        await processReferralBonus(additionalData.referralCode.trim(), user.uid)
      }

      // Record welcome bonus transaction
      await addDoc(collection(db, "transactions"), {
        userId: user.uid,
        type: "credit",
        amount: welcomeBonus,
        description: "Welcome Bonus",
        status: "completed",
        createdAt: new Date(),
      })
    } else {
      console.log("User profile already exists:", user.uid)

      // Update last active time
      await updateDoc(userRef, {
        lastActive: new Date(),
      })
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Process referral bonus
export const processReferralBonus = async (referralCode: string, newUserId: string): Promise<void> => {
  try {
    // Find referrer by referral code
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("referralCode", "==", referralCode))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const referrerDoc = querySnapshot.docs[0]
      const referrerId = referrerDoc.id
      const referralBonus = 10

      // Add bonus to both users
      await updateDoc(doc(db, "users", referrerId), {
        walletBalance: increment(referralBonus),
      })

      await updateDoc(doc(db, "users", newUserId), {
        walletBalance: increment(referralBonus),
      })

      // Record referral
      await setDoc(doc(db, "referrals", `${referrerId}_${newUserId}`), {
        referrerId,
        referredUserId: newUserId,
        bonus: referralBonus,
        createdAt: new Date(),
        status: "completed",
      })

      // Record transactions for both users
      await addDoc(collection(db, "transactions"), {
        userId: referrerId,
        type: "credit",
        amount: referralBonus,
        description: "Referral Bonus - Friend Joined",
        status: "completed",
        createdAt: new Date(),
      })

      await addDoc(collection(db, "transactions"), {
        userId: newUserId,
        type: "credit",
        amount: referralBonus,
        description: "Referral Bonus - Used Referral Code",
        status: "completed",
        createdAt: new Date(),
      })

      console.log("Referral bonus processed successfully")
    } else {
      console.log("Invalid referral code:", referralCode)
      throw new Error("Invalid referral code")
    }
  } catch (error) {
    console.error("Error processing referral bonus:", error)
    throw error
  }
}

// Phone authentication
export const signInWithPhone = async (phoneNumber: string): Promise<any> => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  })

  return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
}

// Email authentication
export const signInWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signUpWithEmail = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  return await firebaseSignOut(auth)
}

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}
