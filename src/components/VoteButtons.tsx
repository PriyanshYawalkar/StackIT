"use client";
import { useState, useEffect } from "react";
import { voteAnswer } from "@/lib/votes";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function VoteButtons({ answerId }: { answerId: string }) {
    const [votes, setVotes] = useState(0);
    const [voted, setVoted] = useState(false);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const votedAnswers = JSON.parse(localStorage.getItem("votedAnswers") || "[]");
        if (votedAnswers.includes(answerId)) setVoted(true);
    }, [answerId]);

    const handleVote = async (delta: number) => {
        if (!user) return alert("Login to vote");
        if (voted) return alert("You have already voted");
        await voteAnswer(answerId, delta);
        setVotes(votes + delta);
        const votedAnswers = JSON.parse(localStorage.getItem("votedAnswers") || "[]");
        votedAnswers.push(answerId);
        localStorage.setItem("votedAnswers", JSON.stringify(votedAnswers));
        setVoted(true);
    };

    return (
        <div className="flex flex-col items-center mr-4">
            <button onClick={() => handleVote(1)} disabled={voted}>🔼</button>
            <span>{votes}</span>
            <button onClick={() => handleVote(-1)} disabled={voted}>🔽</button>
        </div>
    );
}
