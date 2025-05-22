
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import AppLayout from "@/components/layout/AppLayout";
import ResumeTemplateCard from "@/components/resume/ResumeTemplateCard";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { resetResume, setTemplateStyle } from "@/store/resumeSlice";

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  style: string;
}

const ResumeNew = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const templates: ResumeTemplate[] = [
    {
      id: "minimalist-clean",
      name: "Minimalist Clean",
      description: "Clean and minimal design with a focus on content",
      thumbnail: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Minimal", "Clean", "Simple"],
      style: "minimalist",
    },
    {
      id: "professional-modern",
      name: "Professional Modern",
      description: "Contemporary design for professionals with subtle accents",
      thumbnail: "https://images.unsplash.com/photo-1507209575474-fa61e9d3086b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Professional", "Modern", "Corporate"],
      style: "professional",
    },
    {
      id: "tech-focused",
      name: "Tech Focused",
      description: "Modern design for tech professionals with clean layout",
      thumbnail: "https://images.unsplash.com/photo-1554224311-beee415c201f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Tech", "Modern", "IT"],
      style: "tech",
    },
    {
      id: "elegant-serif",
      name: "Elegant Serif",
      description: "Sophisticated design with serif fonts for a traditional look",
      thumbnail: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlc3VtZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
      tags: ["Elegant", "Traditional", "Executive"],
      style: "elegant",
    },
    {
      id: "creative-portfolio",
      name: "Creative Portfolio",
      description: "Bold and creative design for showcasing creative work",
      thumbnail: "https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      tags: ["Creative", "Portfolio", "Design"],
      style: "creative",
    },
    {
      id: "academic-cv",
      name: "Academic CV",
      description: "Comprehensive layout for academic professionals",
      thumbnail: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      tags: ["Academic", "Research", "CV"],
      style: "academic",
    },
    {
      id: "classic-professional",
      name: "Classic Professional",
      description: "Timeless professional design with traditional layout",
      thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      tags: ["Classic", "Professional", "Traditional"],
      style: "classic",
    },
    {
      id: "modern-timeline",
      name: "Modern Timeline",
      description: "Contemporary design with timeline elements",
      thumbnail: "https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdW1lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      tags: ["Modern", "Timeline", "Visual"],
      style: "timeline",
    },
  ];

  const categories = {
    all: "All Templates",
    professional: "Professional",
    creative: "Creative",
    minimal: "Minimal",
    modern: "Modern",
    academic: "Academic",
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
    // Find the selected template to get its style
    const template = templates.find(t => t.id === id);
    if (template) {
      // Store the template style for later use
      console.log(`Selected template style: ${template.style}`);
    }
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

    // Reset the resume state to start fresh
    dispatch(resetResume());
    
    // Set the template style in the Redux store
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      dispatch(setTemplateStyle(template.style));
    }
    
    // Generate a unique ID for the new resume
    const newResumeId = Date.now().toString();
    
    // Navigate to the resume editor with the new ID
    navigate(`/dashboard/resumes/${newResumeId}`);
  };

  const filterTemplates = (category: string) => {
    let filtered = templates;
    
    // Filter by category
    if (category !== "all") {
      filtered = templates.filter(template => 
        template.tags.some(tag => 
          tag.toLowerCase() === category.toLowerCase()
        )
      );
    }
    
    // Filter by search term if present
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(term) || 
        template.description.toLowerCase().includes(term) ||
        template.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                Select a professional template to get started with your resume.
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <TabsList className="mb-4">
              {Object.entries(categories).map(([key, value]) => (
                <TabsTrigger key={key} value={key}>
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {Object.keys(categories).map((category) => {
            const filteredTemplates = filterTemplates(category);
            return (
              <TabsContent key={category} value={category}>
                {filteredTemplates.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No templates found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                      <ResumeTemplateCard
                        key={template.id}
                        {...template}
                        selected={selectedTemplate === template.id}
                        onSelect={handleSelectTemplate}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleContinue}
            size="lg"
            disabled={!selectedTemplate}
            className="px-6"
          >
            Continue with Selected Template
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeNew;
