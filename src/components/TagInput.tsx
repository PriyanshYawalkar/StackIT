"use client";
import { useState } from "react";

export default function TagInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
    const [tag, setTag] = useState("");

    const addTag = () => {
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
            setTag("");
        }
    };

    return (
        <div>
            <div className="flex gap-2 mb-2">
                {value.map((t, idx) => (
                    <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm">{t}</span>
                ))}
            </div>
            <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Enter tag and press Enter"
                className="border p-2 w-full"
            />
        </div>
    );
}