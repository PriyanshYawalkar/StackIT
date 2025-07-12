"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";

export default function AskForm() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted with:", { title, body, tags });

        if (!title.trim()) {
            setError("Title is required");
            console.error("Title is empty");
            return;
        }

        if (!body.trim()) {
            setError("Question body is required");
            console.error("Body is empty");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            console.log("Creating new question...");
            const newQuestion = {
                title: title.trim(),
                body: body.trim(),
                tags,
                createdAt: serverTimestamp(),
                authorName: "Test User"
            };

            console.log("Question data:", newQuestion);
            const docRef = await addDoc(collection(db, "questions"), newQuestion);
            console.log("Question created successfully with ID:", docRef.id);

            router.push(`/question/${docRef.id}`);
        } catch (error) {
            console.error("Error creating question:", error);
            setError("Failed to create question. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2"
                disabled={isSubmitting}
            />
            <RichTextEditor value={body} onChange={setBody} />
            <TagInput value={tags} onChange={setTags} />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}