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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room: {roomId}</h1>
        <button
          onClick={handleEndRoom}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          End Room
        </button>
      </div>
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Live Participants</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users joined yet.</p>
        ) : (
          <ul className="list-disc pl-6">
            {users.map((user) => (
              <li key={user.userId} className="text-gray-800">
                {user.firstname}
              </li>
            ))}
          </ul>
        )}
      </div>
      {roomEnded ? (
        <div className="text-center text-xl font-semibold text-red-600">
          The host has ended the room.
        </div>
      ) : liveQuestion ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4">{liveQuestion.title}</h1>
          <div className="grid gap-3">
            {liveQuestion.options.map((opt, idx) => (
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
            ))}
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
          Waiting for host to go live...
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
