"use client";
import { useAppSelector } from "@/app/store";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import socket from "@/utils/socket";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Color palette
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#d0ed57"];

export default function JoinRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  const [liveQuestion, setLiveQuestion] = useState(null);
  const [voteResults, setVoteResults] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [roomEnded, setRoomEnded] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("question-live", (question) => {
      setLiveQuestion(question);
      setHasVoted(false);
      setVoteResults({});
    });

    socket.on("update-votes", (votes) => {
      setVoteResults(votes);
    });

    socket.on("room-ended", () => {
      setRoomEnded(true);
      setLiveQuestion(null);
    });

    if (userInfo && roomId) {
      socket.emit("join-room", { roomId, userInfo });
    }

    socket.on("update-user-list", (userList) => {
      console.log("User list updated:", userList);

      setUsers(userList);
    });

    const handleBeforeUnload = () => {
      socket.emit("leave-room", { roomId, userId: userInfo?.id });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.emit("leave-room", { roomId, userId: userInfo?.id });
      socket.off("update-user-list");
    };
  }, [roomId, userInfo]);

  const handleVote = (option) => {
    if (hasVoted || !liveQuestion) return;
    socket.emit("vote", {
      roomId,
      questionId: liveQuestion._id,
      selectedOption: option,
    });
    setHasVoted(true);
  };
  const handleEndRoom = () => {
    router.push("/dashboard/vote");
  };
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-sm font-medium text-purple-600">
              Active Session
            </span>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              Room: {roomId}
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </h1>
          </div>
          <button
            onClick={handleEndRoom}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
              <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            End Room
          </button>
        </div>
      </div>
      <div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Live Participants
            <span className="ml-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {users.length}
            </span>
          </h2>

          {users.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto text-gray-400 mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p className="text-gray-500">No users joined yet</p>
            </div>
          ) : (
            <div>
              <div className="space-y-3 mt-3">
                {users.map((user) => (
                  <div
                    key={user.userId}
                    className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                        {user.firstname.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-800">
                        {user.firstname}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {roomEnded ? (
        <div className="text-center text-xl font-semibold text-red-600">
          The host has ended the room.
        </div>
      ) : liveQuestion ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">{liveQuestion.title}</h1>
          <div className="grid gap-3">
            {liveQuestion.type === "opinion" ? (
              /* ⬇ Opinion chart UI */
              <OpinionChart
                question={liveQuestion}
                voteResults={voteResults}
                hasVoted={hasVoted}
                onVote={handleVote}
              />
            ) : (
              liveQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={hasVoted}
                  onClick={() => handleVote(opt)}
                  className={`px-4 py-2 rounded-lg border ${
                    hasVoted
                      ? "bg-gray-300"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>

          {hasVoted && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Live Results:</h2>
              <ul className="text-sm space-y-1">
                {Object.entries(voteResults).map(([opt, count]) => (
                  <li key={opt} className="flex justify-between">
                    <span>{opt}</span>
                    <span>{count} vote(s)</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <div className="flex flex-col mt-14 p-6 rounded-2xl sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700">
            <h1 className="font-black text-white text-3xl ">
              {" "}
              Waiting for host to go live...{" "}
            </h1>

            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>

          {hasVoted && Object.keys(voteResults).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Live Results</h2>

              <PieChart width={400} height={300}>
                <Pie
                  data={Object.entries(voteResults).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {Object.entries(voteResults).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const base = 1.2; // rem, initial size
const step = 0.25; // rem added per vote
const maxRem = 3.5; // cap so text doesn’t explode

const OpinionChart = ({ question, voteResults, hasVoted, onVote }) => {
  const base = 1.2;
  const step = 0.3;
  const maxRem = 3.5;

  const sizeForVotes = (count) => `${Math.min(base + step * count, maxRem)}rem`;

  // highest count to highlight winners
  const maxVotes = Object.values(voteResults).length
    ? Math.max(...Object.values(voteResults))
    : 0;

  return (
    <div className="space-y-3">
      {question.options.map((opt) => {
        const count = voteResults[opt] || 0;
        const winner = hasVoted && count === maxVotes && maxVotes > 0;

        return (
          <button
            key={opt}
            disabled={hasVoted}
            onClick={() => onVote(opt)}
            style={{ fontSize: sizeForVotes(count) }}
            className={`w-full py-3  transition ${
              hasVoted ? (winner ? "" : "") : "hover:bg-blue-100"
            }`}
          >
            {opt}
            <span className="ml-2 text-sm">{count}</span>
          </button>
        );
      })}
    </div>
  );
};
