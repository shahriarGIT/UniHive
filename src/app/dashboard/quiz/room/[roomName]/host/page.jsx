"use client";
import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
// import socket from "@/utils/socket";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";
import io from "socket.io-client";

let socket;
export default function QuizRoomManagePage() {
  const [participants, setParticipants] = useState([]);
  const router = useRouter();
  const { roomName } = useParams();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const [host, setHost] = useState(null);
  const [isHost, setIsHost] = useState(null);
  const [quizStats, setQuizStats] = useState([]);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  // Calculate statistics
  const completedCount = participants.filter(
    (p) => p.status === "completed"
  ).length;
  const inProgressCount = participants.filter(
    (p) => p.status === "in-progress"
  ).length;
  const notStartedCount = participants.filter(
    (p) => p.status === "not-started"
  ).length;

  // Sample flashcard data (this would be fetched in a real app)
  const flashcard = {
    name: "Advanced JavaScript Concepts",
    subject: "Programming",
    topic: "JavaScript",
    date: new Date().toISOString(),
    questions: [
      {
        question: "What is a closure in JavaScript?",
        answer:
          "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).",
      },
      {
        question: "Explain prototypal inheritance",
        answer:
          "Objects can inherit properties directly from other objects. JavaScript's prototype mechanism.",
      },
      {
        question: "What is a promise in JavaScript?",
        answer:
          "A Promise is an object representing the eventual completion or failure of an asynchronous operation.",
      },
    ],
  };

  useEffect(() => {
    if (!userInfo?.id || !roomName) return;
    socket = io("http://localhost:3001");

    // Join the room
    socket.emit("joinRoom", {
      roomName,
      user: { id: userInfo.id, name: userInfo.firstname },
    });

    // Listen for participant updates
    socket.on("participantsUpdate", ({ participants, host }) => {
      setParticipants(participants);
      setHost(host);
      console.log("Updated participants:", participants);
      console.log("Host:", host);
      setHost(host);

      if (userInfo?.id === host?._id) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
    });

    socket.on("quizStatsUpdate", ({ updatedParticipants, topThree }) => {
      setParticipants(updatedParticipants);
      setQuizStats(updatedParticipants);
    });

    // Listen for quiz start
    socket.on("quizStarted", ({ quizId }) => {});

    return () => {
      socket.off("participantsUpdate");
      socket.off("quizStarted");
      socket.off("quizStatsUpdate");
      socket.disconnect();
    };
  }, [roomName, userInfo]);
  console.log(participants, "participants");
  console.log(quizStats, "quizStats");

  // count number of completed true boolean in quizStats
  const finishedCount = quizStats.filter(
    (user) => user.completed === true
  ).length;

  let countProgress = (finishedCount / participants.length) * 100;
  const handleStart = () => {
    socket.emit("startQuiz", { roomName });
    setIsStarted(true);
  };

  const handleEnd = () => {
    socket.emit("endQuiz", { roomName });
    setIsStarted(false);
  };

  return (
    <div className="bg-white rounded-xl border border-purple-100">
      <div className="min-h-[80vh] py-8 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-purple-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Room: {roomName}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  Host: {host?.name || "Loading..."}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  Topic: {flashcard.topic}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                  Questions: {currentIndex + 1}/{flashcard.questions.length}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg shadow-sm text-center border border-indigo-100">
                  <p className="text-xs text-gray-500 mb-1">Participants</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {participants.length - 1 < 0 ? 0 : participants.length - 1}{" "}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg shadow-sm text-center border border-green-100">
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {finishedCount}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm text-center border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {countProgress.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
                <h2 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center justify-between">
                  <span>Participants Status</span>
                  <span className="text-sm px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {participants.length - 1 < 0 ? 0 : participants.length - 1}{" "}
                    total
                  </span>
                </h2>
                <div className="max-h-64 overflow-y-auto pr-1">
                  <ul className="space-y-2">
                    {participants
                      .filter((p) => p._id?.toString() !== host._id.toString()) // 👈 exclude host
                      .map((participant) => (
                        <li
                          key={participant.userId}
                          className="py-3 px-4 flex items-center justify-between bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <span className="font-medium text-gray-800">
                            {participant.name || participant.username}
                          </span>

                          <span
                            className={`text-xs px-2.5 py-1 rounded-full ${
                              isStarted && participant.completed
                                ? "bg-green-100 text-green-800"
                                : isStarted
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-200 text-gray-600"
                            }`}
                          >
                            {isStarted
                              ? participant.completed
                                ? "Completed"
                                : "In Progress"
                              : "Not Started"}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between mt-8 gap-4">
                  <div className="flex gap-4">
                    <button
                      onClick={handleEnd}
                      disabled={!isStarted}
                      className={`px-5 py-2.5  hover:bg-red-600 text-white rounded-lg font-medium ${
                        isStarted ? "bg-red-600" : "bg-red-400"
                      }`}
                    >
                      End Session
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleStart}
                      disabled={isStarted}
                      className={`px-5 py-2.5  hover:bg-indigo-700 text-white rounded-lg font-medium ${
                        isStarted ? "bg-indigo-300" : "bg-indigo-600"
                      }`}
                    >
                      Start Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
