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

// Update FlashcardList component in app/flashcards/page.js
const FlashcardList = ({ flashcards, onTogglePublic, currentUserId }) => {
  const router = useRouter();

  const handleCardClick = (id) => {
    router.push(`flashcard/${id}`);
  };

  return (
    <div className="space-y-4">
      {flashcards.map((card) => (
        <div
          key={card._id}
          className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer relative"
          onClick={() => handleCardClick(card._id)}
        >
          {currentUserId === card.userId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePublic(card._id, !card.isPublic);
              }}
              className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                card.isPublic
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {card.isPublic ? "Public" : "Private"}
            </button>
          )}
          <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
          <p className="text-gray-600 mb-2">{card.description}</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Subject: {card.subject}</span>
            <span>Topic: {card.topic}</span>
            <span>Questions: {card.questions.length}</span>
            <span>Date: {new Date(card.date).toLocaleDateString()}</span>
          </div>
          {/* Rest of the card content */}
        </div>
      ))}
    </div>
  );
};
