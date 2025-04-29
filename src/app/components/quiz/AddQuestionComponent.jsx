import { useState } from "react";

function AddQuestionsComponent({ questions, setQuestions, handleSubmitQuiz }) {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("single_choice");

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question.");
      return;
    }

    const newQuestion = {
      text: questionText,
      type: questionType,
      options: [], // we'll handle options later
      correctAnswer: "", // handle later
    };

    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setQuestionType("single_choice");
  };

  return (
    <div className="w-full max-w-2xl mt-6">
      <h2 className="text-2xl font-semibold mb-4">Add Questions</h2>

      <input
        type="text"
        placeholder="Enter Question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="w-full p-3 mb-4 border border-gray-300 rounded"
      />

      <select
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded"
      >
        <option value="true_false">True/False</option>
        <option value="single_choice">Single Choice</option>
        <option value="multiple_choice">Multiple Choice</option>
        <option value="short_answer">Short Answer</option>
      </select>

      <button
        onClick={handleAddQuestion}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded mb-6"
      >
        Add Question
      </button>

      <div className="mb-8">
        {questions.map((q, index) => (
          <div key={index} className="border p-3 rounded mb-2 bg-white">
            <strong>Q{index + 1}:</strong> {q.text} ({q.type})
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmitQuiz}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded"
      >
        Submit Quiz
      </button>
    </div>
  );
}

export default AddQuestionsComponent;
