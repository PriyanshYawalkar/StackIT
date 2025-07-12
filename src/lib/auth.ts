// src/lib/auth.ts
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export function getCurrentUser(callback: (user: unknown) => void) {
  return onAuthStateChanged(auth, callback);
}
