"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import io from "socket.io-client";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

let socket;

export default function QuizStatsPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [finishedUsers, setFinishedUsers] = useState([]); // this user has finished
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const router = useRouter();
  const params = useParams();
  const [myScore, setMyScore] = useState(0);
  const { score } = useAppSelector((state) => state.userData);

  const { roomName, quizId } = params;
  const searchParams = useSearchParams();

  const usernameParam = searchParams.get("username");
  useEffect(() => {
    // Connect to socket server
    socket = io("http://localhost:3001");

    socket.emit("joinRoom", {
      roomName,
      user: { id: userInfo?.id, name: usernameParam },
    });

    socket.emit("quizFinished", {
      roomName,
      userId: userInfo?.id,
    });

    // Join room for real-time updates
    socket.emit("joinStatsRoom", { roomName });
    socket.on("yourScore", ({ score }) => setMyScore(score));

    // Get real-time finished count updates
    socket.on("quizStatsUpdate", ({ updatedParticipants }) => {
      setFinishedUsers(updatedParticipants);
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
      // socket.disconnect();
    };
  }, [roomName]);
  console.log(finishedUsers, "finishedUsers");
  // count number of completed true boolean in finishedUsers
  const finishedCount = finishedUsers.filter(
    (user) => user.completed === true
  ).length;

  const handleReturnToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Completed 🎉</h1>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <p className="text-lg mb-4">
          ✅ Your Correct Answers: <strong>{score}</strong>
        </p>
        <p className="text-lg mb-4">
          👥 Participants Finished: <strong>{finishedCount}</strong>
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
