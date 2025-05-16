"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const voteTypes = [
  {
    id: "text",
    title: "Text Voting",
    description: "Allow voters to choose from multiple text-based options.",
  },
  {
    id: "chart",
    title: "Chart Voting",
    description: "Create bar or pie chart-based visual voting.",
  },
  {
    id: "opinion",
    title: "Opinion Chart",
    description: "Users give opinions on text options with dynamic font size.",
  },
];

export default function CreateVotePage() {
  const [selectedType, setSelectedType] = useState(null);
  const router = useRouter();

  const handleNext = () => {
    if (selectedType) {
      router.push(`create-vote/${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Select Voting Method</h1>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {voteTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-6 rounded-xl shadow-md cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedType === type.id
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{type.title}</h2>
              <p className="text-gray-600 text-sm">{type.description}</p>
            </div>
          ))}
        </div>

        <button
          disabled={!selectedType}
          onClick={handleNext}
          className={`px-6 py-3 rounded-xl text-white font-semibold transition ${
            selectedType
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
