"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import socket from "@/utils/socket";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

export default function HostRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const [roomData, setRoomData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("activeQuestion", (question) => {
      setActiveQuestion(question);
      setShowResults(false);
    });

    socket.on("voteEnded", () => {
      setShowResults(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    // Fetch room data
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/vote/room/${roomId}`
        );
        setRoomData(res.data);
        setQuestions(res.data.questions);
      } catch (err) {
        console.error("Error fetching room data:", err);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (userInfo && roomId) {
      socket.emit("join-room", { roomId, userInfo });
    }

    socket.on("update-user-list", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("update-user-list");
    };
  }, [userInfo, roomId]);

  const handleGoLive = (questionId) => {
    socket.emit("goLive", { roomId, questionId });
  };

  const handleEndVote = () => {
    socket.emit("endVote", { roomId });
  };

  const handleGoBack = () => {
    router.push("/dashboard");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Host Room</h1>

      {roomData && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Room Info</h2>
          <p>Room ID: {roomData._id}</p>
          <p>Passcode: {roomData.passcode}</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        <ul>
          {questions.map((question) => (
            <li
              key={question._id}
              className="flex justify-between items-center mb-2"
            >
              <span>{question.questionText}</span>
              <div>
                {activeQuestion && activeQuestion._id === question._id ? (
                  <button
                    className="bg-gray-600 text-white px-4 py-2 rounded disabled"
                    disabled
                  >
                    Question Live
                  </button>
                ) : (
                  <button
                    onClick={() => handleGoLive(question._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Go Live
                  </button>
                )}
                <button
                  onClick={() => handleEndVote()}
                  className="ml-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  End Vote
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showResults && (
        <div className="bg-white p-6 rounded shadow mt-6">
          <h3 className="text-lg font-semibold">Vote Results</h3>
          {/* Display results here */}
          {/* Could be a pie chart or any other form of results */}
        </div>
      )}

      <button
        onClick={handleGoBack}
        className="mt-6 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Go Back to Dashboard
      </button>
    </div>
  );
}
