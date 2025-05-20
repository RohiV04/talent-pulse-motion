
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import AuthForm from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDemo = () => {
    toast({
      title: "Demo Mode Activated",
      description: "Redirecting you to the dashboard in demo mode.",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">ResumeAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="outline" onClick={handleDemo}>Demo</Button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-8 py-8">
        <div className="flex flex-col justify-center animate-fade-in order-2 lg:order-1">
          <h2 className="text-4xl font-bold tracking-tight">Build Standout Resumes with AI</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Create professional resumes with our AI-powered platform. Get real-time ATS scoring,
            personalized suggestions, and land more interviews.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button onClick={() => handleDemo()} size="lg">
              Try Demo
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              Learn More
            </Button>
          </div>

          <div className="mt-16">
            <h3 className="text-xl font-semibold mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "AI-Powered Resume Builder",
                  description: "Get intelligent suggestions to improve your resume"
                },
                {
                  title: "ATS Compatibility",
                  description: "Ensure your resume gets past applicant tracking systems"
                },
                {
                  title: "Professional Templates",
                  description: "Choose from a variety of modern, recruiter-approved designs"
                },
                {
                  title: "Interview Simulation",
                  description: "Practice interviews with our AI coach"
                }
              ].map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card hover:shadow-md transition-all">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-md">
            <AuthForm />
          </div>
        </div>
      </main>

      <footer className="border-t py-6 px-4 lg:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground story-link">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground story-link">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground story-link">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
