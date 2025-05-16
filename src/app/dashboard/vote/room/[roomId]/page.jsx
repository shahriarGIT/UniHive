"use client";
import { useAppSelector } from "@/app/store";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import socket from "@/utils/socket";

export default function HostRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  const [roomData, setRoomData] = useState(null);
  const [questionList, setQuestionList] = useState([]);
  const [liveVotes, setLiveVotes] = useState({});
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!roomId || !userInfo?.id) return;

    socket.emit("join-room", { roomId, userId: userInfo.id });

    socket.on("update-votes", (votes) => {
      setLiveVotes(votes);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userInfo]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/room/${roomId}`);
        setRoomData(res.data);
      } catch (err) {
        setError("Room not found");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleGoLive = (question) => {
    setActiveQuestionId(question._id);
    socket.emit("go-live", { roomId, question });
  };

  const handleEndRoom = () => {
    socket.emit("end-room", { roomId });
    router.push("/dashboard/vote");
  };

  //   if (isLoading || !roomData) return <div>Loading room...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Room: {roomData?.roomName}</h1>
        <p className="text-gray-500 text-sm">Room ID: {roomData?._id}</p>
        <p className="text-gray-500 text-sm">Passcode: {roomData?.passcode}</p>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Your Vote Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questionList.map((q) => (
            <div
              key={q._id}
              className="p-4 border rounded-xl bg-gray-50 shadow"
            >
              <p className="font-medium mb-2">{q.title}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleGoLive(q)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                >
                  Go Live
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeQuestionId && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Live Vote</h3>
          <p className="text-sm mt-2 text-blue-700">
            Votes coming in real-time...
          </p>
          <pre className="mt-2 text-sm text-gray-800 bg-white p-2 rounded">
            {JSON.stringify(liveVotes, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleEndRoom}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg"
        >
          End Room
        </button>
      </div>
    </div>
  );
}
