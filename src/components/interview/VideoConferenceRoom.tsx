
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  MessageSquare, 
  Users,
  Monitor,
  MoreVertical
} from "lucide-react";
import { 
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
  ParticipantTile,
  Chat,
  GridLayout,
  useRoomContext
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

  // Convert participants Map to Array for ParticipantLoop
  const participantsArray = room ? Array.from(room.remoteParticipants.values()) : [];

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Main video area */}
      <div className="flex-1 relative">
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - 200px)' }}>
          {participantsArray.map((participant) => (
            <ParticipantTile
              key={participant.sid}
              participant={participant}
              className="bg-gray-800 rounded-lg"
            />
          ))}
        </GridLayout>
        
        {/* AI Agent placeholder */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          AI Interview Agent
        </div>
        
        {/* Chat panel */}
        {showChat && (
          <div className="absolute right-0 top-0 h-full w-80 bg-white border-l shadow-lg">
            <Chat />
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Left controls */}
          <div className="flex items-center space-x-2">
            <div className="text-white text-sm">
              Room: {roomData.roomName}
            </div>
          </div>

          {/* Center controls */}
          <div className="flex items-center space-x-4">
            <Button
              size="lg"
              variant={isMicEnabled ? "secondary" : "destructive"}
              className="rounded-full h-12 w-12"
              onClick={toggleMicrophone}
            >
              {isMicEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button
              size="lg"
              variant={isCameraEnabled ? "secondary" : "destructive"}
              className="rounded-full h-12 w-12"
              onClick={toggleCamera}
            >
              {isCameraEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              size="lg"
              variant="destructive"
              className="rounded-full h-12 w-12"
              onClick={handleEndCall}
            >
              <Phone className="h-5 w-5" />
            </Button>
          </div>

          {/* Right controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white">
              <Users className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white">
              <Monitor className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="text-white">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <RoomAudioRenderer />
    </div>
  );
};

export default VideoConferenceRoom;
