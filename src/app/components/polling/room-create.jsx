"use client";

import { useState } from "react";

function RoomCreation({ socket }) {
  const [roomName, setRoomName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!roomName || !passcode) {
      setError("Room name and passcode are required.");
      return;
    }

    socket.emit("createRoom", { roomName, passcode });

    socket.on("roomCreated", (roomName) => {
      setSuccessMessage(`Room "${roomName}" created successfully!`);
      setRoomName("");
      setPasscode("");
    });

    socket.on("roomCreationError", (message) => {
      setError(message);
    });
  };

  return (
    <div>
      <h2>Create Room</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="roomName">Room Name:</label>
          <input
            type="text"
            id="roomName"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="passcode">Passcode:</label>
          <input
            type="password"
            id="passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
        </div>
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
}

export default RoomCreation;
