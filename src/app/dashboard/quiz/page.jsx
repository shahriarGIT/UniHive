"use client";

import { useState } from "react";
import axios from "axios";
import AddQuestionsComponent from "@/app/components/quiz/AddQuestionComponent";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("single_choice");
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState([]);

  const [correctAnswer, setCorrectAnswer] = useState("");
  const [correctAnswersMulti, setCorrectAnswersMulti] = useState([]);

  const [isCreatingQuestions, setIsCreatingQuestions] = useState(false);

  const handleNextStep = () => {
    if (!title.trim()) {
      alert("Title is required.");
      return;
    }
    setIsCreatingQuestions(true);
  };

  const handleAddOption = () => {
    if (!optionInput.trim()) return;
    setOptions([...options, optionInput.trim()]);
    setOptionInput("");
  };

  const toggleMultiAnswer = (option) => {
    if (correctAnswersMulti.includes(option)) {
      setCorrectAnswersMulti(correctAnswersMulti.filter((o) => o !== option));
    } else {
      setCorrectAnswersMulti([...correctAnswersMulti, option]);
    }
  };

  const handleAddQuestion = () => {
    if (!questionText.trim()) {
      alert("Question text is required.");
      return;
    }

    let answer;

    switch (questionType) {
      case "multiple_choice":
        if (correctAnswersMulti.length === 0) {
          alert("Please select at least one correct answer.");
          return;
        }
        answer = correctAnswersMulti;
        break;
      case "single_choice":
      case "true_false":
        if (!correctAnswer) {
          alert("Please select the correct answer.");
          return;
        }
        answer = correctAnswer;
        break;
      case "short_answer":
        if (!correctAnswer.trim()) {
          alert("Please provide the correct answer.");
          return;
        }
        answer = correctAnswer.trim();
        break;
    }

    const newQuestion = {
      questionText: questionText.trim(),
      type: questionType,
      options:
        questionType === "single_choice" || questionType === "multiple_choice"
          ? options
          : [],
      correctAnswer: answer,
    };

    setQuestions([...questions, newQuestion]);

    // Reset fields
    setQuestionText("");
    setQuestionType("single_choice");
    setOptions([]);
    setCorrectAnswer("");
    setCorrectAnswersMulti([]);
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/create-quiz", {
        title,
        description,
        questions,
        isPublic: true,
      });
      alert("Quiz created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {!isCreatingQuestions ? (
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6">Create a Quiz</h1>

          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />

          <textarea
            placeholder="Quiz Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded"
          />

          <button
            onClick={handleNextStep}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded w-full"
          >
            Next: Add Questions
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Add Questions</h2>

          <input
            type="text"
            placeholder="Question Text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          />

          <select
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              setOptions([]);
              setCorrectAnswer("");
              setCorrectAnswersMulti([]);
            }}
            className="w-full p-3 mb-4 border border-gray-300 rounded"
          >
            <option value="single_choice">Single Choice</option>
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True/False</option>
            <option value="short_answer">Short Answer</option>
          </select>

          {/* Option Input for choice questions */}
          {(questionType === "single_choice" ||
            questionType === "multiple_choice") && (
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add option"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddOption}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Option
                </button>
              </div>
              <div className="space-y-1">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {questionType === "single_choice" ? (
                      <input
                        type="radio"
                        name="correct"
                        value={opt}
                        checked={correctAnswer === opt}
                        onChange={() => setCorrectAnswer(opt)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={correctAnswersMulti.includes(opt)}
                        onChange={() => toggleMultiAnswer(opt)}
                      />
                    )}
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questionType === "true_false" && (
            <div className="mb-4 space-y-1">
              {["True", "False"].map((val) => (
                <label key={val} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="true_false"
                    value={val}
                    checked={correctAnswer === val}
                    onChange={() => setCorrectAnswer(val)}
                  />
                  {val}
                </label>
              ))}
            </div>
          )}

          {questionType === "short_answer" && (
            <input
              type="text"
              placeholder="Correct Answer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddQuestion}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded"
            >
              Add Question
            </button>

            <button
              onClick={handleSubmitQuiz}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded"
            >
              Submit Quiz
            </button>
          </div>

          <div className="w-full">
            <h3 className="text-xl font-bold mb-2">Questions Added:</h3>
            {questions.map((q, index) => (
              <div key={index} className="p-4 mb-3 border rounded bg-white">
                <p>
                  <strong>Q{index + 1}:</strong> {q.questionText}
                </p>
                <p>
                  <strong>Type:</strong> {q.type}
                </p>
                {q.options.length > 0 && (
                  <ul className="list-disc ml-6">
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}
                <p className="mt-2">
                  <strong>Answer:</strong>{" "}
                  {Array.isArray(q.correctAnswer)
                    ? q.correctAnswer.join(", ")
                    : q.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
