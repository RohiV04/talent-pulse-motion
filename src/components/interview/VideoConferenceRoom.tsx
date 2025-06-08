import { useState } from "react";
import { 
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
  VideoTrack,
  Chat,
  GridLayout,
  useRoomContext,
  ParticipantTile
} from "@livekit/components-react";
import { Track } from "livekit-client";

interface RoomData {
  token: string;
  wsUrl: string;
  roomName: string;
}

interface VideoConferenceRoomProps {
  roomData: RoomData;
}

const VideoConferenceRoom = ({ roomData }: VideoConferenceRoomProps) => {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  const toggleMicrophone = () => {
    localParticipant.setMicrophoneEnabled(!isMicEnabled);
    setIsMicEnabled(!isMicEnabled);
  };

  const toggleCamera = () => {
    localParticipant.setCameraEnabled(!isCameraEnabled);
    setIsCameraEnabled(!isCameraEnabled);
  };

  const handleEndCall = () => {
    if (room) {
      room.disconnect();
    }
  };

  return (
    <div>
      <GridLayout tracks={tracks}>
        <ParticipantTile />
      </GridLayout>
      {showChat && <Chat />}
      <div>
        <button onClick={toggleMicrophone}>
          {isMicEnabled ? "Mute Mic" : "Unmute Mic"}
        </button>
        <button onClick={toggleCamera}>
          {isCameraEnabled ? "Disable Camera" : "Enable Camera"}
        </button>
        <button onClick={handleEndCall}>End Call</button>
        <button onClick={() => setShowChat(!showChat)}>
          {showChat ? "Hide Chat" : "Show Chat"}
        </button>
      </div>
      <RoomAudioRenderer />
    </div>
  );
};

export default VideoConferenceRoom;
