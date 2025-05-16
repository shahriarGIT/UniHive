"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const [votes, setVotes] = React.useState([]);
  const handleNavigate = (path) => {
    router.push(path);
  };

  useEffect(() => {
    async function fetchVotes() {
      if (!userInfo) return;
      const res = await fetch(
        `http://localhost:3001/api/vote/user/${userInfo.id}`
      );
      const data = await res.json();
      setVotes(data);
    }

    fetchVotes();
  }, [userInfo]);

  const handleRemove = async (voteId) => {
    if (!confirm("Are you sure you want to remove this vote?")) return;

    const res = await fetch(`http://localhost:3001/api/vote/delete/${voteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setVotes((prev) => prev.filter((v) => v._id !== voteId));
    } else {
      alert("Failed to delete vote");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">
          Voting Dashboard
        </h1>

        {/* Top Section: Voting Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <DashboardCard
            title="Create Vote"
            description="Design a new voting question with text or chart options"
            color="blue"
            onClick={() => handleNavigate("vote/create-vote")}
          />
          <DashboardCard
            title="Create Room"
            description="Start a live voting session with participants"
            color="green"
            onClick={() => handleNavigate("vote/create-room")}
          />
          <DashboardCard
            title="Join Room"
            description="Enter an existing room using a passcode"
            color="purple"
            onClick={() => handleNavigate("vote/join")}
          />
        </div>

        {/* Bottom Section: Library */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Vote Library
          </h2>
          {/* Placeholder for vote list */}
          <div className="text-gray-500 italic">
            You haven’t created any votes yet.
            {votes.length === 0 ? (
              <p className="text-gray-500">No votes created yet.</p>
            ) : (
              <div className="grid gap-4">
                {votes.map((vote) => (
                  <div
                    key={vote._id}
                    className="border p-4 rounded-xl bg-white shadow"
                  >
                    <h3 className="text-lg font-bold">{vote.question}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Type: {vote.type}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleGoLive(vote._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Go Live
                      </button>
                      <button
                        onClick={() => handleRemove(vote._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable card component
function DashboardCard({ title, description, color, onClick }) {
  const colorMap = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-200 transform hover:scale-105 text-white rounded-xl p-6 shadow-md ${colorMap[color]}`}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
}
