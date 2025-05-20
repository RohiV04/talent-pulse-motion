
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { SignIn, SignUp, useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ArrowRight, Check, FileText, User, Video } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      // If user is signed in, show welcome back toast
      toast({
        title: `Welcome back, ${user?.firstName || 'there'}!`,
        description: "Great to see you again.",
      });
    }
  }, [isSignedIn, user, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">ResumeAI</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <SignedIn>
            <Button onClick={() => navigate("/dashboard")} variant="default">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </SignedIn>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 lg:px-8 bg-gradient-to-br from-background via-background to-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Your Career Journey, <span className="text-primary">Amplified by AI</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Create standout resumes, practice interviews with AI, and discover perfect job matches all in one platform.
                </p>
                
                <div className="space-y-3 pt-4">
                  {[
                    "AI-powered resume builder with ATS optimization",
                    "Interactive interview simulations with feedback",
                    "Personalized job recommendations and tracking"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-2 bg-primary/10 p-1 rounded-full text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <SignedOut>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button onClick={() => document.getElementById('sign-up')?.scrollIntoView({ behavior: 'smooth' })} size="lg">
                      Get Started Free
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
                      Try Demo
                    </Button>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="pt-4">
                    <Button onClick={() => navigate("/dashboard")} size="lg">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </SignedIn>
              </div>
              
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border shadow-xl p-1">
                <img 
                  src="/placeholder.svg" 
                  alt="ResumeAI Platform" 
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 lg:px-8 bg-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Everything You Need to Land Your Dream Job</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive suite of tools helps you at every step of your career journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Resume Builder",
                  description: "Create professional, ATS-optimized resumes with our intelligent assistant",
                  icon: FileText
                },
                {
                  title: "Interview Simulation",
                  description: "Practice with our AI interviewer and get real-time feedback on your responses",
                  icon: Video
                },
                {
                  title: "Job Board & Tracking",
                  description: "Find relevant job openings and track your applications all in one place",
                  icon: User
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-md border flex flex-col hover-scale">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">{feature.description}</p>
                  <Button variant="ghost" className="mt-4 self-start" onClick={() => navigate("/dashboard")}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Auth Section */}
        <SignedOut>
          <section id="sign-up" className="py-16 px-4 lg:px-8">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Get Started Today</h2>
                <p className="text-muted-foreground">Create your account to unlock all features</p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center gap-8 items-start">
                <div className="w-full md:w-1/2 max-w-md">
                  <div className="bg-card rounded-xl border shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6 text-center">Sign In</h3>
                    <SignIn 
                      routing="path" 
                      path="/"
                      signUpUrl="/"
                      afterSignInUrl="/dashboard"
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 max-w-md">
                  <div className="bg-card rounded-xl border shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-6 text-center">Sign Up</h3>
                    <SignUp 
                      routing="path" 
                      path="/"
                      signInUrl="/"
                      afterSignUpUrl="/dashboard"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SignedOut>
      </main>

      <footer className="border-t py-8 px-4 lg:px-8 bg-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ResumeAI</h3>
              <p className="text-sm text-muted-foreground">
                Your AI-powered career companion helping you land your dream job.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {["Blog", "Career Tips", "Resume Templates", "Interview Guides"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground story-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Contact", "Privacy", "Terms"].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-muted-foreground story-link">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ResumeAI. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {["Twitter", "LinkedIn", "Facebook"].map((social, i) => (
                <a key={i} href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
