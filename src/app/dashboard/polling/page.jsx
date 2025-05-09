"use client";
import socket from "@/utils/socket";
import { useEffect, useState } from "react";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollType, setPollType] = useState("true_false");
  const [options, setOptions] = useState(["True", "False"]);
  const [polls, setPolls] = useState([]);
  const [livePoll, setLivePoll] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [voteResults, setVoteResults] = useState(null);
  const [votesSubmitted, setVotesSubmitted] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);

  const [updatedPolls, setUpdatedPolls] = useState([]);

  const [totalVotes, setTotalVotes] = useState(0);

  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("poll_ended", ({ results, correctAnswers }) => {
      console.log("Poll ended - correct answers:", correctAnswers);

      setVoteResults(results);
      setCorrectAnswers(correctAnswers); // save correct answers to show
    });

    socket.on("room_created", (roomName) => {
      setCurrentRoom(roomName);
      setIsHost(true);
    });

    socket.on("room_joined", (roomName) => {
      setCurrentRoom(roomName);
      setIsHost(false);
    });

    socket.on("users_in_room", (users) => {
      setUsersInRoom(users);
    });

    socket.on("poll_started", (poll) => {
      setLivePoll(poll);
    });

    socket.on("vote_count_updated", (count) => {
      setTotalVotes(count);
    });

    socket.on("poll_ended", ({ results, correctAnswers }) => {
      console.log("Poll ended - correct answers:", correctAnswers);

      setVoteResults(results);
      setCorrectAnswers(correctAnswers);
    });

    socket.on("polls_updated", (updatedPolls) => {
      // overwrite your local polls array with the server’s truth
      setPolls(updatedPolls);
    });

    socket.on("error_message", (message) => {
      alert(message);
    });

    return () => {
      socket.off("room_created");
      socket.off("room_joined");
      socket.off("users_in_room");
      socket.off("poll_started");
      socket.off("vote_count_updated");
      socket.off("poll_ended");
      socket.off("error_message");
      socket.off("polls_updated");
    };
  }, []);

  // (all your functions here - no change)

  const handleCreateRoom = () => {
    if (!roomName || !passcode)
      return alert("Room name and passcode required!");

    socket.emit("create_room", {
      roomName,
      passcode,
      username,
    });
  };

  const handleJoinRoom = () => {
    if (!roomName || !passcode)
      return alert("Room name and passcode required!");

    socket.emit("join_room", {
      roomName,
      passcode,
      username,
    });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const toggleCorrectAnswer = (index) => {
    if (correctAnswers.includes(index)) {
      setCorrectAnswers(correctAnswers.filter((i) => i !== index));
    } else {
      setCorrectAnswers([...correctAnswers, index]);
    }
  };

  const handleSavePoll = () => {
    const selectedCorrectOptions = correctAnswers.map(
      (index) => options[index]
    );

    const newPoll = {
      question: pollQuestion,
      type: pollType,
      options: options,
      correctAnswers: selectedCorrectOptions, // save correct option texts
    };

    socket.emit("save_poll", {
      roomName: currentRoom,
      poll: newPoll,
    });

    setPolls([...polls, newPoll]);
    setPollQuestion("");
    setPollType("true_false");
    setOptions(["True", "False"]);
    setCorrectAnswers([]);
  };

  const handleGoLivePoll = (index) => {
    const poll = polls[index];
    socket.emit("go_live_poll", { roomName: currentRoom, pollIndex: index });
  };

  const handleSubmitVote = () => {
    socket.emit("submit_vote", { roomName: currentRoom, selectedOptions });
    setSelectedOptions([]);
  };

  const handleEndPoll = () => {
    socket.emit("end_poll", { roomName: currentRoom });
  };

  const handleCorrectSelection = (index) => {
    if (pollType === "select_multiple") {
      toggleCorrectAnswer(index); // multiple allowed
    } else {
      setCorrectAnswers([index]); // only one correct allowed
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Polling Dashboard</h1>

      {/* Users in Room */}
      {usersInRoom.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">
            Users in Room ({usersInRoom.length})
          </h3>
          <ul className="list-disc list-inside">
            {usersInRoom.map((user, idx) => (
              <li key={idx} className="text-gray-700">
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create or Join Room */}
      {!currentRoom && (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowCreateForm(true);
                setShowJoinForm(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
            >
              Create Room
            </button>
            <button
              onClick={() => {
                setShowJoinForm(true);
                setShowCreateForm(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
            >
              Join Room
            </button>
          </div>

          {/* Create Room Form */}
          {showCreateForm && (
            <div className="bg-white p-6 rounded shadow w-full max-w-md mt-6">
              <h2 className="text-2xl font-semibold mb-4">Create Room</h2>
              <input
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                placeholder="Passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <button
                onClick={handleCreateRoom}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
              >
                Submit
              </button>
            </div>
          )}

          {/* Join Room Form */}
          {showJoinForm && (
            <div className="bg-white p-6 rounded shadow w-full max-w-md mt-6">
              <h2 className="text-2xl font-semibold mb-4">Join Room</h2>
              <input
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                placeholder="Passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full mb-3 p-2 border rounded"
              />
              <input
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}

      {/* Room Dashboard */}
      {currentRoom && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">
            📋 Dashboard: {currentRoom}
          </h2>

          {/* Host Panel */}
          {isHost && (
            <div className="bg-white p-6 rounded shadow mb-10">
              <h3 className="text-xl font-semibold mb-4">Create a Poll</h3>
              <input
                placeholder="Poll Question"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <select
                value={pollType}
                onChange={(e) => {
                  const selectedType = e.target.value;
                  setPollType(selectedType);

                  if (selectedType === "true_false") {
                    setOptions(["True", "False"]);
                    setCorrectAnswers([]);
                  } else {
                    setOptions(["", ""]);
                    setCorrectAnswers([]);
                  }
                }}
                className="w-full mb-4 p-2 border rounded"
              >
                <option value="true_false">True/False</option>
                <option value="select_one">Select One</option>
                <option value="select_multiple">Select Multiple</option>
              </select>

              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                  <input
                    type={pollType === "select_multiple" ? "checkbox" : "radio"}
                    name="correct-answer"
                    checked={correctAnswers.includes(index)}
                    onChange={() => handleCorrectSelection(index)}
                  />
                  <span>Correct</span>
                </div>
              ))}

              {(pollType === "select_one" ||
                pollType === "select_multiple") && (
                <button
                  onClick={addOption}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mb-4"
                >
                  Add Option
                </button>
              )}
              <br />
              <button
                onClick={handleSavePoll}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded mt-4"
              >
                Save Poll
              </button>
            </div>
          )}

          {/* Saved Polls */}
          {isHost && (
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">Saved Polls</h3>
              <ul className="space-y-3">
                {polls.map((poll, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <div>
                      <strong>{poll.question}</strong> ({poll.type})
                    </div>
                    <button
                      onClick={() => handleGoLivePoll(index)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded"
                    >
                      Go Live
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Live Poll Section */}
      {livePoll && (
        <div className="bg-white p-6 rounded shadow mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center">🔥 Live Poll</h2>
          <h3 className="text-lg font-semibold mb-4">{livePoll.question}</h3>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{
                width: `${
                  usersInRoom.length > 1
                    ? (totalVotes / (usersInRoom.length - 1)) * 100
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-gray-600 mb-6 text-center">
            {totalVotes}/{usersInRoom.length - 1} answered
          </p>

          {/* Options */}
          <div className="space-y-4">
            {livePoll.type !== "select_multiple"
              ? livePoll.options.map((opt, idx) => (
                  <div key={idx}>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="vote"
                        value={opt}
                        onChange={(e) => setSelectedOptions([e.target.value])}
                      />
                      {opt}
                    </label>
                  </div>
                ))
              : livePoll.options.map((opt, idx) => (
                  <div key={idx}>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOptions((prev) => [
                              ...prev,
                              e.target.value,
                            ]);
                          } else {
                            setSelectedOptions((prev) =>
                              prev.filter((val) => val !== e.target.value)
                            );
                          }
                        }}
                      />
                      {opt}
                    </label>
                  </div>
                ))}
          </div>

          <button
            onClick={handleSubmitVote}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded mt-6"
          >
            Submit Vote
          </button>

          {isHost && (
            <button
              onClick={handleEndPoll}
              className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded mt-4"
            >
              End Poll
            </button>
          )}

          {/* Results */}
          {voteResults && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Results</h2>
              {Object.entries(voteResults).map(([option, count]) => (
                <div key={option} className="mb-2">
                  {option}: {count} votes{" "}
                  {correctAnswers.includes(option) && (
                    <span className="text-green-600 font-bold">✅ Correct</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
