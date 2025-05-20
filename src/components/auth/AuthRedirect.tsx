
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Authentication Required",
      description: "You need to be signed in to access this page.",
      variant: "destructive"
    });
    
    navigate("/signin", { replace: true });
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-primary">Redirecting to sign in...</div>
    </div>
  );
};

export default AuthRedirect;
