"use client";
import { useEffect, useState } from "react";
import { fetchQuestions } from "@/lib/db";
import QuestionCard from "./QuestionCard";

interface Question {
    id: string;
    title?: string;
    body?: string;
    tags?: string[];
    authorName?: string;
    voteCount?: number;
    answerCount?: number;
}

export default function QuestionFeed() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filtered, setFiltered] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("newest");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PAGE_SIZE = 5;
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    useEffect(() => {
        fetchQuestions()
            .then((qs) => {
                setQuestions(qs.map((q: Question) => ({
                    id: q.id,
                    title: q.title || "",
                    body: q.body || "",
                    tags: q.tags || [],
                    authorName: q.authorName || "",
                    voteCount: q.voteCount || 0,
                    answerCount: q.answerCount || 0
                })));
                setFiltered(qs.map((q: Question) => ({
                    id: q.id,
                    title: q.title || "",
                    body: q.body || "",
                    tags: q.tags || [],
                    authorName: q.authorName || "",
                    voteCount: q.voteCount || 0,
                    answerCount: q.answerCount || 0
                })));
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let data = [...questions];
        if (filter === "unanswered") {
            data = data.filter((q) => !q.answerCount || q.answerCount === 0);
        } else {
            data.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
        }
        if (search.trim()) {
            const keyword = search.toLowerCase();
            data = data.filter((q) =>
                q.title?.toLowerCase().includes(keyword) ||
                q.body?.toLowerCase().includes(keyword)
            );
        }
        setFiltered(data);
        setPage(1); // Reset to page 1 on filter/search
    }, [filter, search, questions]);

    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center mb-4">
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
                    <option value="newest">Newest</option>
                    <option value="unanswered">Unanswered</option>
                </select>
                <input
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                paginated.map((q) => (
                    <QuestionCard
                        key={q.id}
                        question={{
                            ...q,
                            title: q.title || "",
                            body: q.body || "",
                            tags: q.tags || [],
                            authorName: q.authorName || "",
                            voteCount: q.voteCount || 0,
                            answerCount: q.answerCount || 0
                        }}
                    />
                ))
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-600 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}