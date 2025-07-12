// src/lib/votes.ts
import { db } from "./firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

export async function voteAnswer(answerId: string, delta: number) {
  const ref = doc(db, "answers", answerId);
  await updateDoc(ref, {
    votes: increment(delta),
  });
}
