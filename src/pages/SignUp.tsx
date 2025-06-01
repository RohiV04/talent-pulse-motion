
import { SignUp } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080f1d] to-[#101b2d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-sm mb-8 hover:underline text-white/80 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Create Account</h1>
          <p className="text-white/70">Sign up to get started with ResumeAI</p>
        </div>
        
        <div className="bg-[#0f172a]/60 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl p-6">
          <SignUp 
            routing="path" 
            path="/signup"
            signInUrl="/signin"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
