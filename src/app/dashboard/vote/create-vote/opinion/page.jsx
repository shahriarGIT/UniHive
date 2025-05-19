"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/store";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";

export default function OpinionChartForm() {
  const router = useRouter();

  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");

  const handleOptionChange = (idx, val) => {
    const next = [...options];
    next[idx] = val;
    setOptions(next);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (idx) => setOptions(options.filter((_, i) => i !== idx));

  const handleSave = async () => {
    if (!question.trim() || options.filter((o) => o.trim()).length < 2) {
      setError("Need a title and at least 2 opinions");
      return;
    }

    try {
      //   await axios.post("http://localhost:3001/api/vote/create", {
      //     userId: userInfo.id,
      //     type: "opinion",
      //     title: title.trim(),
      //     options: options.map((o) => o.trim()).filter(Boolean),
      //   });

      //     router.push("/dashboard/vote"); // back to library

      const voteData = {
        type: "opinion",
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
    } catch (e) {
      setError("Could not save – try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Opinion Chart</h1>

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Question title"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <h2 className="font-semibold mb-2">Opinions</h2>
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center mb-2">
          <input
            className="flex-1 border p-2 rounded"
            value={opt}
            placeholder={`Opinion ${idx + 1}`}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
          />
          {options.length > 2 && (
            <button
              onClick={() => removeOption(idx)}
              className="ml-2 text-red-600"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addOption}
        className="text-blue-600 mb-4 hover:underline"
      >
        + add option
      </button>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save Question
      </button>
    </div>
  );
}
