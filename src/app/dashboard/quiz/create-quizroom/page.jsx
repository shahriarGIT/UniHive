"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function CreateQuizRoomPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = searchParams.get("quizId");

  const [quizTitle, setQuizTitle] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState("");

  useEffect(() => {
    if (quizId) {
      axios
        .get(`http://localhost:3001/api/quiz/${quizId}`)
        .then((res) => {
          setQuizTitle(res.data?.title || "Selected Quiz");
        })
        .catch((err) => {
          console.error("Failed to fetch quiz title", err);
        });
    }
  }, [quizId]);

  const handleCreateRoom = async () => {
    if (!roomName || !roomPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/create-quiz-room", {
        quizId,
        roomName,
        roomPassword,
        timerEnabled,
        timerDuration: timerEnabled ? parseInt(timerDuration) : undefined,
        hostId: "607f1f77bcf86cd799439011", // Placeholder
      });

      alert("Room created successfully!");
      router.push(`/dashboard/quiz/room/${roomName}/host`);
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz room.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        Create Room for Quiz: <span className="text-blue-600">{quizTitle}</span>
      </h1>

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Room Password"
          value={roomPassword}
          onChange={(e) => setRoomPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(e) => setTimerEnabled(e.target.checked)}
          />
          <label>Enable Timer</label>
        </div>

        {timerEnabled && (
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={timerDuration}
            onChange={(e) => setTimerDuration(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
          />
        )}

        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded w-full"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
