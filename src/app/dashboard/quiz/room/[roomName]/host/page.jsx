"use client";
import { useState, useEffect } from "react";

import { useParams, useRouter } from "next/navigation";
import socket from "@/utils/socket";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

export default function QuizRoomManagePage() {
  const [participants, setParticipants] = useState([]);
  const router = useRouter();
  const { roomName } = useParams();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const [host, setHost] = useState(null);

  useEffect(() => {
    if (!userInfo?.id || !roomName) return;

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
    });

    // Listen for quiz start
    socket.on("quizStarted", ({ quizId }) => {
      router.push(`/dashboard/quiz/room/${roomName}/quiz-test/${quizId}`);
    });

    return () => {
      socket.off("participantsUpdate");
      socket.off("quizStarted");
    };
  }, [roomName, userInfo]);
  console.log(participants, "participants");

  const handleStart = () => {
    socket.emit("startQuiz", { roomName });
  };

  return (
    <div>
      <h1>Room: {roomName}</h1>
      <h2 className="text-lg font-semibold mb-2">
        Host: {host?.name || "Loading..."}
      </h2>

      <p>Waiting for participants to join...</p>
      <ul>
        <ul>
          {participants.map((p) => (
            <li key={p._id}>{p.name} </li>
          ))}
        </ul>
      </ul>

      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
}
