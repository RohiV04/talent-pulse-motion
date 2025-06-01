import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ResumeNew from "./pages/ResumeNew";
import ResumeEditor from "./pages/ResumeEditor";
import ResumeAtsScore from "./pages/ResumeAtsScore";
import JobBoard from "./pages/JobBoard";
import InterviewSimulation from "./pages/InterviewSimulation";
import NotFound from "./pages/NotFound";
import AuthRedirect from "./components/auth/AuthRedirect";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClerkLoading>
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-pulse text-primary">Loading authentication...</div>
            </div>
          </ClerkLoading>
          
          <ClerkLoaded>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin/*" element={<SignInPage />} />
              <Route path="/signup/*" element={<SignUpPage />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard/*"
                element={
                  <SignedIn>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/resumes/new" element={<ResumeNew />} />
                      <Route path="/resumes/:id" element={<ResumeEditor />} />
                      <Route path="/resumes/:id/ats" element={<ResumeAtsScore />} />
                      <Route path="/jobs" element={<JobBoard />} />
                      <Route path="/interview" element={<InterviewSimulation />} />
                    </Routes>
                  </SignedIn>
                }
              />
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ClerkLoaded>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
