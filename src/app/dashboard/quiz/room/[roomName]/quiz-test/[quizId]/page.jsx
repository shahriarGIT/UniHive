"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";
import axios from "axios";

let socket;

export default function QuizTestPage() {
  const { quizId, roomName } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [userId, setUserId] = useState("607f1f77bcf86cd799439011"); // Simulate logged-in user
  const [score, setScore] = useState(0); // For showing score after submission
  useEffect(() => {
    socket = io("http://localhost:3001");

    fetch(`http://localhost:3001/api/quizzes/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, [quizId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("quizStatsUpdate", (stats) => {
      console.log("Live stats:", stats);
      // You can set to state: setStats(stats)
    });

    return () => {
      socket.off("quizStatsUpdate");
    };
  }, []);

  const handleChange = (questionIndex, value) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleMultipleChoiceChange = (questionIndex, option) => {
    const currentAnswers = answers[questionIndex] || [];
    const updated = currentAnswers.includes(option)
      ? currentAnswers.filter((o) => o !== option)
      : [...currentAnswers, option];

    setAnswers((prev) => ({ ...prev, [questionIndex]: updated }));
  };

  //   const handleSubmit = () => {
  //     socket.emit("quizFinished", {
  //       roomName,
  //       quizId,
  //       userId,
  //       answers,
  //     });

  //     router.push("/dashboard"); // Redirect or show result summary
  //     };

  const handleSubmit = async () => {
    try {
      // Step 1: Submit the answers to the backend
      const response = await axios.post(
        "http://localhost:3001/api/submit-quiz",
        {
          roomName,
          quizId,
          userId, // You should already have the current user's ID
          answers, // Whatever format you're using
        }
      );

      // Step 2: Show result to the user
      setScore(response.data.score); // or use context or state to show result

      // Step 3: Emit quizFinished to backend for real-time tracking
      socket.emit("quizFinished", {
        roomName,
        userId,
      });

      // Step 4: Redirect or navigate to stats page
      // router.push(`/dashboard/quiz/stats/${roomName}`);
      router.push(
        `/dashboard/quiz/room/${roomName}/quiz-test/${quizId}/quiz-stats`
      );
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>

      {quiz.questions.map((q, index) => (
        <div key={index} className="border p-4 rounded shadow">
          <p className="font-medium">
            {index + 1}. {q.questionText}
          </p>

          {q.type === "true_false" && (
            <div className="space-y-2 mt-2">
              {["True", "False"].map((opt) => (
                <label key={opt} className="block">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={opt}
                    checked={answers[index] === opt}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "single_choice" && (
            <div className="space-y-2 mt-2">
              {q.options.map((opt) => (
                <label key={opt} className="block">
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={opt}
                    checked={answers[index] === opt}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "multiple_choice" && (
            <div className="space-y-2 mt-2">
              {q.options.map((opt) => (
                <label key={opt} className="block">
                  <input
                    type="checkbox"
                    name={`q${index}`}
                    value={opt}
                    checked={(answers[index] || []).includes(opt)}
                    onChange={() => handleMultipleChoiceChange(index, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "short_answer" && (
            <input
              type="text"
              value={answers[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              className="mt-2 w-full p-2 border border-gray-300 rounded"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded"
      >
        Submit Answers
      </button>
    </div>
  );
}
