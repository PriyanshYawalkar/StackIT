// src/lib/addDemoData.ts
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function seedDemoQuestion() {
  try {
    // 1. Add Question
    const questionRef = await addDoc(collection(db, "questions"), {
      title:
        "How to join 2 columns in a data set to make a separate column in SQL?",
      body: `
        <p>I do not know the code for it as I am a beginner. As an example, what I need to do is this:</p>
        <ul>
          <li>Column1 contains First name</li>
          <li>Column2 contains Last name</li>
        </ul>
        <p>I want to combine both into a full name.</p>
      `,
      tags: ["SQL", "CONCAT", "Beginner"],
      createdAt: serverTimestamp(),
      authorName: "Alice",
    });

    const questionId = questionRef.id;

    // 2. Add Answers
    await addDoc(collection(db, "answers"), {
      questionId,
      body: `
        <p>You can use the <strong>CONCAT</strong> function in SQL:</p>
        <pre>SELECT CONCAT(column1, ' ', column2) AS full_name FROM your_table;</pre>
        <p>This will merge first and last names into a new column.</p>
      `,
      createdAt: serverTimestamp(),
      authorName: "Bob",
    });

    await addDoc(collection(db, "answers"), {
      questionId,
      body: `
        <p>Alternatively, in PostgreSQL or Oracle you can use:</p>
        <pre>SELECT column1 || ' ' || column2 AS full_name FROM your_table;</pre>
      `,
      createdAt: serverTimestamp(),
      authorName: "Charlie",
    });

    console.log("Demo question and answers seeded!");
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}
