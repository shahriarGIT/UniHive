"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function QuizDetailPage() {
  const params = useParams();

  const { quizId } = params;
  const [quiz, setQuiz] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/quizzes/${quizId}`
        );
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };

    fetchQuiz();
  }, [quizId]);

  if (!quiz) {
    return <div className="text-center py-10">Loading quiz...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-600 mb-8">{quiz.description}</p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          onClick={() => router.push(`/take-quiz/${quizId}`)}
          className="bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg"
        >
          Take Quiz
        </button>

        <button
          onClick={() => router.push(`create-quizroom?quizId=${quizId}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded text-lg"
        >
          Create Room
        </button>

        <button
          onClick={() => router.push(`join-quizroom?quizId=${quizId}`)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded text-lg"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
