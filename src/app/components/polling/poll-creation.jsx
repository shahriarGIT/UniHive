"use client";

import { useState } from "react";

function PollCreation({ socket, roomName }) {
  const [question, setQuestion] = useState("");
  const [pollType, setPollType] = useState("true/false"); // Default to true/false
  const [options, setOptions] = useState(["", ""]); // Initial options for select one/multiple
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!question) {
      setError("Question is required.");
      return;
    }

    let pollOptions = null;

    if (pollType === "select one" || pollType === "select multiple") {
      pollOptions = options.filter((option) => option.trim() !== ""); // Remove empty options
      if (pollOptions.length < 2) {
        setError(
          "At least two options are required for select one/multiple polls."
        );
        return;
      }
    } else if (pollType === "true/false") {
      pollOptions = ["True", "False"];
    }

    const pollData = {
      question: question,
      type: pollType,
      options: pollOptions,
    };

    socket.emit("createPoll", { roomName, pollData });

    socket.on("pollCreated", () => {
      setSuccessMessage("Poll created successfully!");
      setQuestion("");
      setOptions(["", ""]); // Reset options
    });

    socket.on("pollCreationFailed", (message) => {
      setError(message);
    });
  };

  return (
    <div>
      <h2>Create Poll</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="question">Question:</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pollType">Poll Type:</label>
          <select
            id="pollType"
            value={pollType}
            onChange={(e) => setPollType(e.target.value)}
          >
            <option value="true/false">True/False</option>
            <option value="select one">Select One</option>
            <option value="select multiple">Select Multiple</option>
          </select>
        </div>

        {(pollType === "select one" || pollType === "select multiple") && (
          <div>
            <h3>Options:</h3>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                <button type="button" onClick={() => handleRemoveOption(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>
              Add Option
            </button>
          </div>
        )}

        <button type="submit">Save Poll</button>
      </form>
    </div>
  );
}

export default PollCreation;
