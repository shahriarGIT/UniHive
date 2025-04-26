"use client";

import { useState } from "react";

function RoomJoin({ socket, onRoomJoined }) {
  const [roomName, setRoomName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!roomName || !passcode) {
      setError("Room name and passcode are required.");
      return;
    }

    socket.emit("joinRoom", { roomName, passcode });

    socket.on("roomJoinError", (message) => {
      setError(message);
    });

    socket.on("userJoined", (data) => {
      onRoomJoined(roomName); // Call the callback to update the parent component
      console.log("user joined", data);
    });
  };

  return (
    <div>
      <h2>Join Room</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}

export default RoomJoin;
