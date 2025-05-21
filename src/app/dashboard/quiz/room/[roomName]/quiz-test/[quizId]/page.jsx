"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import io from "socket.io-client";
import axios from "axios";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { setScore } from "@/app/store/slices/dataSlice";
import useCountdown from "@/hooks/useCountDown";

let socket;

export default function QuizTestPage() {
  const { quizId, roomName } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const { score } = useAppSelector((state) => state.userData);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const usernameParam = searchParams.get("username");
  const [startIso, setStartIso] = useState(null);
  const [duration, setDuration] = useState(0);

  const timeLeft = useCountdown(0, 5);

  console.log(duration, "duration data");

  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.emit("joinRoom", {
      roomName,
      user: { id: userInfo?.id, name: usernameParam },
    });

    fetch(`http://localhost:3001/api/quizzes/${quizId}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, [quizId]);
  console.log(currentScore, "currentScore score data");

  useEffect(() => {
    if (!socket) return;

    socket.on("quizStarted", ({ quizId, startedAt, duration }) => {
      // non-host users will land here; host can ignore
      setStartIso(startedAt);
      setDuration(duration);

      console.log("Quiz started at: called");
    });

    socket.on("quizStatsUpdate", (stats) => {
      console.log("Live stats:", stats);
    });

    socket.on("quizForceEnded", () => {
      handleSubmit();
    });

    return () => {
      socket.off("quizStatsUpdate");
      socket.off("quizForceEnded");
    };
  }, []);

  console.log(score, "global score data");

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

  const handleSubmit = async () => {
    try {
      // Step 1: Submit the answers to the backend
      const response = await axios.post(
        "http://localhost:3001/api/submit-quiz",
        {
          roomName,
          quizId,
          userId: userInfo?.id, // You should already have the current user's ID
          answers, // Whatever format you're using
        }
      );

      // Step 2: Show result to the user
      setCurrentScore(response.data.score); // or use context or state to show result

      // set data to store reduxtoolkit
      dispatch(setScore(response.data.score));

      // Step 3: Emit quizFinished to backend for real-time tracking

      // Step 4: Redirect or navigate to stats page
      router.push(
        `/dashboard/quiz/room/${roomName}/quiz-test/${quizId}/quiz-stats?username=${usernameParam}`
      );
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  // Format mm:ss
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 mb-4 rounded-full bg-indigo-300"></div>
          <div className="h-6 w-32 bg-indigo-300 rounded"></div>
          <p className="mt-4 text-indigo-500 font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 text-white">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div className="flex items-center mt-2 text-sm">
            <span>Room: {roomName}</span>
            <span className="mx-2">•</span>
            <span>{totalQuestions} questions</span>
          </div>
          {/* Header with countdown */}
          {duration > 0 && (
            <div className="mb-4 text-right text-lg font-semibold">
              ⏰ {mm}:{ss}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100">
          <div
            className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
            style={{
              width: `${(Object.keys(answers).length / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>

        {/* Questions */}
        <div className="p-6">
          {quiz.questions.map((q, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-lg p-6 mb-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-indigo-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-3">
                  {index + 1}
                </div>
                <p className="font-medium text-lg text-gray-800">
                  {q.questionText}
                </p>
              </div>

              {q.type === "true_false" && (
                <div className="space-y-3 mt-4 pl-11">
                  {["True", "False"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        answers[index] === opt
                          ? "bg-indigo-100 border-indigo-300 border"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={opt}
                        checked={answers[index] === opt}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "single_choice" && (
                <div className="space-y-3 mt-4 pl-11">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        answers[index] === opt
                          ? "bg-indigo-100 border-indigo-300 border"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={opt}
                        checked={answers[index] === opt}
                        onChange={(e) => handleChange(index, e.target.value)}
                        className="form-radio h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "multiple_choice" && (
                <div className="space-y-3 mt-4 pl-11">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        (answers[index] || []).includes(opt)
                          ? "bg-indigo-100 border-indigo-300 border"
                          : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name={`q${index}`}
                        value={opt}
                        checked={(answers[index] || []).includes(opt)}
                        onChange={() => handleMultipleChoiceChange(index, opt)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-800">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === "short_answer" && (
                <div className="mt-4 pl-11">
                  <input
                    type="text"
                    value={answers[index] || ""}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Type your answer here..."
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with submit button */}
        <div className="p-6 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-medium text-indigo-600">
              {Object.keys(answers).length}
            </span>{" "}
            of {totalQuestions} questions answered
          </div>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
