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

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  timeLimit: number
  category: string
  difficulty: string
}

export interface QuizGameRoom {
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
  questions: QuizQuestion[]
  status: "waiting" | "starting" | "playing" | "finished"
  prizePool: number
  winnerId?: string
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
  gameType: "quiz"
}

// Fetch questions from Open Trivia Database API
const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple&encode=url3986")
    const data = await response.json()

    if (data.response_code !== 0) {
      throw new Error("Failed to fetch questions from API")
    }

    return data.results.map((item: any) => {
      const question = decodeURIComponent(item.question)
      const correctAnswer = decodeURIComponent(item.correct_answer)
      const incorrectAnswers = item.incorrect_answers.map((ans: string) => decodeURIComponent(ans))

      // Shuffle options
      const options = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5)
      const correct = options.indexOf(correctAnswer)

      return {
        question,
        options,
        correct,
        timeLimit: 20, // 20 seconds per question
        category: decodeURIComponent(item.category),
        difficulty: item.difficulty,
      }
    })
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    // Fallback questions if API fails
    return [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
        timeLimit: 20,
        category: "Geography",
        difficulty: "easy",
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        timeLimit: 20,
        category: "Science",
        difficulty: "easy",
      },
      // Add more fallback questions...
    ]
  }
}

// Create quiz game room
export const createQuizGame = async (hostId: string): Promise<string> => {
  try {
    // Deduct entry fee from host's wallet
    await deductWalletBalance(hostId, 10)

    // Fetch fresh questions from API
    const questions = await fetchQuizQuestions()

    const gameRoom: Omit<QuizGameRoom, "id"> = {
      hostId,
      players: [],
      entryFee: 10,
      maxPlayers: 10,
      currentQuestion: 0,
      questions,
      status: "waiting",
      prizePool: 10,
      createdAt: new Date(),
      gameType: "quiz",
    }

    const docRef = await addDoc(collection(db, "quizGames"), gameRoom)

    // Add host as first player
    await joinQuizGame(docRef.id, hostId)

    return docRef.id
  } catch (error) {
    console.error("Error creating quiz game:", error)
    throw error
  }
}

// Join quiz game room
export const joinQuizGame = async (gameId: string, playerId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "quizGames", gameId)
    const gameDoc = await getDoc(gameRef)

    if (!gameDoc.exists()) {
      throw new Error("Game not found")
    }

    const gameData = gameDoc.data() as QuizGameRoom

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
      setTimeout(() => startQuizGame(gameId), 3000) // Start after 3 seconds
    }
  } catch (error) {
    console.error("Error joining quiz game:", error)
    throw error
  }
}

// Start quiz game
export const startQuizGame = async (gameId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "quizGames", gameId)
    await updateDoc(gameRef, {
      status: "playing",
      startedAt: new Date(),
    })
  } catch (error) {
    console.error("Error starting quiz game:", error)
    throw error
  }
}

// Submit quiz answer
export const submitQuizAnswer = async (
  gameId: string,
  playerId: string,
  answer: number,
  timeSpent: number,
): Promise<void> => {
  try {
    const gameRef = doc(db, "quizGames", gameId)

    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef)
      const gameData = gameDoc.data() as QuizGameRoom

      const currentQ = gameData.questions[gameData.currentQuestion]
      const isCorrect = answer === currentQ.correct

      // Calculate points (correct answer + speed bonus)
      let points = 0
      if (isCorrect) {
        const speedBonus = Math.max(0, 15 - timeSpent) // More points for faster answers
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

      // Check if all players answered
      const allAnswered = updatedPlayers.every((p) => p.answers.length > gameData.currentQuestion)

      if (allAnswered) {
        // Move to next question or end game
        if (gameData.currentQuestion < gameData.questions.length - 1) {
          transaction.update(gameRef, {
            currentQuestion: increment(1),
          })
        } else {
          // End game
          await endQuizGame(gameId)
        }
      }
    })
  } catch (error) {
    console.error("Error submitting quiz answer:", error)
    throw error
  }
}

// End quiz game and distribute prizes
export const endQuizGame = async (gameId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "quizGames", gameId)

    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef)
      const gameData = gameDoc.data() as QuizGameRoom

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
          gameType: "quiz",
        },
        { merge: true },
      )

      // Record transaction for winner
      const transactionRef = collection(db, "transactions")
      transaction.set(doc(transactionRef), {
        userId: winner.uid,
        type: "credit",
        amount: winnerPrize,
        description: `Quiz Battle Win - ${gameId}`,
        status: "completed",
        createdAt: new Date(),
      })
    })
  } catch (error) {
    console.error("Error ending quiz game:", error)
    throw error
  }
}

// Listen to quiz game updates
export const subscribeToQuizGame = (callback: (games: QuizGameRoom[]) => void) => {
  const gamesRef = collection(db, "quizGames")
  const q = query(gamesRef, where("status", "in", ["waiting", "playing"]))

  return onSnapshot(q, (snapshot) => {
    const games = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuizGameRoom[]

    callback(games)
  })
}

// Listen to specific quiz game
export const subscribeToSpecificQuizGame = (gameId: string, callback: (game: QuizGameRoom | null) => void) => {
  const gameRef = doc(db, "quizGames", gameId)
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as QuizGameRoom)
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
