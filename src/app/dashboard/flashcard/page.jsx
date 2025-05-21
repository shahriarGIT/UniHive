"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";
import { useRouter } from "next/navigation";

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchFlashcards();
    setCurrentUserId(userInfo?.id);
  }, [userInfo]);

  const fetchFlashcards = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/flashcards?userId=${userInfo?.id}`
      );
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublic = async (flashcardId, isPublic) => {
    console.log("Toggle public status:", flashcardId, isPublic);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/flashcard/${flashcardId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isPublic }),
        }
      );

      const updatedFlashcard = await response.json();
      setFlashcards((prev) =>
        prev.map((card) =>
          card._id === updatedFlashcard._id ? updatedFlashcard : card
        )
      );
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <CreateFlashcardButton />

        {loading ? (
          <p className="text-center text-gray-600">Loading flashcards...</p>
        ) : flashcards.length > 0 ? (
          <FlashcardList
            currentUserId={currentUserId}
            flashcards={flashcards}
            onTogglePublic={handleTogglePublic}
          />
        ) : (
          <p className="text-center text-gray-600">
            No flashcards found. Create one!
          </p>
        )}
      </div>
    </div>
  );
}

const CreateFlashcardButton = () => (
  <div className="mb-8">
    <Link
      href="flashcard/create"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
    >
      Create New Flashcard
    </Link>
  </div>
);

const FlashcardList = ({ flashcards, onTogglePublic, currentUserId }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`flashcard/${id}`);
  };

  return (
    <div className="space-y-6">
      {flashcards.map((card) => (
        <div
          key={card._id}
          className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md hover:shadow-xl border border-purple-100/50 transition-all duration-300 cursor-pointer"
          onClick={() => handleCardClick(card._id)}
        >
          {/* Card background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxwYXRoIGQ9Ik0zMCAxMGExMCAxMCAwIDAxMCAyMCAzNSAzNSAwIDAxLTIwIDAgMTAgMTAgMCAwMTAtMjAgMzUgMzUgMCAwMTIwIDB6IiBmaWxsPSIjZjNlOGZmIiBmaWxsLW9wYWNpdHk9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          {/* Card content */}
          <div className="relative p-6">
            {currentUserId === card.userId && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePublic(card._id, !card.isPublic);
                }}
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                  card.isPublic
                    ? "bg-green-400 text-white hover:bg-green-400  border border-green-200"
                    : "bg-red-500 text-white hover:bg-red-600 border border-gray-200"
                }`}
              >
                {card.isPublic ? "Public" : "Private"}
              </button>
            )}

            {/* Card header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 group-hover:from-purple-600 group-hover:to-indigo-700 transition-colors duration-300">
                {card.title}
              </h3>
              <p className="text-gray-500 text-[.9rem] mt-2 line-clamp-2 group-hover:text-gray-800 transition-colors">
                Description : {card.description}
              </p>
            </div>

            {/* Card details */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center text-purple-700/80">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  ></path>
                </svg>
                Subject: {card.subject}
              </span>
              <span className="flex items-center text-indigo-700/80">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                  ></path>
                </svg>
                Category: {card.category}
              </span>
              <span className="flex items-center text-purple-600/80">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {card.questions.length}{" "}
                {card.questions.length === 1 ? "Question" : "Questions"}
              </span>
              <span className="flex items-center text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                {new Date(card.date).toLocaleDateString()}
              </span>
            </div>

            {/* Hover effect decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
