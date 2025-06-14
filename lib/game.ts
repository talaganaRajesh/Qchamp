import {
  doc,
  collection,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  limit,
  onSnapshot,
  increment,
  runTransaction,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  category: string
  difficulty: "easy" | "medium" | "hard"
  timeLimit: number
}

export interface GameRoom {
  id: string
  hostId: string
  players: GamePlayer[]
  entryFee: number
  maxPlayers: number
  questions: Question[]
  currentQuestion: number
  status: "waiting" | "starting" | "playing" | "finished"
  prizePool: number
  winnerId?: string
  createdAt: Date
  startedAt?: Date
  finishedAt?: Date
}

export interface GamePlayer {
  uid: string
  name: string
  score: number
  answers: number[]
  joinedAt: Date
  isReady: boolean
}

export interface PlayerAnswer {
  questionIndex: number
  selectedOption: number
  timeSpent: number
  isCorrect: boolean
  points: number
}

// Create game room
export const createGameRoom = async (hostId: string, entryFee: number, maxPlayers = 4): Promise<string> => {
  try {
    // Deduct entry fee from host's wallet
    await deductWalletBalance(hostId, entryFee)

    // Get random questions
    const questions = await getRandomQuestions(5) // 5 questions per game

    const gameRoom: Omit<GameRoom, "id"> = {
      hostId,
      players: [],
      entryFee,
      maxPlayers,
      questions,
      currentQuestion: 0,
      status: "waiting",
      prizePool: entryFee,
      createdAt: new Date(),
    }

    const docRef = await addDoc(collection(db, "games"), gameRoom)

    // Add host as first player
    await joinGameRoom(docRef.id, hostId)

    return docRef.id
  } catch (error) {
    console.error("Error creating game room:", error)
    throw error
  }
}

// Join game room
export const joinGameRoom = async (gameId: string, playerId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "games", gameId)
    const gameDoc = await getDoc(gameRef)

    if (!gameDoc.exists()) {
      throw new Error("Game not found")
    }

    const gameData = gameDoc.data() as GameRoom

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

    const newPlayer: GamePlayer = {
      uid: playerId,
      name: playerData?.name || "Anonymous",
      score: 0,
      answers: [],
      joinedAt: new Date(),
      isReady: false,
    }

    await updateDoc(gameRef, {
      players: [...gameData.players, newPlayer],
      prizePool: increment(gameData.entryFee),
    })
  } catch (error) {
    console.error("Error joining game room:", error)
    throw error
  }
}

// Submit answer
export const submitAnswer = async (
  gameId: string,
  playerId: string,
  questionIndex: number,
  selectedOption: number,
  timeSpent: number,
): Promise<void> => {
  try {
    const gameRef = doc(db, "games", gameId)

    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef)
      const gameData = gameDoc.data() as GameRoom

      const question = gameData.questions[questionIndex]
      const isCorrect = selectedOption === question.correct

      // Calculate points (correct answer + speed bonus)
      let points = 0
      if (isCorrect) {
        points = 10
        if (timeSpent <= 5) points += 2 // Speed bonus
      }

      // Update player's score and answers
      const updatedPlayers = gameData.players.map((player) => {
        if (player.uid === playerId) {
          return {
            ...player,
            score: player.score + points,
            answers: [...player.answers, selectedOption],
          }
        }
        return player
      })

      transaction.update(gameRef, { players: updatedPlayers })
    })
  } catch (error) {
    console.error("Error submitting answer:", error)
    throw error
  }
}

// End game and distribute prizes
export const endGame = async (gameId: string): Promise<void> => {
  try {
    const gameRef = doc(db, "games", gameId)

    await runTransaction(db, async (transaction) => {
      const gameDoc = await transaction.get(gameRef)
      const gameData = gameDoc.data() as GameRoom

      // Find winner (highest score)
      const sortedPlayers = [...gameData.players].sort((a, b) => b.score - a.score)
      const winner = sortedPlayers[0]

      // Calculate prize distribution
      const platformCommission = Math.floor(gameData.prizePool * 0.15) // 15% commission
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
        },
        { merge: true },
      )

      // Record transaction for winner
      const transactionRef = collection(db, "transactions")
      transaction.set(doc(transactionRef), {
        userId: winner.uid,
        type: "credit",
        amount: winnerPrize,
        description: `Game Win - ${gameId}`,
        status: "completed",
        createdAt: new Date(),
      })
    })
  } catch (error) {
    console.error("Error ending game:", error)
    throw error
  }
}

// Get random questions
export const getRandomQuestions = async (count: number): Promise<Question[]> => {
  try {
    const questionsRef = collection(db, "questions")
    const q = query(questionsRef, limit(count * 3)) // Get more to randomize
    const querySnapshot = await getDocs(q)

    const allQuestions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Question[]

    // Shuffle and return requested count
    const shuffled = allQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  } catch (error) {
    console.error("Error getting questions:", error)
    return []
  }
}

// Listen to game updates
export const subscribeToGame = (gameId: string, callback: (game: GameRoom) => void) => {
  const gameRef = doc(db, "games", gameId)
  return onSnapshot(gameRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as GameRoom)
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
