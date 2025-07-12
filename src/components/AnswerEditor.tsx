"use client";
import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import RichTextEditor from "./RichTextEditor";
import LoginModal from "./LoginModal";

export default function AnswerEditor({ questionId }: { questionId: string }) {
    const [submitting, setSubmitting] = useState(false);
    const [user] = useAuthState(auth);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [body, setBody] = useState("");
    const [error, setError] = useState<string | null>(null);

    const submitAnswer = async () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        const plainText = body.replace(/<[^>]+>/g, '').trim();
        console.log('DEBUG body:', body);
        console.log('DEBUG plainText:', plainText);
        if (!plainText) {
            setError("Answer cannot be empty");
            console.error("Answer body is empty");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            console.log("Submitting answer:", body);
            await addDoc(collection(db, "answers"), {
                questionId,
                body,
                createdAt: serverTimestamp(),
                authorName: user.displayName || user.email || "Anonymous"
            });
            setBody("");
        } catch (err) {
            setError("Failed to submit answer");
            console.error("Error submitting answer:", err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Submit Your Answer</h3>
            <div className="border border-gray-400 rounded-lg overflow-hidden">
                <RichTextEditor value={body} onChange={setBody} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
                onClick={submitAnswer}
                disabled={submitting || !user}
                className="bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
                {submitting ? "Submitting..." : "Submit"}
            </button>
            {!user && <p className="text-red-500 text-sm">Login to submit your answer.</p>}
            <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
}
