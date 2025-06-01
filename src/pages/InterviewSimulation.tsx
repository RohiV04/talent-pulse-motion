import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Video, Settings, User, MessageSquare, Headphones, HelpCircle, PauseCircle, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { LiveKitRoom, VideoConference, useRoomContext, VideoTrack, AudioTrack, ParticipantTile } from "@livekit/components-react";

interface InterviewQuestion {
  id: string;
  question: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  timeGuide: string;
}

interface Skill {
  name: string;
  score: number;
  color: string;
}

const LIVEKIT_TOKEN_URL = "http://127.0.0.1:5000/livekit/token"; // Replace with your backend endpoint

function AutoEnableMedia() {
  const room = useRoomContext();
  useEffect(() => {
    if (room) {
      // room.localParticipant.setCameraEnabled(true);
      // room.localParticipant.setMicrophoneEnabled(true);
      // room.localParticipant.setScreenShareEnabled(true);
    }
  }, [room]);
  return null;
}

const InterviewSimulation = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [isRecording, setIsRecording] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [interviewMode, setInterviewMode] = useState<"preparation" | "simulation" | "results">("preparation");
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [lkToken, setLkToken] = useState<string | null>(null);
  const [lkWsUrl, setLkWsUrl] = useState<string | null>(null);
  const [lkLoading, setLkLoading] = useState(false);

  const questions: InterviewQuestion[] = [
    {
      id: "q1",
      question: "Can you tell me about yourself and your background in design?",
      type: "Behavioral",
      difficulty: "easy",
      timeGuide: "2-3 minutes"
    },
    {
      id: "q2",
      question: "Describe a challenging design problem you've solved recently.",
      type: "Behavioral",
      difficulty: "medium",
      timeGuide: "3-4 minutes"
    },
    {
      id: "q3",
      question: "How do you approach user research for a new product?",
      type: "Technical",
      difficulty: "medium",
      timeGuide: "3-4 minutes"
    },
    {
      id: "q4",
      question: "What design tools are you most comfortable with, and why?",
      type: "Technical",
      difficulty: "easy",
      timeGuide: "2-3 minutes"
    },
    {
      id: "q5",
      question: "How do you handle feedback and criticism on your designs?",
      type: "Behavioral",
      difficulty: "hard",
      timeGuide: "3-4 minutes"
    }
  ];

  const skills: Skill[] = [
    { name: "Communication", score: 87, color: "bg-blue-500" },
    { name: "Technical Knowledge", score: 72, color: "bg-green-500" },
    { name: "Problem Solving", score: 91, color: "bg-purple-500" },
    { name: "Adaptability", score: 65, color: "bg-orange-500" },
    { name: "Leadership", score: 78, color: "bg-pink-500" },
    { name: "Collaboration", score: 82, color: "bg-cyan-500" },
  ];

  const handleStartInterview = () => {
    toast({
      title: "Interview Started",
      description: "Your AI-powered interview simulation has begun."
    });
    setInterviewMode("simulation");
  };

  const handleFinishInterview = () => {
    toast({
      title: "Interview Completed",
      description: "Your interview has been analyzed. View your results."
    });
    setInterviewMode("results");
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    
    toast({
      title: isRecording ? "Recording Paused" : "Recording Started",
      description: isRecording 
        ? "Your answer recording has been paused." 
        : "Speak clearly into your microphone.",
    });
  };

  const handleNextQuestion = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(activeQuestion + 1);
      setIsRecording(false);
      
      toast({
        title: "Next Question",
        description: "Moving to the next interview question."
      });
    } else {
      handleFinishInterview();
    }
  };

  // Camera test logic
  const handleTestCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: unknown) {
      setCameraError(err instanceof Error ? err.message : "Unable to access camera. Please check your permissions.");
    }
  };

  // Audio test logic
  const handleTestMicrophone = async () => {
    setAudioError(null);
    setAudioLevel(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      // Setup audio context and analyser
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      const audioContext = new ((window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as typeof AudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteTimeDomainData(dataArray);
        // Calculate RMS (root mean square) for volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        setAudioLevel(rms);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err: unknown) {
      setAudioError(err instanceof Error ? err.message : "Unable to access microphone. Please check your permissions.");
    }
  };

  // Clean up camera and audio streams on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraStream, audioStream]);

  // Fetch LiveKit token and wsUrl when entering simulation step
  useEffect(() => {
    if (interviewMode === "simulation" && user) {
      setLkLoading(true);
      fetch(LIVEKIT_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity: user.id,
          room: "my-room"
        }),
      })
        .then(res => res.json())
        .then(data => {
          setLkToken(data.token);
          setLkWsUrl(data.ws_url);
        })
        .finally(() => setLkLoading(false));
    }
  }, [interviewMode, user]);

  const renderPreparation = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <span>Video Test</span>
            </CardTitle>
            <CardDescription>Check your camera settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center overflow-hidden">
              {cameraStream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <Video className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Camera preview will appear here</p>
                </div>
              )}
            </div>
            <Button size="sm" variant="outline" className="mt-4" onClick={handleTestCamera}>
              Test Camera
            </Button>
            {cameraError && <p className="text-red-500 text-xs mt-2">{cameraError}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              <span>Audio Test</span>
            </CardTitle>
            <CardDescription>Check your microphone settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-32 bg-secondary/30 rounded-lg flex items-center justify-center">
                <div className="text-center w-full">
                  <Mic className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Speak to test your microphone</p>
                  <div className="flex justify-center mt-4">
                    <div className="w-40 h-4 bg-muted rounded-full overflow-hidden relative">
                      <div
                        className="h-4 bg-primary transition-all duration-200"
                        style={{ width: `${Math.min(audioLevel * 100 * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleTestMicrophone}>Test Microphone</Button>
              {audioError && <p className="text-red-500 text-xs mt-2">{audioError}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Interview Settings</span>
            </CardTitle>
            <CardDescription>Customize your interview experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Interview Type</span>
                </div>
                <span className="text-sm font-medium">UX/UI Designer</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Questions</span>
                </div>
                <span className="text-sm font-medium">{questions.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Audio Feedback</span>
                </div>
                <span className="text-sm font-medium">Enabled</span>
              </div>
              
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview Questions Preview</CardTitle>
          <CardDescription>
            Get familiar with the types of questions you'll be asked during this interview simulation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.slice(0, 3).map((q, index) => (
              <div key={q.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="font-medium">{q.question}</span>
                  </div>
                  <div>
                    <Badge variant="outline">{q.type}</Badge>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Difficulty: {q.difficulty}</span>
                  <span>Suggested time: {q.timeGuide}</span>
                </div>
              </div>
            ))}
            <div className="p-4 rounded-lg border border-dashed text-center">
              <p className="text-muted-foreground">+ {questions.length - 3} more questions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handleStartInterview}>
          Start Interview Simulation
        </Button>
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className="md:col-span-2 space-y-6">
        {/* LiveKit Video Conference */}
        {lkLoading ? (
          <div className="flex justify-center items-center h-64">Loading video conference...</div>
        ) : lkToken && lkWsUrl ? (
          <div className="mb-6">
            <LiveKitRoom token={lkToken} serverUrl={lkWsUrl} connect={true}>
              <AutoEnableMedia />
              <VideoConference />
            </LiveKitRoom>
          </div>
        ) : null}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <div className="text-center p-6">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={user?.imageUrl ?? ""} />
                  <AvatarFallback>{user?.firstName?.charAt(0) ?? "U"}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium mt-4">{user?.fullName ?? "User"}</h3>
                <p className="text-sm text-muted-foreground mt-1">Interview in Progress</p>
                
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    size="sm"
                    onClick={handleToggleRecording}
                  >
                    {isRecording ? (
                      <>
                        <PauseCircle className="mr-2 h-4 w-4" />
                        Pause Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Question</CardTitle>
              <div className="text-sm text-muted-foreground">
                Question {activeQuestion + 1} of {questions.length}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <h3 className="text-lg font-medium">{questions[activeQuestion].question}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <Badge variant="outline">{questions[activeQuestion].type}</Badge>
                  <span className="text-muted-foreground">
                    Suggested time: {questions[activeQuestion].timeGuide}
                  </span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${isRecording ? 'border-primary' : ''}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Your Answer</h4>
                  {isRecording && (
                    <span className="text-sm text-primary flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      Recording
                    </span>
                  )}
                </div>
                {isRecording ? (
                  <div className="h-20 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce"></div>
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:0.6s]"></div>
                      <div className="h-1 w-1 bg-primary rounded-full animate-bounce [animation-delay:0.8s]"></div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4">
                    {isRecording ? "Listening..." : "Click 'Start Recording' to begin your answer"}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" disabled={activeQuestion === 0}>
                  Previous Question
                </Button>
                <Button onClick={handleNextQuestion}>
                  {activeQuestion < questions.length - 1 ? (
                    <>Next Question <ChevronRight className="ml-2 h-4 w-4" /></>
                  ) : (
                    "Finish Interview"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Interview Progress</CardTitle>
            <CardDescription>Track your progress through the interview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Questions Completed</span>
                  <span>{activeQuestion}/{questions.length}</span>
                </div>
                <Progress value={(activeQuestion / questions.length) * 100} />
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-3">Question Overview</h4>
                <div className="space-y-2">
                  {questions.map((q, idx) => (
                    <div 
                      key={q.id} 
                      className={`
                        p-2 rounded-lg text-sm cursor-pointer transition-colors
                        ${idx === activeQuestion 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'}
                      `}
                      onClick={() => setActiveQuestion(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{q.question.length > 30 ? q.question.substring(0, 30) + '...' : q.question}</span>
                        {idx < activeQuestion && <Check className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>Interview Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                "Speak clearly and at a moderate pace",
                "Use specific examples from your experience",
                "Structure answers with situation, task, action, result",
                "It's okay to pause briefly to gather your thoughts"
              ].map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Interview Results</CardTitle>
          <CardDescription>
            AI-powered analysis of your interview performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Overall Performance</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Rating</span>
                    <span className="text-sm font-medium">83/100</span>
                  </div>
                  <Progress value={83} className="h-2.5" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Time Management</div>
                    <div className="text-2xl font-medium mt-1">92%</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Answer Quality</div>
                    <div className="text-2xl font-medium mt-1">78%</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Confidence</div>
                    <div className="text-2xl font-medium mt-1">85%</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">Clarity</div>
                    <div className="text-2xl font-medium mt-1">81%</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Skill Analysis</h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{skill.name}</span>
                      <span className="text-sm font-medium">{skill.score}/100</span>
                    </div>
                    <Progress value={skill.score} className={`h-2.5 ${skill.color}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Feedback Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Strengths</h4>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-sm">Excellent at providing specific examples to support answers</li>
                <li className="text-sm">Clear communication style with well-structured responses</li>
                <li className="text-sm">Demonstrated strong technical knowledge in design principles</li>
                <li className="text-sm">Maintained consistent eye contact and confident body language</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-medium text-amber-600 dark:text-amber-400 mb-2">Areas for Improvement</h4>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-sm">Some answers could be more concise and focused</li>
                <li className="text-sm">Occasionally used filler words that could be reduced</li>
                <li className="text-sm">Could provide more specific metrics when discussing project outcomes</li>
                <li className="text-sm">Consider expanding on leadership examples in future interviews</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">Tips for Next Interview</h4>
              <ul className="list-disc list-inside space-y-1">
                <li className="text-sm">Practice the STAR method (Situation, Task, Action, Result) for behavioral questions</li>
                <li className="text-sm">Research the company more deeply to connect your answers to their values</li>
                <li className="text-sm">Prepare 2-3 questions about their design process and team structure</li>
                <li className="text-sm">Expand your portfolio examples to include more collaborative projects</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline">
              Download Full Report
            </Button>
            <Button onClick={() => setInterviewMode("preparation")}>
              Start New Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Import missing components
  const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: "border border-input bg-background"
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
        {children}
      </span>
    );
  };
  
  const Check = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">AI Interview Simulation</h1>
            <p className="text-muted-foreground">Practice your interview skills with our AI-powered simulation</p>
          </div>
          
          <Tabs defaultValue={interviewMode} value={interviewMode} onValueChange={(value) => setInterviewMode(value as any)}>
            <TabsList>
              <TabsTrigger value="preparation" disabled={interviewMode === "simulation"}>
                Preparation
              </TabsTrigger>
              <TabsTrigger value="simulation" disabled={interviewMode === "preparation"}>
                Simulation
              </TabsTrigger>
              <TabsTrigger value="results" disabled={interviewMode !== "results"}>
                Results
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {interviewMode === "preparation" && renderPreparation()}
        {interviewMode === "simulation" && renderSimulation()}
        {interviewMode === "results" && renderResults()}
      </div>
    </AppLayout>
  );
};

export default InterviewSimulation;
