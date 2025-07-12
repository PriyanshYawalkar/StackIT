"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useEffect, useState, useRef } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { updateProfile } from "firebase/auth";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";

interface Question {
    id: string;
    title?: string;
    body?: string;
    tags?: string[];
    authorName?: string;
}

export default function ProfilePage() {
    const [user] = useAuthState(auth);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setPhotoURL(user.photoURL || null);
        }
    }, [user]);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!user) return;
            setLoading(true);
            const q = query(collection(db, "questions"), where("authorName", "==", user.displayName));
            const querySnapshot = await getDocs(q);
            setQuestions(querySnapshot.docs.map(doc => ({
                id: doc.id,
                title: doc.data().title || "",
                body: doc.data().body || "",
                tags: doc.data().tags || [],
                authorName: doc.data().authorName || ""
            })));
            setLoading(false);
        };
        fetchQuestions();
    }, [user]);

    const handleNameSave = async () => {
        if (!auth.currentUser || !user) return;
        setSaving(true);
        setError(null);
        try {
            await updateProfile(auth.currentUser, { displayName });
            setEditing(false);
        } catch {
            setError("Failed to update name");
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !auth.currentUser || !user) return;
        setError(null);
        try {
            // Upload to Firebase Storage
            const storageRef = ref(storage, `profileImages/${user.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setPhotoURL(url);
            await updateProfile(auth.currentUser, { photoURL: url });
        } catch {
            setError("Failed to update profile picture");
        }
    };

    if (!user) {
        return <div className="p-6">Please log in to view your profile.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div
                className="mb-6 p-6 rounded-2xl shadow-lg border border-white/30 bg-white/20 backdrop-blur-md"
                style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
                <div className="flex items-center gap-6 mb-4">
                    <div className="relative">
                        <Image
                            src={photoURL || "/public/file.svg"}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
                        />
                        <button
                            className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 text-xs hover:bg-blue-700"
                            onClick={() => fileInputRef.current?.click()}
                            title="Change profile picture"
                        >
                            ✏️
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handlePhotoChange}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            {editing ? (
                                <>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={e => setDisplayName(e.target.value)}
                                        className="border p-1 rounded"
                                        disabled={saving}
                                    />
                                    <button
                                        onClick={handleNameSave}
                                        className="ml-2 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                        disabled={saving}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => { setEditing(false); setDisplayName(user.displayName || ""); }}
                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg font-semibold">{displayName}</span>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="ml-2 text-blue-600 hover:underline text-sm"
                                    >
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                        <p className="text-gray-700">{user.email}</p>
                        {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
                    </div>
                </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Questions</h2>
            {loading ? (
                <p>Loading...</p>
            ) : questions.length === 0 ? (
                <p>You haven&apos;t asked any questions yet.</p>
            ) : (
                <ul className="space-y-2">
                    {questions.map(q => (
                        <li key={q.id} className="bg-white/60 p-3 rounded shadow flex justify-between items-center">
                            <span>{q.title}</span>
                            <Link href={`/question/${q.id}`} className="text-blue-600 hover:underline">View</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
} 