
import { SignUp } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-[#080f1d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-sm mb-8 hover:underline text-white/80">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Create Account</h1>
          <p className="text-white/60">Sign up to get started with ResumeAI</p>
        </div>
        
        <div className="bg-[#0f172a] rounded-xl border border-white/10 shadow-xl p-6 backdrop-blur-sm">
          <SignUp 
            routing="path" 
            path="/signup"
            signInUrl="/signin"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                formButtonPrimary: "bg-[#9b87f5] hover:bg-[#7c65da] text-white font-medium transition-colors shadow-md",
                socialButtonsBlockButton: "border border-white/20 bg-[#0f172a] hover:bg-[#1a2234] text-white transition-colors",
                footerAction: "text-sm text-white/60",
                formFieldLabel: "text-sm font-medium text-white/80",
                formFieldInput: "bg-[#1a2234] border-white/10 text-white rounded-md h-11",
                identityPreviewText: "text-white/80",
                identityPreviewEditButton: "text-[#9b87f5] hover:text-[#7c65da]",
                formFieldAction: "text-[#9b87f5] hover:text-[#7c65da]",
                formFieldSuccessText: "text-green-400",
                dividerText: "text-white/40",
                dividerLine: "bg-white/10",
                formFieldErrorText: "text-red-400",
                logoBox: "hidden",
                header: "hidden",
              },
              layout: {
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
