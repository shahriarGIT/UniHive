"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";
import socket from "@/utils/socket";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ParticipantRoomPage() {
  const { roomId } = useParams();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [votes, setVotes] = useState({});
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("activeQuestion", (question) => {
      setActiveQuestion(question);
      setSelectedOption("");
      setVoteSubmitted(false);
      setShowResult(false);
      setVotes({});
    });

    socket.on("voteUpdate", (voteData) => {
      setVotes(voteData);
    });

    socket.on("voteEnded", () => {
      setShowResult(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleVote = () => {
    if (!selectedOption || voteSubmitted) return;
    socket.emit("castVote", {
      roomId,
      questionId: activeQuestion._id,
      option: selectedOption,
      userId: userInfo.id,
    });
    setVoteSubmitted(true);
  };

  const chartData = {
    labels: Object.keys(votes),
    datasets: [
      {
        label: "# of Votes",
        data: Object.values(votes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Participant Room</h1>

      {!activeQuestion && (
        <p className="text-gray-500 text-center">
          Waiting for host to start a vote...
        </p>
      )}

      {activeQuestion && (
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">
            {activeQuestion.questionText}
          </h2>

          {!voteSubmitted && !showResult && (
            <>
              {activeQuestion.options.map((opt, index) => (
                <label key={index} className="block mb-2">
                  <input
                    type="radio"
                    name="vote"
                    value={opt}
                    onChange={() => setSelectedOption(opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
              <button
                onClick={handleVote}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Vote
              </button>
            </>
          )}

          {voteSubmitted && !showResult && (
            <p className="text-green-600 mt-4">
              Vote submitted. Waiting for results...
            </p>
          )}

          {showResult && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Result:</h3>
              <Pie data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
