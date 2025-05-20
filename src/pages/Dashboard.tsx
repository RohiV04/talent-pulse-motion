
import { useState } from "react";
import { FileText, Book, Briefcase, PlusCircle, Video } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import ResumeProgressCard from "@/components/dashboard/ResumeProgressCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (action: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (action === "create") {
        navigate("/dashboard/resumes/new");
      } else if (action === "jobs") {
        navigate("/dashboard/jobs");
      } else if (action === "interview") {
        navigate("/dashboard/interview");
      } else {
        toast({
          title: "Action Triggered",
          description: `${action} action would happen here.`,
        });
      }
    }, 500);
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName || 'there'}!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your resume progress and career development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResumeProgressCard 
            title="Latest Resume ATS Score" 
            progress={78} 
            maxScore={100} 
          />
          <DashboardMetricCard
            title="Resumes Created"
            value="3"
            description="Total resumes"
            icon={<FileText className="h-4 w-4" />}
          />
          <DashboardMetricCard
            title="Interview Practice"
            value="2"
            description="Sessions completed"
            icon={<Video className="h-4 w-4" />}
            variant="purple"
          />
          <DashboardMetricCard
            title="Job Matches"
            value="12"
            description="New this week"
            icon={<Briefcase className="h-4 w-4" />}
            trend="up"
            trendValue="+5 from last week"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Button variant="outline" size="sm" onClick={() => handleAction("more")} disabled={isLoading}>
              {isLoading ? "Loading..." : "View All"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Create New Resume"
              description="Start building a professional resume with our templates."
              icon={<PlusCircle className="h-4 w-4" />}
              buttonText="Create Resume"
              onClick={() => handleAction("create")}
            />
            <QuickActionCard
              title="Practice Interview"
              description="Prepare for your next interview with AI coaching."
              icon={<Video className="h-4 w-4" />}
              buttonText="Start Practice"
              onClick={() => handleAction("interview")}
            />
            <QuickActionCard
              title="Browse Jobs"
              description="Discover job openings matched to your skills and experience."
              icon={<Briefcase className="h-4 w-4" />}
              buttonText="View Jobs"
              onClick={() => handleAction("jobs")}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Resumes</h2>
            <Button variant="outline" size="sm" onClick={() => handleAction("viewResumes")} disabled={isLoading}>
              {isLoading ? "Loading..." : "View All"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Software Developer Resume",
                lastUpdated: "Updated 2 days ago",
                atsScore: 85,
              },
              {
                title: "Product Manager Resume",
                lastUpdated: "Updated 1 week ago",
                atsScore: 75,
              },
              {
                title: "Marketing Specialist Resume",
                lastUpdated: "Updated 2 weeks ago",
                atsScore: 80,
              },
            ].map((resume, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleAction("edit")}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{resume.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {resume.lastUpdated}
                    </p>
                  </div>
                  <div className="bg-secondary rounded-full px-2 py-1">
                    <span className="text-xs font-medium">
                      ATS: {resume.atsScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
