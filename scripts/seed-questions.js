// Script to seed questions in Firestore
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCMY0Lw1Fz_PvNMTEc0uVQzTIVDWYjf2hg",
  authDomain: "quizclash-4f23e.firebaseapp.com",
  projectId: "quizclash-4f23e",
  storageBucket: "quizclash-4f23e.firebasestorage.app",
  messagingSenderId: "719534701098",
  appId: "1:719534701098:web:6cc94546ec4ca211a6e153",
  databaseURL: "https://quizclash-4f23e-default-rtdb.firebaseio.com/",
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    category: "Geography",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    category: "Science",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "What is 15 × 8?",
    options: ["110", "120", "130", "140"],
    correct: 1,
    category: "Mathematics",
    difficulty: "medium",
    timeLimit: 10,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correct: 1,
    category: "Literature",
    difficulty: "medium",
    timeLimit: 10,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
    category: "Geography",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correct: 1,
    category: "History",
    difficulty: "medium",
    timeLimit: 10,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    category: "Science",
    difficulty: "medium",
    timeLimit: 10,
  },
  {
    question: "Which programming language is known as the 'mother of all languages'?",
    options: ["C", "Assembly", "FORTRAN", "COBOL"],
    correct: 0,
    category: "Technology",
    difficulty: "hard",
    timeLimit: 15,
  },
  {
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correct: 2,
    category: "Mathematics",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correct: 2,
    category: "Art",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Rupee"],
    correct: 2,
    category: "Geography",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "Which element has the atomic number 1?",
    options: ["Helium", "Hydrogen", "Lithium", "Carbon"],
    correct: 1,
    category: "Science",
    difficulty: "medium",
    timeLimit: 10,
  },
  {
    question: "What is 25% of 200?",
    options: ["25", "50", "75", "100"],
    correct: 1,
    category: "Mathematics",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "Who is the author of 'Harry Potter' series?",
    options: ["J.R.R. Tolkien", "J.K. Rowling", "Stephen King", "George R.R. Martin"],
    correct: 1,
    category: "Literature",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "South Korea", "Japan", "Thailand"],
    correct: 2,
    category: "Geography",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "What is the speed of light in vacuum?",
    options: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "298,792,458 m/s"],
    correct: 0,
    category: "Science",
    difficulty: "hard",
    timeLimit: 15,
  },
  {
    question: "What is the result of 7 × 9?",
    options: ["56", "63", "72", "81"],
    correct: 1,
    category: "Mathematics",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "Which Shakespeare play features the character Hamlet?",
    options: ["Macbeth", "Othello", "Hamlet", "King Lear"],
    correct: 2,
    category: "Literature",
    difficulty: "easy",
    timeLimit: 10,
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correct: 1,
    category: "Geography",
    difficulty: "medium",
    timeLimit: 10,
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Computer Program Unit"],
    correct: 0,
    category: "Technology",
    difficulty: "easy",
    timeLimit: 10,
  },
]

async function seedQuestions() {
  try {
    console.log("Starting to seed questions...")

    for (const question of questions) {
      await addDoc(collection(db, "questions"), question)
      console.log(`Added question: ${question.question}`)
    }

    console.log("Successfully seeded all questions!")
    console.log(`Total questions added: ${questions.length}`)
  } catch (error) {
    console.error("Error seeding questions:", error)
  }
}

seedQuestions()
