// src/app/seed/page.tsx
"use client";
import { useEffect } from "react";
import { seedDemoQuestion } from "@/lib/addDemoData";

export default function SeedPage() {
    useEffect(() => {
        seedDemoQuestion();
    }, []);

    return <p>Seeding data... Check Firestore console.</p>;
}
