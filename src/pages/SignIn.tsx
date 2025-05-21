
import { SignIn } from "@clerk/clerk-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080f1d] to-[#101b2d] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-sm mb-8 hover:underline text-white/80 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Sign In</h1>
          <p className="text-white/70">Welcome back! Please sign in to continue</p>
        </div>
        
        <div className="bg-[#0f172a]/60 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl p-6">
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
                formButtonPrimary: "bg-[#9b87f5] hover:bg-[#7c65da] text-white font-medium transition-colors shadow-md",
                socialButtonsBlockButton: "border border-white/20 bg-[#0f172a]/80 hover:bg-[#1a2234] text-white transition-colors",
                footerAction: "text-sm text-white/70",
                formFieldLabel: "text-sm font-medium text-white/80",
                formFieldInput: "bg-[#1a2234]/80 border-white/10 text-white rounded-md h-11",
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

export default SignInPage;
