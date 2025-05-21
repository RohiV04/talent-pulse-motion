
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, MessageSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { generateDescription } from '@/services/ai-generator';

// ATS score page to analyze resume against job descriptions
const ResumeAtsScore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const resume = useSelector((state: any) => state.resume);
  
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | {
    score: number;
    feedback: {
      category: string;
      score: number;
      suggestions: string[];
      strongPoints: string[];
    }[];
    matchedKeywords: string[];
    missingKeywords: string[];
    improvementSuggestions: string;
  }>(null);
  
  // Function to analyze resume against job description
  const analyzeResume = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Missing job description",
        description: "Please enter a job description to analyze your resume against.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Prepare resume data for analysis
      const resumeData = {
        personalInfo: resume.personalInfo,
        summary: resume.summary,
        experiences: resume.experiences,
        education: resume.education,
        skills: resume.skills,
      };
      
      // Generate prompt for AI
      const prompt = `
        Analyze this resume against the job description:
        
        RESUME:
        ${JSON.stringify(resumeData)}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        Provide an ATS score from 0-100, with feedback on keyword matching, 
        content relevance, formatting, and specific improvement suggestions.
        Format your response as JSON with the following structure:
        {
          "score": number,
          "feedback": [
            {
              "category": string,
              "score": number,
              "suggestions": string[],
              "strongPoints": string[]
            }
          ],
          "matchedKeywords": string[],
          "missingKeywords": string[],
          "improvementSuggestions": string
        }
      `;
      
      // Using the Gemini API through our service
      const response = await generateDescription({
        resumeSection: "custom",
        currentText: prompt,
        model: "gemini"
      });
      
      // Parse the response
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}') + 1;
      const jsonStr = response.substring(jsonStart, jsonEnd);
      const result = JSON.parse(jsonStr);
      
      setAnalysisResult(result);
      
      toast({
        title: "Analysis complete",
        description: `Your resume scored ${result.score} out of 100.`
      });
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/dashboard/resumes/${id}`)} 
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">Resume ATS Analysis</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Job description input and actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste a job description to analyze your resume against it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Paste job description here..." 
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={analyzeResume} 
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right column: Analysis results */}
          <div className="space-y-6">
            {analysisResult ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      ATS Score Analysis
                    </span>
                    <span className="text-3xl font-bold">
                      {analysisResult.score}/100
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Here's how your resume performs for this job
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score visualization */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ATS Compatibility</span>
                      <span className="font-medium">{analysisResult.score}%</span>
                    </div>
                    <Progress value={analysisResult.score} className="h-2" />
                  </div>
                  
                  <Tabs defaultValue="feedback">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="feedback">Feedback</TabsTrigger>
                      <TabsTrigger value="keywords">Keywords</TabsTrigger>
                      <TabsTrigger value="improve">Improve</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="feedback" className="mt-0">
                      <Accordion type="single" collapsible className="w-full">
                        {analysisResult.feedback.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="flex justify-between items-center">
                              <span>{item.category}</span>
                              <span className="mr-4 text-sm font-medium">
                                {item.score}/100
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              {item.strongPoints.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2 text-green-500">Strong Points:</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {item.strongPoints.map((point, i) => (
                                      <li key={i} className="text-sm">{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {item.suggestions.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2 text-amber-500">Suggestions:</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {item.suggestions.map((suggestion, i) => (
                                      <li key={i} className="text-sm">{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                    
                    <TabsContent value="keywords" className="mt-0 space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-green-500">Matched Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matchedKeywords.map((keyword, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-amber-500">Missing Keywords:</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingKeywords.map((keyword, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 text-xs rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="improve" className="mt-0">
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <p className="text-sm whitespace-pre-line">{analysisResult.improvementSuggestions}</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex flex-col justify-center items-center p-12 text-center text-muted-foreground border-dashed">
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="max-w-sm">
                  Enter a job description and click "Analyze Resume" to get detailed feedback and ATS compatibility score.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeAtsScore;
