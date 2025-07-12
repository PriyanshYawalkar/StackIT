"use client";
import QuestionFeed from "@/components/QuestionFeed";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginModal from "@/components/LoginModal";

export default function HomePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
          onClick={() => {
            if (user) {
              router.push("/ask");
            } else {
              setShowLoginModal(true);
            }
          }}
        >
          Ask New Question
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-4">StackIt - Questions</h1>
      <QuestionFeed />
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}