
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  MessageSquare, 
  Settings,
  MoreVertical,
  Users,
  Monitor
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { 
  LiveKitRoom, 
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
  ParticipantTile,
  Chat,
  ControlBar,
  GridLayout,
  ParticipantLoop,
  TrackReferenceOrPlaceholder,
  useLiveKitRoom
} from "@livekit/components-react";
import { Track, Room } from "livekit-client";

// API endpoint for getting LiveKit tokens
const LIVEKIT_API_URL = "http://localhost:3001/api/livekit";

interface RoomData {
  token: string;
  wsUrl: string;
  roomName: string;
}

const VideoConferenceRoom = ({ roomData }: { roomData: RoomData }) => {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  const room = useLiveKitRoom();
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
    room?.disconnect();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Main video area */}
      <div className="flex-1 relative">
        <GridLayout tracks={tracks} style={{ height: 'calc(100vh - 200px)' }}>
          <ParticipantLoop participants={room?.remoteParticipants}>
            {(participant) => (
              <ParticipantTile
                key={participant.sid}
                participant={participant}
                className="bg-gray-800 rounded-lg"
              />
            )}
          </ParticipantLoop>
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

const JoinRoomForm = ({ onJoinRoom }: { onJoinRoom: (roomData: RoomData) => void }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [roomName, setRoomName] = useState('interview-room');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!user || !roomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(LIVEKIT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: user.id,
          name: user.fullName || user.firstName || 'User',
          room: roomName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get room token');
      }

      const data = await response.json();
      
      onJoinRoom({
        token: data.token,
        wsUrl: data.wsUrl,
        roomName: roomName
      });

      toast({
        title: "Joining Interview",
        description: "Connecting to the interview room...",
      });
    } catch (error) {
      console.error('Error joining room:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the interview room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Join Interview</h2>
            <p className="text-gray-600">Enter the interview room to start your AI-powered interview session</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Room Name</label>
              <Input
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                className="w-full"
              />
            </div>
            
            <Button
              onClick={handleJoinRoom}
              disabled={isLoading || !roomName.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Connecting..." : "Join Interview"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InterviewSimulation = () => {
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleJoinRoom = (data: RoomData) => {
    setRoomData(data);
  };

  const handleDisconnected = () => {
    setRoomData(null);
    setIsConnected(false);
  };

  return (
    <AppLayout>
      <div className="h-full">
        {!roomData ? (
          <div className="container mx-auto py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Interview Practice</h1>
              <p className="text-gray-600">Practice your interview skills with our AI-powered system</p>
            </div>
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
