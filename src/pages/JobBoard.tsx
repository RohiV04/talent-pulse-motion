
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Search, Clock, BookmarkIcon, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  category: string;
  description: string;
  salary?: string;
}

const JobBoard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const jobListings: JobListing[] = [
    {
      id: "1",
      title: "Senior Product Designer",
      company: "Acme Design Co.",
      location: "Los Angeles, California USA",
      type: "Full Time / Contract",
      postedDate: "2 months ago",
      category: "Design",
      description: "Looking for an experienced product designer to join our growing team."
    },
    {
      id: "2",
      title: "Head of Design",
      company: "Creative Solutions",
      location: "Savannah, Georgia USA",
      type: "Full Time / Contract",
      postedDate: "2 months ago",
      category: "Design",
      description: "Lead our design team and set the visual direction for our products."
    },
    {
      id: "3",
      title: "Lead UX Researcher",
      company: "UX Insights",
      location: "Los Angeles, California USA",
      type: "Full Time / Contract",
      postedDate: "2 months ago",
      category: "Design",
      description: "Conduct user research and usability testing to inform product decisions."
    },
    {
      id: "4",
      title: "Frontend Developer",
      company: "TechStart Inc.",
      location: "Remote",
      type: "Full Time",
      postedDate: "1 month ago",
      category: "Development",
      description: "Build responsive and accessible web applications using React and TypeScript.",
      salary: "$90,000 - $120,000"
    },
    {
      id: "5",
      title: "UI/UX Designer",
      company: "Digital Crafters",
      location: "New York, NY USA",
      type: "Full Time",
      postedDate: "2 weeks ago",
      category: "Design",
      description: "Create beautiful and intuitive user interfaces for our products.",
      salary: "$85,000 - $110,000"
    }
  ];

  const categories = Array.from(new Set(jobListings.map(job => job.category)));

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSaveJob = (jobId: string) => {
    toast({
      title: "Job Saved",
      description: "This job has been added to your saved jobs."
    });
  };

  const handleApply = (jobId: string) => {
    toast({
      title: "Application Started",
      description: "You've started the application process for this job."
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl py-6 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Job Board</h1>
            <p className="text-muted-foreground">Find and apply to jobs that match your skills and experience.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <BookmarkIcon className="mr-2 h-4 w-4" /> Saved Jobs
            </Button>
            <Button size="sm">
              <ExternalLink className="mr-2 h-4 w-4" /> Import from LinkedIn
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4">Filters</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Job title or keyword..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant={selectedCategory === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      >
                        All
                      </Badge>
                      {categories.map(category => (
                        <Badge 
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Button variant="outline" className="w-full" onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                    }}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredJobs.length} jobs
                  </p>
                  
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Posted {job.postedDate}
                              </p>
                              <h3 className="text-xl font-semibold">{job.title}</h3>
                              <p className="text-muted-foreground">{job.company}</p>
                            </div>

                            <Badge variant="secondary" className="self-start px-3 py-1">
                              {job.category}
                            </Badge>
                          </div>

                          <p className="text-sm">{job.description}</p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            {job.salary && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {job.salary}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-2">
                            <Button 
                              onClick={() => handleApply(job.id)}
                              className="flex-1 sm:flex-none"
                            >
                              Apply Now
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleSaveJob(job.id)}
                              className="flex-1 sm:flex-none"
                            >
                              <BookmarkIcon className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}

              <div className="mt-8 p-6 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Can't find the right role?</h3>
                <p className="text-muted-foreground mb-4">Email your resume to be considered for new positions in the future.</p>
                <div className="flex flex-wrap gap-3">
                  <Input placeholder="Enter your email..." className="flex-1" />
                  <Button>Email Resume</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default JobBoard;
