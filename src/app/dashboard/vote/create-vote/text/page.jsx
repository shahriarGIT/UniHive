"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

export default function CreateTextVotePage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || options.some((opt) => !opt.trim())) {
      alert("Please enter a question and all options.");
      return;
    }

    const voteData = {
      type: "text",
      question,
      options,
      userId: userInfo.id,
      username: userInfo.firstname,
    };

    const res = await fetch("http://localhost:3001/api/vote/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voteData),
    });

    if (res.ok) {
      router.push("/dashboard/vote");
    } else {
      alert("Failed to create vote");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Text Vote</h1>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-medium">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300"
            placeholder="Enter your question here"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg font-medium">Options</label>
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="flex-1 p-3 rounded-lg border border-gray-300"
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addOption}
            className="text-blue-600 mt-2 hover:underline text-sm"
          >
            + Add Option
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Save to Library
        </button>
      </div>
    </div>
  );
}
