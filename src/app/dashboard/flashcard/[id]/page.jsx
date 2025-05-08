"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function StudyFlashcardPage() {
  const router = useRouter();
  const { id } = useParams();
  const [flashcard, setFlashcard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    const fetchFlashcard = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3001/api/flashcard/${id}`
        );
        const data = await response.json();
        setFlashcard(data);
      } catch (error) {
        console.error("Error fetching flashcard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcard();
  }, [id]);

  const handleNext = () => {
    if (currentIndex < flashcard.questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setShowAnswer(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setShowAnswer(false);
        setIsAnimating(false);
      }, 300);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading flashcard...</div>;
  }

  if (!flashcard) {
    return (
      <div className="text-center p-8">
        <p>Flashcard not found</p>
        <Link href="flashcard" className="text-blue-500 mt-4 inline-block">
          Back to Flashcards
        </Link>
      </div>
    );
  }

  if (!flashcard || !flashcard.questions) {
    return (
      <div className="text-center p-8">
        <p>Flashcard not found or invalid</p>
        <Link href="/flashcards" className="text-blue-500 mt-4 inline-block">
          Back to Flashcards
        </Link>
      </div>
    );
  }

  // Handle empty questions array case
  if (flashcard.questions.length === 0) {
    return (
      <div className="text-center p-8">
        <p>This flashcard has no questions</p>
        <Link href="/flashcards" className="text-blue-500 mt-4 inline-block">
          Back to Flashcards
        </Link>
      </div>
    );
  }

  // Use optional chaining and default to first question

  let currentQuestion = flashcard.questions[currentIndex];

  if (!sessionStarted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">{flashcard.name}</h1>
        <div className="mb-6 text-gray-600">
          <p>Subject: {flashcard.subject}</p>
          <p>Topic: {flashcard.topic}</p>
          <p>Total Questions: {flashcard.questions.length}</p>
        </div>
        <button
          onClick={() => setSessionStarted(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Start Session
        </button>
        <button
          onClick={() => router.push("/flashcards")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{flashcard.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Subject: {flashcard.subject}</span>
          <span>Topic: {flashcard.topic}</span>
          <span>Date: {new Date(flashcard.date).toLocaleDateString()}</span>
          <span>
            Questions: {currentIndex + 1}/{flashcard.questions.length}
          </span>
        </div>
      </div>

      <div
        className={`bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 ${
          isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
        }`}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Question</h2>
          <p className="text-gray-700 text-lg">{currentQuestion?.question}</p>
        </div>

        <div
          className="border-t pt-6 cursor-pointer"
          onMouseEnter={() => setShowAnswer(true)}
          onMouseLeave={() => setShowAnswer(false)}
        >
          <h2 className="text-lg font-semibold mb-4">Answer</h2>
          <div className="relative min-h-[100px]">
            <p
              className={`text-gray-700 text-lg transition-opacity duration-200 ${
                showAnswer ? "opacity-100" : "opacity-0"
              }`}
            >
              {currentQuestion.answer}
            </p>
            {!showAnswer && (
              <div className="absolute inset-0 bg-gray-50 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">Hover to reveal answer</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/dashboard/flashcard")}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              End Session
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcard.questions.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
