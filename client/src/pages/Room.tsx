import React, { useState } from "react";
import { motion } from "framer-motion";

interface Room {
  id: string;
  title: string;
  description: string;
  participants: number;
  imageUrl: string;
}

const Rooms: React.FC = () => {
  const [rooms] = useState<Room[]>([
    {
      id: "1",
      title: "Tech Talk",
      description: "Discuss the latest in tech with experts.",
      participants: 20,
      imageUrl: "https://source.unsplash.com/600x400/?technology",
    },
    {
      id: "2",
      title: "Book Club",
      description: "Dive deep into recent books and classics.",
      participants: 15,
      imageUrl: "https://source.unsplash.com/600x400/?books",
    },
    {
      id: "3",
      title: "Fitness Chat",
      description: "Get tips and tricks on staying fit.",
      participants: 8,
      imageUrl: "https://source.unsplash.com/600x400/?fitness",
    },
  ]);

  const handleCreateRoom = () => {
    console.log("Redirecting to room creation page...");
  };

  const handleJoinRoom = (roomId: string) => {
    console.log(`Joining room with ID: ${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-teal-300">Podcast Rooms</h1>
        <button
          onClick={handleCreateRoom}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-md text-lg font-semibold"
        >
          Create New Room
        </button>
      </div>

      <div className="space-y-8">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={room.imageUrl}
              alt={room.title}
              className="w-full h-52 object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 p-6 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold">{room.title}</h2>
              <p className="text-lg mt-2 mb-4">{room.description}</p>
              <p className="text-sm text-gray-300">
                {room.participants} participants
              </p>
              <button
                onClick={() => handleJoinRoom(room.id)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md font-semibold"
              >
                Join Room
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
