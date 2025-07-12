"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const ADMIN_EMAIL = "admin@stackit.com"; // TODO: Replace with your admin email

interface UserDoc {
    id: string;
    displayName?: string;
    name?: string;
    email?: string;
}
interface QuestionDoc {
    id: string;
    title?: string;
    authorName?: string;
}
interface AnswerDoc {
    id: string;
    body?: string;
    authorName?: string;
}

export default function AdminPage() {
    const [user, loading] = useAuthState(auth);
    const [tab, setTab] = useState("overview");
    const [stats, setStats] = useState({ users: 0, questions: 0, answers: 0 });

    useEffect(() => {
        async function fetchStats() {
            const usersSnap = await getDocs(collection(db, "users"));
            const questionsSnap = await getDocs(collection(db, "questions"));
            const answersSnap = await getDocs(collection(db, "answers"));
            setStats({
                users: usersSnap.size,
                questions: questionsSnap.size,
                answers: answersSnap.size,
            });
        }
        if (user && user.email === ADMIN_EMAIL) fetchStats();
    }, [user]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!user || user.email !== ADMIN_EMAIL) {
        return <div className="p-8 text-red-600 font-bold">Access denied. Admins only.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
            <div className="flex gap-4 mb-6">
                <button onClick={() => setTab("overview")} className={`px-4 py-2 rounded ${tab === "overview" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Overview</button>
                <button onClick={() => setTab("users")} className={`px-4 py-2 rounded ${tab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Users</button>
                <button onClick={() => setTab("questions")} className={`px-4 py-2 rounded ${tab === "questions" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Questions</button>
                <button onClick={() => setTab("answers")} className={`px-4 py-2 rounded ${tab === "answers" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Answers</button>
            </div>
            {tab === "overview" && (
                <div className="space-y-2">
                    <div><b>Users:</b> {stats.users}</div>
                    <div><b>Questions:</b> {stats.questions}</div>
                    <div><b>Answers:</b> {stats.answers}</div>
                </div>
            )}
            {tab === "users" && <UsersTab />}
            {tab === "questions" && <QuestionsTab />}
            {tab === "answers" && <AnswersTab />}
        </div>
    );
}

function UsersTab() {
    const [users, setUsers] = useState<UserDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const snap = await getDocs(collection(db, "users"));
                setUsers(snap.docs.map(doc => ({
                    id: doc.id,
                    displayName: doc.data().displayName || "",
                    name: doc.data().name || "",
                    email: doc.data().email || ""
                })));
            } catch {
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter(u => u.id !== id));
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (users.length === 0) return <div>No users found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/80 rounded">
                <thead>
                    <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="p-2">{user.displayName || user.name || "-"}</td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                                <button onClick={() => handleDelete(user.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function QuestionsTab() {
    const [questions, setQuestions] = useState<QuestionDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const snap = await getDocs(collection(db, "questions"));
                setQuestions(snap.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title || "",
                    authorName: doc.data().authorName || ""
                })));
            } catch {
                setError("Failed to fetch questions");
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        await deleteDoc(doc(db, "questions", id));
        setQuestions(questions.filter(q => q.id !== id));
    };

    if (loading) return <div>Loading questions...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (questions.length === 0) return <div>No questions found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/80 rounded">
                <thead>
                    <tr>
                        <th className="p-2">Title</th>
                        <th className="p-2">Author</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map(q => (
                        <tr key={q.id}>
                            <td className="p-2">{q.title}</td>
                            <td className="p-2">{q.authorName}</td>
                            <td className="p-2">
                                <button onClick={() => handleDelete(q.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AnswersTab() {
    const [answers, setAnswers] = useState<AnswerDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAnswers() {
            try {
                const snap = await getDocs(collection(db, "answers"));
                setAnswers(snap.docs.map(doc => ({
                    id: doc.id,
                    body: doc.data().body || "",
                    authorName: doc.data().authorName || ""
                })));
            } catch {
                setError("Failed to fetch answers");
            } finally {
                setLoading(false);
            }
        }
        fetchAnswers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this answer?")) return;
        await deleteDoc(doc(db, "answers", id));
        setAnswers(answers.filter(a => a.id !== id));
    };

    if (loading) return <div>Loading answers...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (answers.length === 0) return <div>No answers found.</div>;
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white/80 rounded">
                <thead>
                    <tr>
                        <th className="p-2">Answer</th>
                        <th className="p-2">Author</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.map(a => (
                        <tr key={a.id}>
                            <td className="p-2 max-w-xs truncate">{(a.body || '').replace(/<[^>]+>/g, '').slice(0, 60)}...</td>
                            <td className="p-2">{a.authorName}</td>
                            <td className="p-2">
                                <button onClick={() => handleDelete(a.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
} 