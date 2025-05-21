"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

let socket;

export default function JoinQuizRoomPage() {
  const [roomName, setRoomName] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const router = useRouter();

  useEffect(() => {
    // Initialize socket.io connection when the component mounts
    socket = io("http://localhost:3001");

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const handleJoinRoom = async () => {
    if (!roomName || !roomPassword) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      // Listen for any error during the join attempt
      socket.on("joinError", (error) => {
        setError(error.message);
      });
      router.push(`quiz-lobby/${roomName}?username=${username}`); // Redirect to the quiz room page

      // Listen for updated participants list upon successful room join
      socket.on("participantsUpdate", (updatedParticipants) => {});
    } catch (err) {
      console.error("Error joining room", err);
      setError("Failed to join quiz room. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Join a Quiz Room</h1>

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />
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

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleJoinRoom}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded w-full"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
