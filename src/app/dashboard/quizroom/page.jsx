"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // adjust to your backend

export default function QuizRoomPage() {
  const [quizData, setQuizData] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  // Add inside component state

  const handleChange = (qIdx, value, isMulti = false) => {
    setUserAnswers((prev) => {
      const prevAns = prev[qIdx] || (isMulti ? [] : "");
      if (isMulti) {
        const exists = prevAns.includes(value);
        const newAns = exists
          ? prevAns.filter((v) => v !== value)
          : [...prevAns, value];
        return { ...prev, [qIdx]: newAns };
      }
      return { ...prev, [qIdx]: value };
    });
  };

  const handleSubmit = () => {
    socket.emit("submit_answers", {
      quizId: quizData._id,
      answers: userAnswers,
      roomName: roomName, // assuming stored already
    });
  };

  useEffect(() => {
    socket.on("quiz_started", ({ quiz, timerEnabled, timerDuration }) => {
      setQuizData(quiz);
      setQuizStarted(true);

      if (timerEnabled && timerDuration) {
        setTimeLeft(timerDuration);

        const interval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              // Auto-submit or show "Time's up"
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setTimer(interval);
      }
    });

    return () => {
      socket.off("quiz_started");
      clearInterval(timer);
    };
  }, []);

  if (!quizStarted) {
    return (
      <p className="text-center mt-10 text-xl">Waiting for quiz to start...</p>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
      {timeLeft !== null && (
        <div className="text-red-500 font-semibold text-xl mb-4">
          Time left: {timeLeft}s
        </div>
      )}
      <ul className="space-y-6">
        {quizData.questions.map((q, idx) => (
          <li key={idx}>
            <p className="font-medium">
              {idx + 1}. {q.questionText}
            </p>
            {q.options?.map((opt, i) => (
              <li key={i}>
                <label className="flex items-center space-x-2">
                  <input
                    type={q.type === "multiple_choice" ? "checkbox" : "radio"}
                    name={`question-${idx}`}
                    value={opt}
                    checked={
                      q.type === "multiple_choice"
                        ? userAnswers[idx]?.includes(opt)
                        : userAnswers[idx] === opt
                    }
                    onChange={() =>
                      handleChange(idx, opt, q.type === "multiple_choice")
                    }
                  />
                  <span>{opt}</span>
                </label>
              </li>
            ))}
            {q.type === "short_answer" && (
              <input
                type="text"
                placeholder="Your answer"
                value={userAnswers[idx] || ""}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="border p-2 mt-2 w-full"
              />
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Submit Answers
      </button>
    </div>
  );
}
