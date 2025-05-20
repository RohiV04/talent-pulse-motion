
import { SignIn } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-sm mb-8 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign In</h1>
          <p className="text-muted-foreground">Welcome back! Please sign in to continue</p>
        </div>
        
        <div className="bg-card rounded-xl border shadow-md p-6">
          <SignIn 
            routing="path" 
            path="/signin"
            signUpUrl="/signup"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                socialButtonsBlockButton: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                footerAction: "text-sm text-muted-foreground",
                formFieldLabel: "text-sm font-medium",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
