"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";
import { KeyRound, LogIn } from "lucide-react";

export default function JoinRoomPage() {
  const [roomId, setRoomId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3001/api/vote/room/verify",
        {
          roomId,
          passcode,
        }
      );

      const isHost = res.data.hostId === userInfo.id;
      console.log("Is host:", res);

      if (isHost) {
        router.push(`host/${roomId}`);
      } else {
        router.push(`join/${roomId}`);
      }
    } catch (err) {
      setError("Invalid room ID or passcode");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern"></div>

      <div className="w-full max-w-md px-4 z-10">
        <div className="overflow-hidden rounded-2xl shadow-xl bg-white/90 backdrop-blur-sm border border-white/20">
          {/* Purple header accent */}
          <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-600"></div>

          <div className="p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
              <KeyRound className="text-white h-8 w-8" />
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Join Room
            </h2>

            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <LogIn className="mr-2 h-5 w-5" /> Join Room
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have a room code?{" "}
          <a
            href="#"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Create a room
          </a>
        </p>
      </div>
    </div>
  );
}
