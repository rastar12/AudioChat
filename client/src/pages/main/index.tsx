import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { StreamVideo, Call } from "@stream-io/video-react-sdk";
import { useUser } from "../../user-context";
import CryptoJS from "crypto-js";
import styled from "styled-components";
import { motion } from "framer-motion";

interface Room {
  id: string;
  title: string;
  description: string;
  participantsLength: number;
  createdBy: string;
}

interface NewRoom {
  name: string;
  description: string;
}

const Home = () => {
  const { user, isLoading, client, setCall } = useUser();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [newRoom, setNewRoom] = useState<NewRoom>({
    name: "",
    description: "",
  });

  const hashRoomName = (roomName: string): string => {
    const hash = CryptoJS.SHA256(roomName).toString(CryptoJS.enc.Base64);
    return hash.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const createRoom = async () => {
    const { name, description } = newRoom;
    if (!client || !user || !name || !description) return;
    const roomID = hashRoomName(name);
    const call = client.call("audio_room", roomID);
    await call.join({
      create: true,
      data: {
        members: [{ user_id: user.username }],
        custom: { title: name, description },
      },
    });
    setCall(call);
    navigate(`/room/${roomID}`);
  };

  const joinRoom = async (roomId: string) => {
    const call = client?.call("audio_room", roomId);
    await call?.join();
    setCall(call);
    navigate("/room/" + roomId);
  };

  useEffect(() => {
    if (client) fetchListOfCalls();
  }, [client]);

  const fetchListOfCalls = async () => {
    const callsQueryResponse = await client?.queryCalls({
      filter_conditions: { ongoing: true },
      limit: 25,
      watch: true,
    });
    if (callsQueryResponse) {
      const getCallInfo = async (call: Call): Promise<Room> => {
        const callInfo = await call.get();
        const customData = callInfo.call.custom || {};
        return {
          id: callInfo.call.id ?? "",
          title: customData.title ?? "",
          description: customData.description ?? "",
          participantsLength: callInfo.members.length ?? 0,
          createdBy: callInfo.call.created_by.name ?? "",
        };
      };
      const rooms = await Promise.all(callsQueryResponse.calls.map(getCallInfo));
      setRooms(rooms);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (!user) return <Navigate to="/sign-in" />;
  if (!client) return;

  return (
    <StreamVideo client={client!}>
      <Container>
        <Title>Welcome, {user?.name}</Title>
        <FormContainer
          as={motion.div}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Subtitle>Create Your Own Room</Subtitle>
          <Input
            placeholder="Room Name..."
            onChange={(e) => setNewRoom((prev) => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Room Description..."
            onChange={(e) => setNewRoom((prev) => ({ ...prev, description: e.target.value }))}
          />
          <Button onClick={createRoom}>Create Room</Button>
          <Subtitle>Available Rooms</Subtitle>
        </FormContainer>
        <RoomsGrid>
          {rooms.map((room) => (
            <RoomCard
              as={motion.div}
              key={room.id}
              onClick={() => joinRoom(room.id)}
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(125, 7, 236, 0.5)" }}
            >
              <RoomTitle>{room.title}</RoomTitle>
              <RoomDescription>{room.description}</RoomDescription>
              <Participants>{room.participantsLength} Participants</Participants>
              <CreatedBy>Created By: {room.createdBy}</CreatedBy>
            </RoomCard>
          ))}
        </RoomsGrid>
      </Container>
    </StreamVideo>
  );
};

export default Home;


const Container = styled.div.attrs({
  className: "min-h-screen bg-transparent opacity-90 text-white p-8",
})``;

const Title = styled.h1.attrs({
  className: "text-3xl font-bold mb-8 text-center text-purple-500",
})``;

const FormContainer = styled.div.attrs({
  className: "max-w-md mx-auto bg-gray-800 rounded-lg p-6 mb-8 shadow-lg",
})``;

const Subtitle = styled.h2.attrs({
  className: "text-2xl font-semibold mb-4 text-purple-400",
})``;

const Input = styled.input.attrs({
  className: "w-full p-3 mb-4 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500",
})``;

const Button = styled.button.attrs({
  className: "w-full p-3 mb-6 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition",
})``;

const RoomsGrid = styled.div.attrs({
  className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
})``;

const RoomCard = styled.div.attrs({
  className: "p-6 bg-gray-800 rounded-lg shadow-lg hover:cursor-pointer",
})``;

const RoomTitle = styled.h4.attrs({
  className: "text-xl font-bold text-purple-500",
})``;

const RoomDescription = styled.p.attrs({
  className: "text-gray-300 mb-2",
})``;

const Participants = styled.p.attrs({
  className: "text-sm text-gray-400",
})``;

const CreatedBy = styled.p.attrs({
  className: "text-sm text-gray-500 italic",
})``;
