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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      {!isCreatingQuestions ? (
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 transition-all duration-300 animate-fade-in">
          <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800 relative">
            Create a Quiz
            <span className="absolute -right-8 top-0 text-4xl">✏️</span>
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                placeholder="Enter an engaging title for your quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Description
              </label>
              <textarea
                placeholder="Describe what your quiz is about"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 border bg-gray-50 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <button
              onClick={handleNextStep}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 py-3 rounded-lg w-full transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
            >
              Next: Add Questions
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-800">
              Add Questions
            </h2>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">{questions.length}</span>{" "}
              questions added
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-inner">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  value={questionType}
                  onChange={(e) => {
                    setQuestionType(e.target.value);
                    setOptions([]);
                    setCorrectAnswer("");
                    setCorrectAnswersMulti([]);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="single_choice">Single Choice</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              {/* Option Input for choice questions */}
              {(questionType === "single_choice" ||
                questionType === "multiple_choice") && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer Options
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add an option"
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAddOption}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                    {options.length === 0 ? (
                      <p className="text-gray-400 text-center text-sm italic">
                        No options added yet
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-600">
                          Select correct answer(s):
                        </h4>
                        {options.map((opt, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                          >
                            {questionType === "single_choice" ? (
                              <input
                                type="radio"
                                name="correct"
                                id={`option-${idx}`}
                                value={opt}
                                checked={correctAnswer === opt}
                                onChange={() => setCorrectAnswer(opt)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              />
                            ) : (
                              <input
                                type="checkbox"
                                id={`option-${idx}`}
                                checked={correctAnswersMulti.includes(opt)}
                                onChange={() => toggleMultiAnswer(opt)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                            )}
                            <label
                              htmlFor={`option-${idx}`}
                              className="flex-1 text-sm"
                            >
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {questionType === "true_false" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    {["True", "False"].map((val) => (
                      <label
                        key={val}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="true_false"
                          id={`tf-${val}`}
                          value={val}
                          checked={correctAnswer === val}
                          onChange={() => setCorrectAnswer(val)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {questionType === "short_answer" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the correct answer"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={handleAddQuestion}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              Add Question
            </button>

            <button
              onClick={handleSubmitQuiz}
              className={`flex-1 font-medium px-6 py-3 rounded-lg transition-colors shadow-md ${
                questions.length > 0
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={questions.length === 0}
            >
              Submit Quiz
            </button>
          </div>

          {questions.length > 0 && (
            <div className="w-full">
              <h3 className="text-xl font-bold mb-4 text-indigo-800 border-b pb-2">
                Questions Added
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-5 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 text-indigo-800 font-bold rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 mb-2">
                          {q.questionText}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-white mb-3">
                          <span className="px-2 py-1 bg-indigo-500 rounded-full">
                            {q.type.replace("_", " ")}
                          </span>
                        </div>

                        {q.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm font-medium text-gray-600">
                              Options:
                            </p>
                            <ul className="ml-5 text-sm text-gray-600 list-disc space-y-1">
                              {q.options.map((opt, i) => (
                                <li
                                  key={i}
                                  className={`${
                                    Array.isArray(q.correctAnswer)
                                      ? q.correctAnswer.includes(opt)
                                        ? "text-green-600 font-medium"
                                        : ""
                                      : q.correctAnswer === opt
                                      ? "text-green-600 font-medium"
                                      : ""
                                  }`}
                                >
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="mt-3 pt-2 border-t border-gray-100">
                          <p className="text-sm">
                            <span className="font-medium text-gray-700">
                              Correct answer:{" "}
                            </span>
                            <span className="text-green-600">
                              {Array.isArray(q.correctAnswer)
                                ? q.correctAnswer.join(", ")
                                : q.correctAnswer}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/*
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

          //  Option Input for choice questions 
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
    </div >
      */
