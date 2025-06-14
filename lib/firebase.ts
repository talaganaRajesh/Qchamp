import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

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
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)

export default app
