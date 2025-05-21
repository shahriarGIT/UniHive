"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import socket from "@/utils/socket";

import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

export default function HostRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  const [questions, setQuestions] = useState([]);
  const [liveQuestion, setLiveQuestion] = useState(null);
  const [voteResults, setVoteResults] = useState({
    JavaScript: 8,
    Python: 12,
    Java: 5,
    "C#": 7,
  });
  const [roomEnded, setRoomEnded] = useState(false);
  const [users, setUsers] = useState([
    { userId: "u1", firstname: "Alex Johnson" },
    { userId: "u2", firstname: "Maria Garcia" },
    { userId: "u3", firstname: "James Wilson" },
  ]);

  useEffect(() => {
    if (!roomId || !userInfo?.id) return;

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
      setUsers(userList);
      console.log("User list updated:", userList);
    });

    const handleRemove = async (vodeId) => {
      try {
        await axios.delete(`http://localhost:3001/api/vote/delete/${vodeId}`);
        setQuestions((prev) => prev.filter((q) => q._id !== id));
      } catch (err) {
        console.error("Failed to delete vote:", err);
      }
    };

    // Fetch host's vote questions
    const fetchVotes = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:3001/api/votes/created-by/${userInfo.id}`
        //   );
        const res = await axios.get(
          `http://localhost:3001/api/vote/user/${userInfo.id}`
        );

        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching votes:", err);
      }
    };

    fetchVotes();

    const handleBeforeUnload = () => {
      socket.emit("leave-room", { roomId, userId: userInfo?.id });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.emit("leave-room", { roomId, userId: userInfo?.id });
      socket.off("update-user-list");
    };
  }, [roomId, userInfo?.userId]);
  console.log(questions, "questions");

  const handleGoLive = (question) => {
    setLiveQuestion(question);
    socket.emit("go-live", { roomId, question });
  };

  const handleEndRoom = () => {
    socket.emit("end-room", { roomId });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative p-6 md:p-8">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header with room info and actions */}
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

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Library */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 h-full">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Your Question Library
              </h2>

              {questions.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-10 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p className="text-gray-500 font-medium">
                    No questions created yet.
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Create your first question to get started.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {questions.map((q) => (
                    <li
                      key={q._id}
                      className="border border-gray-100 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-800">
                        {q.question}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleGoLive(q)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Go Live
                        </button>
                        <button
                          onClick={() => handleRemove(q._id)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Participants Panel */}
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
        </div>

        {/* Live Question Results */}
        {liveQuestion && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mt-8">
            <div className="flex items-center mb-2">
              <div className="flex h-3 w-3 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <p className="font-medium text-red-600">LIVE</p>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {liveQuestion.title}
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex-shrink-0 w-full md:w-auto">
                <PieChart width={300} height={300}>
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

              <div className="mt-6 md:mt-0 w-full md:w-auto">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Response Summary
                </h3>
                <div className="space-y-2">
                  {Object.entries(voteResults).map(([option, count], index) => (
                    <div
                      key={option}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="text-gray-800">{option}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {count}
                        </span>
                        <span className="text-gray-500 text-sm">
                          (
                          {Math.round(
                            (count /
                              Object.values(voteResults).reduce(
                                (a, b) => a + b,
                                0
                              )) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Responses:</span>
                    <span className="font-medium text-gray-900">
                      {Object.values(voteResults).reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {roomEnded && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mt-8 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-red-500 mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Room Ended</h2>
            <p className="text-red-500">
              This room is no longer active. Results have been saved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
