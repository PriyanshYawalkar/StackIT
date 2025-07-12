"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect, useRef } from "react";
import LoginModal from "./LoginModal";
import { FaBell, FaHome } from "react-icons/fa";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Navbar() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [newQuestions, setNewQuestions] = useState(0);
    const latestTimestampRef = useRef<number | null>(null);
    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [router]);
    // Track latest question timestamp on mount
    useEffect(() => {
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(1));
        const unsub = onSnapshot(q, (snap) => {
            const doc = snap.docs[0];
            if (doc) {
                const ts = doc.data().createdAt?.toMillis?.() || doc.data().createdAt;
                latestTimestampRef.current = ts;
            }
        });
        return () => unsub();
    }, []);
    // Listen for new questions
    useEffect(() => {
        if (latestTimestampRef.current === null) return;
        const q = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(10));
        const unsub = onSnapshot(q, (snap) => {
            const newCount = snap.docs.filter(doc => {
                const ts = doc.data().createdAt?.toMillis?.() || doc.data().createdAt;
                return ts > latestTimestampRef.current!;
            }).length;
            setNewQuestions(newCount);
        });
        return () => unsub();
    }, []);
    const ADMIN_EMAIL = "admin@stackit.com";

    return (
        <nav className="bg-white shadow p-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
                StackIt{user && user.email === ADMIN_EMAIL ? " | ADMIN" : ""}
            </Link>
            {/* Desktop Nav */}
            <div className="space-x-4 hidden sm:flex items-center">
                <Link href="/" className="text-blue-600 font-semibold flex items-center gap-1">
                    <FaHome className="inline" /> <span className="hidden sm:inline">Home</span>
                </Link>
                <div className="relative">
                    <FaBell className="text-blue-600 text-xl cursor-pointer" />
                    {newQuestions > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                            {newQuestions}
                        </span>
                    )}
                </div>
                {user ? (
                    <div className="relative inline-block text-left">
                        <button
                            className="flex items-center gap-2 text-green-600 font-semibold px-4 py-2 rounded hover:bg-gray-100 focus:outline-none"
                            id="user-menu-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            <span>User Profile</span>
                            <svg className="inline ml-1 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {showDropdown && (
                            <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" role="menuitem">Profile</Link>
                                    <button
                                        onClick={() => {
                                            signOut(auth);
                                            router.push("/");
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
            </div>
            {/* Hamburger for mobile */}
            <button
                className="sm:hidden flex items-center px-3 py-2 border rounded text-blue-600 border-blue-600"
                onClick={() => setMobileMenuOpen((open) => !open)}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg z-50 flex flex-col items-center py-4 sm:hidden">
                    <div className="flex gap-4 mb-2">
                        <Link href="/" className="text-blue-600 font-semibold flex items-center gap-1">
                            <FaHome className="inline" /> <span className="sm:inline">Home</span>
                        </Link>
                        <div className="relative">
                            <FaBell className="text-blue-600 text-xl cursor-pointer" />
                            {newQuestions > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                                    {newQuestions}
                                </span>
                            )}
                        </div>
                    </div>
                    {user ? (
                        <div className="w-full flex flex-col items-center">
                            <Link href="/profile" className="text-green-600 font-semibold mb-2" onClick={() => setMobileMenuOpen(false)}>
                                User Profile
                            </Link>
                            <button
                                onClick={() => {
                                    signOut(auth);
                                    router.push("/");
                                    setMobileMenuOpen(false);
                                }}
                                className="text-red-600 mb-2"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="mb-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link href="/signup" className="mb-2" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
            <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </nav>
    );
}