"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useIsLoggedIn from "@/hooks/useIsLoggedIn";
import { useAppSelector } from "@/app/store";
import io from "socket.io-client";

import { useSearchParams } from "next/navigation";

let socket; // Declare socket outside the component to manage the connection
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
  const searchParams = useSearchParams();
  const [host, setHost] = useState({});
  const usernameParam = searchParams.get("username");
  const [currentIndex, setCurrentIndex] = useState(0);

  const flashcard = {
    name: "Advanced JavaScript Concepts",
    subject: "Programming",
    topic: "JavaScript",
    date: new Date().toISOString(),
    questions: [
      {
        question: "What is a closure in JavaScript?",
        answer:
          "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).",
      },
      {
        question: "Explain prototypal inheritance",
        answer:
          "Objects can inherit properties directly from other objects. JavaScript's prototype mechanism.",
      },
      {
        question: "What is a promise in JavaScript?",
        answer:
          "A Promise is an object representing the eventual completion or failure of an asynchronous operation.",
      },
    ],
  };

  useEffect(() => {
    socket = io("http://localhost:3001");

    // Join the room on page load
    socket.emit("joinRoom", {
      roomName,
      user: { id: userInfo?.id, name: usernameParam },
    });

    socket.on("participantsUpdate", (updatedParticipants, host) => {
      console.log("Updated participants:", updatedParticipants);

      setParticipants(updatedParticipants);
    });

    // Listen for quiz start status
    socket.on("quizStarted", ({ quizId }) => {
      // router.push(`/dashboard/quiz/quiz-test/${roomName}`);
      console.log(quizId);

      router.push(
        `/dashboard/quiz/room/${roomName}/quiz-test/${quizId}?username=${usernameParam}`
      );
      setIsStarted(true);
      console.log("Quiz started!");
    });
  }, []);

  useEffect(() => {
    // const roomId = router.query.roomId; // Get the room ID from the URL

    if (!roomName) return;

    // Initialize socket connection
    socket = io("http://localhost:3001");

    // Join the room on page load
    // socket.emit("joinRoom", {
    //   roomName,
    //   user: { id: userInfo?.id, name: usernameParam },
    // });

    // Listen for the updated participant list
    // socket.on("participantsUpdate", (updatedParticipants, host) => {
    //   console.log("Updated participants:", updatedParticipants);
    //   console.log("Updated host:", host);

    //   setParticipants(updatedParticipants);
    //   setIsHost(host);
    // });

    // Listen for quiz start status
    socket.on("quizStarted", ({ quizId }) => {
      // router.push(`/dashboard/quiz/quiz-test/${roomName}`);
      console.log(quizId);

      router.push(
        `/dashboard/quiz/room/${roomName}/quiz-test/${quizId}?username=${usernameParam}`
      );
      setIsStarted(true);
      console.log("Quiz started!");
    });

    return () => {
      // socket.disconnect();
      socket.off("quizStarted");
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
    socket.disconnect(); // Emit to server to leave the room
    router.push("/dashboard"); // Redirect back to dashboard
  };

  return (
    <div className="bg-white rounded-xl  border border-purple-100">
      <div className="min-h-[80vh] py-8 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-purple-100"></div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Room: {roomName}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                Host: {participants.host?.name || "Loading..."}
              </span>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                Topic: {flashcard.topic}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                Questions: {currentIndex + 1}/{flashcard.questions.length}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
            <h2 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center justify-between">
              <span>Participants Status</span>
              <span className="text-sm px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                {participants?.participants?.length - 1 < 0
                  ? 0
                  : participants?.participants?.length - 1}{" "}
                total
              </span>
            </h2>
            <div className="max-h-64 overflow-y-auto pr-1">
              <ul className="space-y-2">
                {participants &&
                  participants?.participants
                    ?.filter(
                      (p) =>
                        p._id?.toString() !== participants?.host?._id.toString()
                    )
                    .map((participant) => (
                      // <li key={participant._id} className="text-sm text-gray-700">
                      //   {participant.name}
                      // </li>
                      <li
                        key={participant.userId}
                        className="py-3 px-4 flex items-center justify-between  bg-amber-200 rounded-lg border border-gray-100"
                      >
                        <span className="font-medium text-gray-800">
                          {participant.name || participant.username}
                        </span>

                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            isStarted && participant.completed
                              ? "bg-green-100 text-green-800"
                              : isStarted
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-400 text-gray-600"
                          }`}
                        >
                          {"Waiting"}
                        </span>
                      </li>
                    ))}
              </ul>
            </div>

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
      </div>
    </div>
  );
}
