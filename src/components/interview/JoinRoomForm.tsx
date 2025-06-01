
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";

// API endpoint for getting LiveKit tokens
const LIVEKIT_API_URL = "http://localhost:3001/api/livekit";

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

export default JoinRoomForm;
