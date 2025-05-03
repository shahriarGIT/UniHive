"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import io from "socket.io-client";

let socket;

export default function QuizStatsPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [finishedUsers, setFinishedUsers] = useState(1); // this user has finished
  const router = useRouter();
  const params = useParams();

  const { roomName, quizId } = params;

  useEffect(() => {
    // Connect to socket server
    socket = io("http://localhost:3001");

    // Join room for real-time updates
    socket.emit("joinStatsRoom", { roomName });

    // Get real-time finished count updates
    socket.on("quizStatsUpdate", ({ finishedCount }) => {
      setFinishedUsers(finishedCount);
    });

    // Optional: Fetch user's own result if not passed during navigation
    const userScore = localStorage.getItem("userScore");
    if (userScore) {
      setCorrectCount(parseInt(userScore));
    }

    socket.on("joinStatsRoom", ({ roomName }) => {
      if (!roomName) return;
      socket.join(`stats-${roomName}`);

      // Send current count immediately to the new stats page user
      const finishedSet = finishedParticipants.get(roomName) || new Set();
      socket.emit("quizStatsUpdate", { finishedCount: finishedSet.size });

      console.log(`Client joined stats room: stats-${roomName}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomName]);

  const handleReturnToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Completed 🎉</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <p className="text-lg mb-4">
          ✅ Your Correct Answers: <strong>{correctCount}</strong>
        </p>
        <p className="text-lg mb-4">
          👥 Participants Finished: <strong>{finishedUsers}</strong>
        </p>

        <button
          onClick={handleReturnToDashboard}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded w-full"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
