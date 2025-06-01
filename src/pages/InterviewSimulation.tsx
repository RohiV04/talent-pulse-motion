
import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { LiveKitRoom } from "@livekit/components-react";
import VideoConferenceRoom from "@/components/interview/VideoConferenceRoom";
import JoinRoomForm from "@/components/interview/JoinRoomForm";
import InterviewHeader from "@/components/interview/InterviewHeader";

interface RoomData {
  token: string;
  wsUrl: string;
  roomName: string;
}

const InterviewSimulation = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  const handleJoinRoom = (data: RoomData) => {
    setRoomData(data);
  };

  const handleDisconnected = () => {
    setRoomData(null);
  };

  return (
    <AppLayout>
      <div className="h-full">
        {!roomData ? (
          <div className="container mx-auto py-8">
            <InterviewHeader />
            <JoinRoomForm onJoinRoom={handleJoinRoom} />
          </div>
        ) : (
          <LiveKitRoom
            token={roomData.token}
            serverUrl={roomData.wsUrl}
            connect={true}
            onDisconnected={handleDisconnected}
            style={{ height: '100vh' }}
          >
            <VideoConferenceRoom roomData={roomData} />
          </LiveKitRoom>
        )}
      </div>
    </AppLayout>
  );
};

export default InterviewSimulation;
