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
                    className="relative overflow-hidden border border-gray-100 p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-500"></div>

                    <h3 className="text-lg font-bold mb-2 text-gray-800">
                      {vote.question}
                    </h3>

                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {vote.type}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleGoLive(vote._id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-md hover:from-green-600 hover:to-emerald-700 transition-colors duration-300 shadow-sm flex items-center justify-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Edit
                      </button>

                      <button
                        onClick={() => handleRemove(vote._id)}
                        className="flex-1 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
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
