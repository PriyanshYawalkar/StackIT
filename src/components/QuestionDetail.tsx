"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchQuestionById, fetchAnswers } from "@/lib/db";
import AnswerCard from "./AnswerCard";
import AnswerEditor from "./AnswerEditor";

interface Question {
    id: string;
    title?: string;
    body?: string;
    tags?: string[];
    authorName?: string;
}
interface Answer {
    id: string;
    body?: string;
    authorName?: string;
}

export default function QuestionDetail({ questionId }: { questionId: string }) {
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        fetchQuestionById(questionId).then((q) => {
            if (!q) return;
            const qData = q as Partial<Question>;
            setQuestion({
                id: q.id,
                title: qData.title || "",
                body: qData.body || "",
                tags: qData.tags || [],
                authorName: qData.authorName || ""
            });
        });
        fetchAnswers(questionId).then((ansArr) => {
            setAnswers(ansArr.map((a: Answer) => ({
                id: a.id,
                body: a.body || "",
                authorName: a.authorName || ""
            })));
        });
    }, [questionId]);

    if (!question) return <p>Loading...</p>;

    return (
        <div className="space-y-6">
            <div className="text-sm text-blue-600">
                <Link href="/">Home</Link> &gt; {question.title?.slice(0, 40)}...
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h1 className="text-2xl font-bold">{question.title}</h1>
                <div className="mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: question.body || "" }} />
                <div className="text-sm text-gray-500 mt-2">
                    Tags: {question.tags?.join(", ")} | Asked by {question.authorName}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold">Answers</h2>
                {answers.length === 0 ? (
                    <p>No answers yet. Be the first to reply!</p>
                ) : (
                    answers.map((ans) => <AnswerCard key={ans.id} answer={{ ...ans, body: ans.body || "" }} />)
                )}
            </div>

            <AnswerEditor questionId={questionId} />
        </div>
    );
}
