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
          <Link
            key={quiz._id}
            href={`dashboard/quiz/${quiz._id}`}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
            <p className="text-gray-600">
              {quiz.description || "No description"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
