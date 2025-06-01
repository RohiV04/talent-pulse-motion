
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";

interface RoomData {
  token: string;
  wsUrl: string;
  roomName: string;
}

interface JoinRoomFormProps {
  onJoinRoom: (roomData: RoomData) => void;
}

const JoinRoomForm = ({ onJoinRoom }: JoinRoomFormProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [roomName, setRoomName] = useState('interview-room');
  const [wsUrl, setWsUrl] = useState('wss://your-livekit-server.com');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async () => {
    if (!user || !roomName.trim() || !wsUrl.trim() || !token.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, use manual inputs - later this will be replaced with API call
      onJoinRoom({
        token: token,
        wsUrl: wsUrl,
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
            <p className="text-gray-600">Enter the interview room details to start your AI-powered interview session</p>
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

            <div>
              <label className="block text-sm font-medium mb-2">WebSocket URL</label>
              <Input
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                placeholder="wss://your-livekit-server.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Access Token</label>
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter LiveKit access token"
                className="w-full"
                type="password"
              />
            </div>
            
            <Button
              onClick={handleJoinRoom}
              disabled={isLoading || !roomName.trim() || !wsUrl.trim() || !token.trim()}
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

export default JoinRoomForm;
