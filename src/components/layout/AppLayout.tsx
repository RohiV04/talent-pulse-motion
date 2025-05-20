
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import ThemeToggle from "../ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status - this would use a real auth system
    // Currently just simulate with session storage
    const checkAuth = async () => {
      // Simulate API call
      setTimeout(() => {
        if (window.location.pathname.includes("dashboard")) {
          setIsAuthenticated(true); // For demo purposes
        }
        setIsLoading(false);
      }, 500);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && window.location.pathname.includes("dashboard")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to access this page</p>
        </div>
        <Button onClick={() => navigate("/")} className="px-8">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAuthenticated && <AppSidebar />}
        <div className="flex-1">
          <header className="h-14 border-b px-4 flex items-center justify-between">
            <div className="flex items-center">
              {isAuthenticated && <SidebarTrigger />}
              <h1 className="text-xl font-bold ml-2">ResumeAI</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Add missing Button import
import { Button } from "../ui/button";

export default AppLayout;
