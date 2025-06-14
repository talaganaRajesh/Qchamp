import {
  doc,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  increment,
  runTransaction,
} from "firebase/firestore"
import { db } from "./firebase"

export interface MathQuestion {
  question: string
  answer: number
  timeLimit: number
}

export interface MathGameRoom {
  id: string
  hostId: string
  players: Array<{
    uid: string
    name: string
    score: number
    isReady: boolean
    answers: number[]
  }>
  entryFee: number
  maxPlayers: number
  currentQuestion: number
  questions: MathQuestion[]
  status: "waiting" | "starting" | "playing" | "finished"
  prizePool: number
  winnerId?: string
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
  gameType: "math"
}

// Generate random math question
const generateMathQuestion = (): MathQuestion => {
  const operations = ["+", "-", "*"]
  const operation = operations[Math.floor(Math.random() * operations.length)]

  let num1: number, num2: number, answer: number, question: string

  switch (operation) {
    case "+":
      num1 = Math.floor(Math.random() * 50) + 1
      num2 = Math.floor(Math.random() * 50) + 1
      answer = num1 + num2
      question = `${num1} + ${num2} = ?`
      break
    case "-":
      num1 = Math.floor(Math.random() * 50) + 25
      num2 = Math.floor(Math.random() * 25) + 1
      answer = num1 - num2
      question = `${num1} - ${num2} = ?`
      break
    case "*":
      num1 = Math.floor(Math.random() * 12) + 1
      num2 = Math.floor(Math.random() * 12) + 1
      answer = num1 * num2
      question = `${num1} × ${num2} = ?`
      break
    default:
      num1 = 5
      num2 = 5
      answer = 10
      question = "5 + 5 = ?"
  }

  return {
    question,
    answer,
    timeLimit: 15, // 15 seconds per question
  }
}

// Create math game room
export const createMathGame = async (hostId: string): Promise<string> => {
  try {
    // Deduct entry fee from host's wallet
    await deductWalletBalance(hostId, 10)

    // Generate 10 math questions
    const questions = Array.from({ length: 10 }, () => generateMathQuestion())

    const gameRoom: Omit<MathGameRoom, "id"> = {
      hostId,
      players: [],
      entryFee: 10,
      maxPlayers: 10,
      currentQuestion: 0,
      questions,
      status: "waiting",
      prizePool: 10,
      createdAt: new Date(),
      gameType: "math",
    }

    const docRef = await addDoc(collection(db, "mathGames"), gameRoom)

    // Add host as first player
    await joinMathGame(docRef.id, hostId)

    return docRef.id
  } catch (error) {
    console.error("Error creating math game:", error)
    throw error
  }
}

// Join math game room
export const joinMathGame = async (gameId: string, playerId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "mathGames", gameId)
    const gameDoc = await getDoc(gameRef)

    if (!gameDoc.exists()) {
      throw new Error("Game not found")
    }

    const gameData = gameDoc.data() as MathGameRoom

    if (gameData.status !== "waiting") {
      throw new Error("Game already started")
    }

    if (gameData.players.length >= gameData.maxPlayers) {
      throw new Error("Game is full")
    }

    // Check if player already joined
    if (gameData.players.some((p) => p.uid === playerId)) {
      throw new Error("Already joined this game")
    }

    // Deduct entry fee (except for host)
    if (playerId !== gameData.hostId) {
      await deductWalletBalance(playerId, gameData.entryFee)
    }

    // Get player info
    const playerDoc = await getDoc(doc(db, "users", playerId))
    const playerData = playerDoc.data()

    const newPlayer = {
      uid: playerId,
      name: playerData?.name || "Anonymous",
      score: 0,
      isReady: false,
      answers: [],
    }

    await updateDoc(gameRef, {
      players: [...gameData.players, newPlayer],
      prizePool: increment(gameData.entryFee),
    })

    // Auto-start if 2+ players
    if (gameData.players.length >= 1) {
      // Will have 2 players after this join
      setTimeout(() => startMathGame(gameId), 3000) // Start after 3 seconds
    }
  } catch (error) {
    console.error("Error joining math game:", error)
    throw error
  }
}

// Start math game
export const startMathGame = async (gameId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "mathGames", gameId)
    await updateDoc(gameRef, {
      status: "playing",
      startedAt: new Date(),
    })
  } catch (error) {
    console.error("Error starting math game:", error)
    throw error
  }
}

// Submit math answer
export const submitMathAnswer = async (
  gameId: string,
  playerId: string,
  answer: number,
  timeSpent: number,
): Promise<void> => {
  try {
    const gameRef = doc(db, "mathGames", gameId)

    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef)
      const gameData = gameDoc.data() as MathGameRoom

      const currentQ = gameData.questions[gameData.currentQuestion]
      const isCorrect = answer === currentQ.answer

      // Calculate points (first correct answer gets more points)
      let points = 0
      if (isCorrect) {
        const speedBonus = Math.max(0, 10 - timeSpent) // More points for faster answers
        points = 10 + speedBonus
      }

      // Update player's score and answers
      const updatedPlayers = gameData.players.map((player) => {
        if (player.uid === playerId) {
          return {
            ...player,
            score: player.score + points,
            answers: [...player.answers, answer],
          }
        }
        return player
      })

      transaction.update(gameRef, { players: updatedPlayers })

      // Check if all players answered or time is up
      const allAnswered = updatedPlayers.every((p) => p.answers.length > gameData.currentQuestion)

      if (allAnswered) {
        // Move to next question or end game
        if (gameData.currentQuestion < gameData.questions.length - 1) {
          transaction.update(gameRef, {
            currentQuestion: increment(1),
          })
        } else {
          // End game
          await endMathGame(gameId)
        }
      }
    })
  } catch (error) {
    console.error("Error submitting math answer:", error)
    throw error
  }
}

// End math game and distribute prizes
export const endMathGame = async (gameId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "mathGames", gameId)

    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef)
      const gameData = gameDoc.data() as MathGameRoom

      // Find winner (highest score)
      const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score)
      const winner = sortedPlayers[0]

      // Calculate prize distribution (80% to winner, 20% platform fee)
      const platformCommission = Math.floor(gameData.prizePool * 0.2)
      const winnerPrize = gameData.prizePool - platformCommission

      // Update winner's wallet
      const winnerRef = doc(db, "users", winner.uid)
      transaction.update(winnerRef, {
        walletBalance: increment(winnerPrize),
        totalWins: increment(1),
        totalGames: increment(1),
      })

      // Update other players' game count
      gameData.players.forEach((player) => {
        if (player.uid !== winner.uid) {
          const playerRef = doc(db, "users", player.uid)
          transaction.update(playerRef, {
            totalGames: increment(1),
          })
        }
      })

      // Update game status
      transaction.update(gameRef, {
        status: "finished",
        winnerId: winner.uid,
        finishedAt: new Date(),
      })

      // Record platform earnings
      const earningsRef = doc(db, "platform_earnings", new Date().toISOString().split("T")[0])
      transaction.set(
        earningsRef,
        {
          date: new Date(),
          totalCommission: increment(platformCommission),
          gamesCount: increment(1),
          gameType: "math",
        },
        { merge: true },
      )

      // Record transaction for winner
      const transactionRef = collection(db, "transactions")
      transaction.set(doc(transactionRef), {
        userId: winner.uid,
        type: "credit",
        amount: winnerPrize,
        description: `Math Battle Win - ${gameId}`,
        status: "completed",
        createdAt: new Date(),
      })
    })
  } catch (error) {
    console.error("Error ending math game:", error)
    throw error
  }
}

// Listen to math game updates
export const subscribeToMathGame = (callback: (games: MathGameRoom[]) => void) => {
  const gamesRef = collection(db, "mathGames")
  const q = query(gamesRef, where("status", "in", ["waiting", "playing"]))

  return onSnapshot(q, (snapshot) => {
    const games = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MathGameRoom[]

    callback(games)
  })
}

// Listen to specific math game
export const subscribeToSpecificMathGame = (gameId: string, callback: (game: MathGameRoom | null) => void) => {
  const gameRef = doc(db, "mathGames", gameId)
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as MathGameRoom)
    } else {
      callback(null)
    }
  })
}

// Deduct wallet balance
const deductWalletBalance = async (userId: string, amount: number): Promise<void> => {
  const userRef = doc(db, "users", userId)
  const userDoc = await getDoc(userRef)

  if (!userDoc.exists()) {
    throw new Error("User not found")
  }

  const userData = userDoc.data()
  if (userData.walletBalance < amount) {
    throw new Error("Insufficient wallet balance")
  }

  await updateDoc(userRef, {
    walletBalance: increment(-amount),
  })
}
