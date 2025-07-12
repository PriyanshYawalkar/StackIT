interface Answer {
    body: string;
    authorName?: string;
}

export default function AnswerCard({ answer }: { answer: Answer }) {
    return (
        <div className="bg-white border p-4 rounded shadow-sm mb-3">
            <div dangerouslySetInnerHTML={{ __html: answer.body }} />
            <p className="text-sm text-gray-500 mt-2">– {answer.authorName}</p>
        </div>
    );
}
