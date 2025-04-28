"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateQuiz = async () => {
    console.log(title, description);

    // try {
    //   const res = await axios.post("http://localhost:3001/api/create-quiz", {
    //     title,
    //     description,
    //     questions: [],
    //     isPublic: true,
    //   });
    //   alert("Quiz created successfully!");
    // } catch (err) {
    //   console.error(err);
    //   alert("Failed to create quiz.");
    // }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Create a Quiz</h1>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full max-w-md p-3 mb-4 border border-gray-300 rounded"
      />

      <textarea
        placeholder="Quiz Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full max-w-md p-3 mb-6 border border-gray-300 rounded"
      />

      <button
        onClick={handleCreateQuiz}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
      >
        Create Quiz
      </button>
    </div>
  );
}
