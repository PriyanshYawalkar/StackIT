"use client";
import { useParams } from "next/navigation";
import QuestionDetail from "@/components/QuestionDetail";

export default function QuestionPage() {
    const { id } = useParams();

    if (!id || typeof id !== "string") return <p>Invalid Question ID</p>;

    return (
        <div>
            <QuestionDetail questionId={id} />
        </div>
    );
}