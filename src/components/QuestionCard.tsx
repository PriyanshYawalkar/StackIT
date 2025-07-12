// src/components/QuestionCard.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from "firebase/firestore";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface Question {
    id: string;
    title?: string;
    body?: string;
    tags?: string[];
    authorName?: string;
    voteCount?: number;
    answerCount?: number;
}

export default function QuestionCard({ question }: { question: Question }) {
    const [answerCount, setAnswerCount] = useState(0);
    const [voteCount, setVoteCount] = useState(question.voteCount || 0);
    const [voted, setVoted] = useState<null | number>(null); // 1 for up, -1 for down, null for not voted
    const [user] = useAuthState(auth);

    useEffect(() => {
        async function getCount() {
            const q = query(
                collection(db, "answers"),
                where("questionId", "==", question.id)
            );
            const snap = await getDocs(q);
            setAnswerCount(snap.size);
        }
        getCount();
    }, [question.id]);

    useEffect(() => {
        async function fetchVote() {
            if (!user) return;
            const voteRef = doc(db, "questions", question.id, "votes", user.uid);
            const voteSnap = await getDoc(voteRef);
            if (voteSnap.exists()) {
                setVoted(voteSnap.data().value);
            } else {
                setVoted(null);
            }
        }
        fetchVote();
    }, [user, question.id]);

    const handleVote = async (delta: number) => {
        if (!user) return alert("Login to vote");
        if (voted === delta) return;
        const voteRef = doc(db, "questions", question.id, "votes", user.uid);
        const questionRef = doc(db, "questions", question.id);
        const voteSnap = await getDoc(voteRef);
        let change = delta;
        if (voteSnap.exists()) {
            const prev = voteSnap.data().value;
            change = delta - prev;
            await updateDoc(voteRef, { value: delta });
        } else {
            await setDoc(voteRef, { value: delta });
        }
        await updateDoc(questionRef, { voteCount: increment(change) });
        setVoteCount((prev: number) => prev + change);
        setVoted(delta);
    };

    return (
        <div className="relative bg-white p-4 rounded shadow mb-4 flex">
            <div className="flex flex-col items-center mr-4">
                <button
                    onClick={() => handleVote(1)}
                    disabled={voted === 1}
                    className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 transition-colors border border-gray-200 shadow-sm
                        ${voted === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-600'}
                        disabled:opacity-60`}
                >
                    <FaArrowUp size={16} />
                </button>
                <span className="font-bold text-base my-1">{voteCount}</span>
                <button
                    onClick={() => handleVote(-1)}
                    disabled={voted === -1}
                    className={`w-8 h-8 flex items-center justify-center rounded-full mt-1 transition-colors border border-gray-200 shadow-sm
                        ${voted === -1 ? 'bg-red-600 text-white' : 'bg-white text-gray-500 hover:bg-red-100 hover:text-red-600'}
                        disabled:opacity-60`}
                >
                    <FaArrowDown size={16} />
                </button>
            </div>
            <div className="flex-1">
                <Link href={`/question/${question.id}`}>
                    <h2 className="text-lg font-bold text-blue-600 mb-1">{question.title}</h2>
                </Link>
                <div className="flex flex-wrap gap-2 mb-2">
                    {question.tags?.map((tag: string, i: number) => (
                        <span key={i} className="bg-gray-200 text-sm px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
                <div className="text-gray-700 line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: question.body || "" }} />
                <div className="text-sm text-gray-500">Asked by {question.authorName || 'Anonymous'}</div>
                {/* Answer count badge */}
                <div className="absolute right-4 top-4 bg-gray-200 text-sm px-2 py-1 rounded-full">
                    {answerCount} ans
                </div>
            </div>
        </div>
    );
}
