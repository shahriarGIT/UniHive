"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";

let socket; // Declare socket outside of component

export default function QuizRoomPage() {
  const [participants, setParticipants] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, userData, userError] = useIsLoggedIn();
  const { isLoggedIn, userInfo } = useAppSelector((state) => state.userInfo);
  // const [roomName, setRoomName] = useState("");
  const router = useRouter();
  const params = useParams();
  const roomName = params.roomName;
  useEffect(() => {
    // const roomId = router.query.roomId; // Get the room ID from the URL

    if (!roomName) return;

    // Initialize socket connection
    socket = io("http://localhost:3001");

    // Join the room on page load
    socket.emit("joinRoom", {
      roomName,
      user: { id: userInfo?.id, name: userInfo?.firstname },
    });

    // Listen for the updated participant list
    socket.on("participantsUpdate", (updatedParticipants) => {
      console.log("Updated participants:", updatedParticipants);

      setParticipants(updatedParticipants);
    });

    // Listen for quiz start status
    socket.on("quizStarted", ({ quizId }) => {
      // router.push(`/dashboard/quiz/quiz-test/${roomName}`);
      console.log(quizId);

      router.push(`/dashboard/quiz/room/${roomName}/quiz-test/${quizId}`);
      setIsStarted(true);
      console.log("Quiz started!");
    });

    return () => {
      socket.disconnect();
    };
  }, [roomName, userInfo]);

  // useEffect(() => {
  //   let isRoomHost = participants.some(
  //     (participant) => participant.userId === "607f1f77bcf86cd799439011"
  //   );
  //   console.log("Participants:", participants);

  //   // participants.forEach((participant) => {
  //   //   if (participant.userId === "607f1f77bcf86cd799439011") {
  //   //     isRoomHost = true;
  //   //     console.log("Is host:", isRoomHost);
  //   //   }
  //   // });

  //   setIsHost(isRoomHost);
  // }, [participants]);

  const handleStartQuiz = () => {
    console.log(params);
    console.log("Starting quiz in room:", roomName);

    socket.emit("startQuiz", { roomName }); // Emit to server to start the quiz
  };

  //  the way i want to design the  quiz is, everyone can see all question,
  //   after answering they can submit, which will take them to end page where
  //    they can see stats, how many have completed, and their marks how many
  //    are correct,

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", roomName); // Emit to server to leave the room
    router.push("/dashboard"); // Redirect back to dashboard
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">{`Quiz Room: ${roomName}`}</h1>

      <div className="w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Participants:</h2>
        <ul className="space-y-2">
          {participants &&
            participants?.participants?.map((participant) => (
              <li key={participant._id} className="text-sm text-gray-700">
                {participant.name}
              </li>
            ))}
        </ul>
        {/* isHost && !isStarted &&  */}
        {isHost && true && (
          <button
            onClick={handleStartQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded w-full"
          >
            Start Quiz
          </button>
        )}

        {isStarted && (
          <div className="mt-4 text-lg text-green-500">
            <p>The quiz has started! Good luck!</p>
          </div>
        )}

        <button
          onClick={handleLeaveRoom}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded w-full mt-4"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
