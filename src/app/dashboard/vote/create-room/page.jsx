"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [passcode, setPasscode] = useState("");
  const router = useRouter();

  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //       </div>
  //     );
  //   }

  if (!isLoggedIn || !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <svg
              className="mx-auto h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium">
              Authentication Required
            </h3>
            <p className="mt-1 text-sm">
              Please log in to create a voting room.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateRoom = async () => {
    if (!roomName || !passcode) {
      alert("Please fill in both fields.");
      return;
    }

    const res = await fetch("http://localhost:3001/api/vote/room/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomName,
        passcode,
        userId: userInfo.id,
        userName: userInfo.firstname,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`host/${roomName}`);
    } else {
      alert(data.message || "Failed to create room");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Voting Room
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Secure your voting session with a name and passcode
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                placeholder="Enter room name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-sm"
            >
              Create Voting Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
