"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import io from "socket.io-client";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

let socket;

export default function QuizStatsPage() {
  const [correctCount, setCorrectCount] = useState(0);
  const [finishedUsers, setFinishedUsers] = useState([]);
  const [myScore, setMyScore] = useState(8);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showContent, setShowContent] = useState(false);

  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const router = useRouter();
  const params = useParams();
  const { score } = useAppSelector((state) => state.userData);
  const searchParams = useSearchParams();
  const usernameParam = searchParams.get("username");

  const { roomName } = params;

  console.log(roomName, "roomName");

  useEffect(() => {
    // For animation timing
    setTimeout(() => setShowContent(true), 300);

    // Connect to socket server (mock implementation)
    const socket = io("http://localhost:3001");

    socket.emit("joinRoom", {
      roomName,
      user: { id: userInfo?.id, name: usernameParam },
    });

    socket.emit("quizFinished", {
      roomName,
      userId: userInfo?.id,
    });

    socket.emit("joinStatsRoom", { roomName });

    socket.on("yourScore", ({ score }) => setMyScore(score));

    socket.on("quizStatsUpdate", ({ updatedParticipants, topThree }) => {
      setFinishedUsers(updatedParticipants);
      setLeaderboard(topThree);
    });

    // Cleanup function
    return () => {
      // socket.disconnect();
    };
  }, [roomName]);

  console.log(leaderboard, "leaderboard");

  // Count number of completed users
  const finishedCount = finishedUsers.filter(
    (user) => user.completed === true
  ).length;

  const handleReturnToDashboard = () => {
    // navigate("/");
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-6 py-10">
      <div
        className={`transform transition-all duration-700 ${
          showContent ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
          Quiz Completed! 🎉
        </h1>
        <p className="text-center text-gray-600 mb-8 animate-pulse-subtle">
          Great job on finishing the quiz
        </p>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-xl max-w-4xl">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-yellow-300 rounded-full p-8 opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 bg-indigo-800 rounded-full p-6 opacity-20"></div>

            <h2 className="text-xl font-semibold mb-4">Your Results</h2>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">✓</span>
                </div>
                <span>Your Score</span>
              </div>
              <span className="text-3xl font-bold">{score}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
                <span>Participants Done</span>
              </div>
              <span className="text-3xl font-bold">{finishedCount}</span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-yellow-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Leaderboard
            </h3>

            <LeaderBoard rows={leaderboard} />

            <button
              onClick={handleReturnToDashboard}
              className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg w-full transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderBoard({ rows }) {
  return (
    <ul className="space-y-3 w-full">
      <div className="mb-6 w-full">
        {rows.length > 0 ? (
          <div className="flex items-end justify-center space-x-4 h-64">
            {rows.length > 1 && (
              <div
                className="relative h-48 w-1/3 transition-all duration-500 hover:scale-105"
                style={{ animationDelay: "150ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md overflow-hidden border-t-4 border-gray-400">
                  <div className="absolute -top-6 -right-6 w-16 h-16 bg-gray-400/20 rounded-full"></div>
                  <div className="h-full flex flex-col justify-between p-4">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold mb-2">
                      2
                    </div>
                    <div className="mt-auto text-center">
                      <p className="text-gray-800 font-medium text-base truncate">
                        {rows[1].userId}
                      </p>
                      <div className="flex items-center justify-center mt-1 space-x-1">
                        <span className="font-bold text-xl text-gray-800">
                          {rows[1].totalScore}
                        </span>
                        <span className="text-lg">🥈</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              className="relative h-64 w-1/3 transition-all duration-500 hover:scale-105 z-10"
              style={{ animationDelay: "0ms" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-lg shadow-lg overflow-hidden border-t-4 border-yellow-400">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-yellow-400/20 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400/20 rounded-full"></div>
                <div className="h-full flex flex-col justify-between p-5">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xl mb-2 shadow-md">
                    1
                  </div>
                  <div className="mt-auto text-center">
                    <p className="text-gray-800 font-semibold text-lg truncate">
                      {rows[0].userId}
                    </p>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                      <span className="font-bold text-3xl text-amber-800">
                        {rows[0].totalScore}
                      </span>
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="mt-2 bg-yellow-400/30 rounded-full py-1 px-3 text-xs font-medium text-amber-800">
                      Top Score
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {rows.length > 2 && (
              <div
                className="relative h-44 w-1/3 transition-all duration-500 hover:scale-105"
                style={{ animationDelay: "300ms" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg shadow-md overflow-hidden border-t-4 border-amber-600">
                  <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-amber-600/20 rounded-full"></div>
                  <div className="h-full flex flex-col justify-between p-4">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold mb-2">
                      3
                    </div>
                    <div className="mt-auto text-center">
                      <p className="text-gray-800 font-medium text-base truncate">
                        {rows[2].userId}
                      </p>
                      <div className="flex items-center justify-center mt-1 space-x-1">
                        <span className="font-bold text-xl text-gray-800">
                          {rows[2].totalScore}
                        </span>
                        <span className="text-lg">🥉</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 italic bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No results yet
          </div>
        )}
      </div>
    </ul>
  );
}
