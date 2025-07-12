// src/lib/db.ts
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

// Fetch all questions
export async function fetchQuestions() {
  const qSnap = await getDocs(
    query(collection(db, "questions"), orderBy("createdAt", "desc"))
  );
  return qSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Fetch one question
export async function fetchQuestionById(id: string) {
  const ref = doc(db, "questions", id);
  const qSnap = await getDoc(ref);
  return qSnap.exists() ? { id, ...qSnap.data() } : null;
}

// Fetch answers for a question
export async function fetchAnswers(questionId: string) {
  const aSnap = await getDocs(
    query(
      collection(db, "answers"),
      where("questionId", "==", questionId),
      orderBy("createdAt", "asc")
    )
  );
  return aSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
