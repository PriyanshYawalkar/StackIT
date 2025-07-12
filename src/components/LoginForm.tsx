"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/");
        } catch {
            alert("Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-8 bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border p-2 w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="border p-2 w-full"
                />
                <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2">
                        Login
                    </button>
                    <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2"
                        onClick={() => router.push("/signup")}
                    >
                        Create Profile
                    </button>
                </div>
            </form>
        </div>
    );
}