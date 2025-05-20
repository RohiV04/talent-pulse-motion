
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ResumeNew from "./pages/ResumeNew";
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
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            } />
            <Route path="/dashboard/resumes/new" element={
              <SignedIn>
                <ResumeNew />
              </SignedIn>
            } />
            <Route path="/dashboard/jobs" element={
              <SignedIn>
                <JobBoard />
              </SignedIn>
            } />
            <Route path="/dashboard/interview" element={
              <SignedIn>
                <InterviewSimulation />
              </SignedIn>
            } />
            
            {/* Redirect if trying to access protected routes while signed out */}
            <Route path="/dashboard/*" element={
              <SignedOut>
                <AuthRedirect />
              </SignedOut>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ClerkLoaded>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
