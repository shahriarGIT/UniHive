import { useState, useEffect } from "react";

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3001/api/flashcards",
          {}
        );
        const data = await response.json();
        setFlashcards(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  return { flashcards, loading, error };
};
