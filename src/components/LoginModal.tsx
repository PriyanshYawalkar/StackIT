import React from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
                <h2 className="text-xl font-bold mb-2">Login Required</h2>
                <p className="mb-4">You must be logged in to ask a question or give an answer.</p>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                    onClick={() => {
                        router.push("/login");
                        onClose();
                    }}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
} 