"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function CategoryCard() {
  const [quizzes, setQuizzes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);

  // combine two quizzed and flashcard array state in one array
  const [combinedData, setCombinedData] = useState([]);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/flashcards/public`
      );
      const data = await response.json();
      // flashwith with type
      const flashcardsWithType = data.map((flashcard) => ({
        ...flashcard,
        type: "Flashcard",
      }));
      setFlashcards(flashcardsWithType);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      // setLoading(false);
    }
  };
  console.log(flashcards, "from flashcard card");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/quizzes");
        // add another field to the quiz object type
        const quizzesWithType = res?.data.map((quiz) => ({
          ...quiz,
          type: "Quiz",
        }));
        setQuizzes(quizzesWithType);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };

    fetchQuizzes();
    fetchFlashcards();
  }, []);
  console.log(quizzes, "from quiz card");

  // combine two quizzed and flashcard array state in one array
  useEffect(() => {
    const combined = [...quizzes, ...flashcards];
    setCombinedData(combined);
  }, [quizzes, flashcards]);

  return (
    <div className=" mt-14 xs:pl-5 md:px-20 ">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {combinedData.map((item) => (
          <Link
            key={item._id}
            href={`dashboard/${item.type.toLowerCase()}/${item._id}`}
            className="relative group"
          >
            {/* 3D Icon that sticks above the card */}
            <div className="absolute -top-5 left-6 transform transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 z-10">
              <div className="flex  bg-indigo-500 text-white p-3 rounded-full shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-clipboard-list-icon lucide-clipboard-list"
                >
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <path d="M12 11h4" />
                  <path d="M12 16h4" />
                  <path d="M8 11h.01" />
                  <path d="M8 16h.01" />
                </svg>

                <span className="ml-1 text-white font-bold">{item.type}</span>
              </div>
            </div>

            {/* Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-xl shadow transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 transition-transform duration-300 group-hover:scale-[1.02]">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    {item.title}
                  </span>
                </h2>

                <div>
                  <div className="space-y-3 mt-3">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 text-xs">
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                    {item.subject}
                  </span>

                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
