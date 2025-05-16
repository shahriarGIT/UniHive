"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function CategoryCard() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/quizzes");
        const publicQuizzes = res.data.filter((quiz) => quiz.isPublic);
        setQuizzes(publicQuizzes);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className=" mt-14 xs:pl-5 md:px-20 ">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          // <Link
          //   key={quiz._id}
          //   href={`dashboard/quiz/${quiz._id}`}
          //   className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          // >
          //   <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
          //   <p className="text-gray-600">
          //     {quiz.description || "No description"}
          //   </p>
          // </Link>
          <Link
            key={quiz._id}
            href={`dashboard/quiz/${quiz._id}`}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {quiz.title}
              </h2>

              <div>
                <div className="space-y-3 mt-3">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {quiz.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
