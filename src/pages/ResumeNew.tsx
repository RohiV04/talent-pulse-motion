
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import ResumeTemplateCard from "@/components/resume/ResumeTemplateCard";
import { useToast } from "@/hooks/use-toast";

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
}

const ResumeNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const templates: ResumeTemplate[] = [
    {
      id: "modern-1",
      name: "Modern Professional",
      description: "Clean and professional design with a modern touch",
      thumbnail: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Professional", "Modern", "Corporate"],
    },
    {
      id: "creative-1",
      name: "Creative Portfolio",
      description: "Showcase your creative work with this bold template",
      thumbnail: "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      tags: ["Creative", "Portfolio", "Design"],
    },
    {
      id: "minimal-1",
      name: "Minimalist",
      description: "Simple and clean design focused on content",
      thumbnail: "https://images.unsplash.com/photo-1507209575474-fa61e9d3086b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Minimal", "Clean", "Simple"],
    },
    {
      id: "executive-1",
      name: "Executive",
      description: "Sophisticated design for senior professionals",
      thumbnail: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Executive", "Professional", "Corporate"],
    },
    {
      id: "tech-1",
      name: "Tech Specialist",
      description: "Modern design for tech professionals",
      thumbnail: "https://images.unsplash.com/photo-1554224311-beee415c201f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Tech", "Modern", "IT"],
    },
    {
      id: "academic-1",
      name: "Academic CV",
      description: "Comprehensive layout for academic professionals",
      thumbnail: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      tags: ["Academic", "Research", "CV"],
    },
  ];

  const categories = {
    all: "All Templates",
    professional: "Professional",
    creative: "Creative",
    simple: "Simple",
    modern: "Modern",
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
  };

  const handleContinue = () => {
    if (!selectedTemplate) {
      toast({
        title: "Please select a template",
        description: "You need to select a template to continue.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Template selected!",
      description: "You'd now be taken to the resume editor.",
    });

    navigate("/dashboard");
  };

  const filterTemplates = (category: string) => {
    if (category === "all") return templates;
    
    return templates.filter(template => 
      template.tags.some(tag => 
        tag.toLowerCase() === category.toLowerCase()
      )
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Choose a Template</h1>
            <p className="text-muted-foreground">
              Select a template to get started with your resume.
            </p>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList>
              {Object.entries(categories).map(([key, value]) => (
                <TabsTrigger key={key} value={key}>
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(categories).map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterTemplates(category).map((template) => (
                  <ResumeTemplateCard
                    key={template.id}
                    {...template}
                    selected={selectedTemplate === template.id}
                    onSelect={handleSelectTemplate}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleContinue}
            size="lg"
            disabled={!selectedTemplate}
          >
            Continue with Selected Template
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeNew;
