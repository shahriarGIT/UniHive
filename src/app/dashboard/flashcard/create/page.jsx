"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

export default function CreateFlashcardPage() {
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  console.log(userInfo);

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    topic: "",
    description: "",
    isPublic: false,
    date: new Date().toISOString().split("T")[0],
  });
  const [questions, setQuestions] = useState([
    { id: Date.now(), question: "", answer: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), question: "", answer: "" },
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !formData.name.trim() ||
      questions.some((q) => !q.question.trim() || !q.answer.trim())
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); // Debugging line

      const response = await fetch(
        "http://localhost:3001/api/create-flashcard",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userId: userInfo.id,
            questions: questions.map(({ id, ...rest }) => rest),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create flashcard");

      router.push("dashboard/flashcard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Flashcard</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded h-24"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm">Make this flashcard public</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Questions *</h2>

          {questions.map((q, index) => (
            <div key={q.id} className="space-y-2 group relative">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Question {index + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(q.id, "question", e.target.value)
                }
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                placeholder="Answer"
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(q.id, "answer", e.target.value)
                }
                className="w-full p-2 border rounded h-20"
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="w-full py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50"
          >
            Add Another Question
          </button>
        </div>

        {/* Form Actions */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.push("/flashcards")}
            className="px-4 py-2 border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Create Flashcard"}
          </button>
        </div>
      </form>
    </div>
  );
}
