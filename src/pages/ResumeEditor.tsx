
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/resume/RichTextEditor';
import ResumeTemplates from '@/components/resume/ResumeTemplates';
import { Plus, Download, ArrowLeft, Trash2, Sparkles, FileText } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useAIGenerator } from '@/services/ai-generator';
import {
  updatePersonalInfo,
  updateSummary,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  Experience,
  Education,
  Skill,
  Project
} from '@/store/resumeSlice';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const { generateWithAI } = useAIGenerator();
  
  const resume = useSelector((state: RootState) => state.resume);
  const [newSkill, setNewSkill] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Handle PDF generation
  const generatePDF = async () => {
    if (!resumePreviewRef.current) return;
    
    try {
      const canvas = await html2canvas(resumePreviewRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`resume-${resume.personalInfo.fullName || 'untitled'}.pdf`);
      
      toast({
        title: "PDF Generated!",
        description: "Your resume has been downloaded as a PDF file.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Navigate to ATS Score page
  const navigateToAtsScore = () => {
    navigate(`/dashboard/resumes/${id}/ats`);
  };

  // Add new experience
  const addNewExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    dispatch(addExperience(newExperience));
  };

  // Add new education
  const addNewEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      description: ''
    };
    dispatch(addEducation(newEducation));
  };

  // Add new project
  const addNewProject = () => {
    const newProject: Project = {
      id: generateId(),
      title: '',
      description: '',
      technologies: '',
      link: '',
      startDate: '',
      endDate: ''
    };
    dispatch(addProject(newProject));
  };

  // Add new skill
  const addNewSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      id: generateId(),
      name: newSkill.trim()
    };
    
    dispatch(addSkill(skill));
    setNewSkill('');
  };

  // Generate AI content for summary
  const generateSummaryWithAI = async () => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "summary",
        jobTitle: resume.personalInfo.title,
        currentText: resume.summary
      });
      
      if (generatedText) {
        dispatch(updateSummary(generatedText));
      }
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI content for experience
  const generateExperienceWithAI = async (id: string, title: string, company: string, description: string) => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "experience",
        jobTitle: title,
        fieldContext: company,
        currentText: description
      });
      
      if (generatedText) {
        dispatch(updateExperience({ 
          id, 
          data: { description: generatedText } 
        }));
      }
    } catch (error) {
      console.error("Error generating experience:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI content for education
  const generateEducationWithAI = async (id: string, degree: string, school: string, description: string) => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "education",
        jobTitle: degree,
        fieldContext: school,
        currentText: description
      });
      
      if (generatedText) {
        dispatch(updateEducation({ 
          id, 
          data: { description: generatedText } 
        }));
      }
    } catch (error) {
      console.error("Error generating education:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI content for projects
  const generateProjectWithAI = async (id: string, title: string, technologies: string, description: string) => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "project",
        jobTitle: title,
        fieldContext: technologies,
        currentText: description
      });
      
      if (generatedText) {
        dispatch(updateProject({ 
          id, 
          data: { description: generatedText } 
        }));
      }
    } catch (error) {
      console.error("Error generating project description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
        <div className="lg:w-1/2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="text-2xl font-bold">Resume Editor</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={navigateToAtsScore}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                ATS Score
              </Button>
              <Button onClick={generatePDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export as PDF
              </Button>
            </div>
          </div>

          <div className="space-y-6 p-6 bg-card border rounded-xl shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {/* Personal Information Section */}
              <AccordionItem value="personal-info">
                <AccordionTrigger>Personal Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={resume.personalInfo.fullName}
                          onChange={(e) => dispatch(updatePersonalInfo({ fullName: e.target.value }))}
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Professional Title</Label>
                        <Input 
                          id="title" 
                          value={resume.personalInfo.title}
                          onChange={(e) => dispatch(updatePersonalInfo({ title: e.target.value }))}
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={resume.personalInfo.email}
                          onChange={(e) => dispatch(updatePersonalInfo({ email: e.target.value }))}
                          placeholder="johndoe@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone"
                          value={resume.personalInfo.phone}
                          onChange={(e) => dispatch(updatePersonalInfo({ phone: e.target.value }))}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        value={resume.personalInfo.location}
                        onChange={(e) => dispatch(updatePersonalInfo({ location: e.target.value }))}
                        placeholder="City, State, Country"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website"
                          value={resume.personalInfo.website}
                          onChange={(e) => dispatch(updatePersonalInfo({ website: e.target.value }))}
                          placeholder="www.johndoe.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin"
                          value={resume.personalInfo.linkedin}
                          onChange={(e) => dispatch(updatePersonalInfo({ linkedin: e.target.value }))}
                          placeholder="linkedin.com/in/johndoe"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Professional Summary Section */}
              <AccordionItem value="summary">
                <AccordionTrigger>Professional Summary</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <Label>Summary</Label>
                      <Button 
                        onClick={generateSummaryWithAI}
                        variant="outline"
                        size="sm"
                        disabled={isGenerating}
                        className="flex items-center gap-1"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate with AI
                      </Button>
                    </div>
                    <RichTextEditor 
                      value={resume.summary}
                      onChange={(value) => dispatch(updateSummary(value))}
                      placeholder="Write a professional summary..."
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Experience Section */}
              <AccordionItem value="experience">
                <AccordionTrigger>Work Experience</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    {resume.experience.map((exp) => (
                      <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Work Experience</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => dispatch(removeExperience(exp.id))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input 
                              value={exp.title}
                              onChange={(e) => dispatch(updateExperience({ 
                                id: exp.id, 
                                data: { title: e.target.value } 
                              }))}
                              placeholder="Senior Developer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input 
                              value={exp.company}
                              onChange={(e) => dispatch(updateExperience({ 
                                id: exp.id, 
                                data: { company: e.target.value } 
                              }))}
                              placeholder="Company Name"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input 
                              value={exp.location}
                              onChange={(e) => dispatch(updateExperience({ 
                                id: exp.id, 
                                data: { location: e.target.value } 
                              }))}
                              placeholder="City, State"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input 
                              type="date"
                              value={exp.startDate}
                              onChange={(e) => dispatch(updateExperience({ 
                                id: exp.id, 
                                data: { startDate: e.target.value } 
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input 
                              type="date"
                              value={exp.endDate}
                              onChange={(e) => dispatch(updateExperience({ 
                                id: exp.id, 
                                data: { endDate: e.target.value } 
                              }))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Description</Label>
                            <Button 
                              onClick={() => generateExperienceWithAI(exp.id, exp.title, exp.company, exp.description)}
                              variant="outline"
                              size="sm"
                              disabled={isGenerating}
                              className="flex items-center gap-1"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Generate with AI
                            </Button>
                          </div>
                          <RichTextEditor 
                            value={exp.description}
                            onChange={(value) => dispatch(updateExperience({ 
                              id: exp.id, 
                              data: { description: value } 
                            }))}
                            placeholder="Describe your role and achievements..."
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                      onClick={addNewExperience}
                    >
                      <Plus className="h-4 w-4" />
                      Add Experience
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Projects Section */}
              <AccordionItem value="projects">
                <AccordionTrigger>Projects</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    {resume.projects.map((project) => (
                      <div key={project.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Project</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => dispatch(removeProject(project.id))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Project Title</Label>
                            <Input 
                              value={project.title}
                              onChange={(e) => dispatch(updateProject({ 
                                id: project.id, 
                                data: { title: e.target.value } 
                              }))}
                              placeholder="Project Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Technologies Used</Label>
                            <Input 
                              value={project.technologies}
                              onChange={(e) => dispatch(updateProject({ 
                                id: project.id, 
                                data: { technologies: e.target.value } 
                              }))}
                              placeholder="React, Node.js, MongoDB"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Project Link</Label>
                          <Input 
                            value={project.link}
                            onChange={(e) => dispatch(updateProject({ 
                              id: project.id, 
                              data: { link: e.target.value } 
                            }))}
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input 
                              type="date"
                              value={project.startDate}
                              onChange={(e) => dispatch(updateProject({ 
                                id: project.id, 
                                data: { startDate: e.target.value } 
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input 
                              type="date"
                              value={project.endDate}
                              onChange={(e) => dispatch(updateProject({ 
                                id: project.id, 
                                data: { endDate: e.target.value } 
                              }))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Description</Label>
                            <Button 
                              onClick={() => generateProjectWithAI(project.id, project.title, project.technologies, project.description)}
                              variant="outline"
                              size="sm"
                              disabled={isGenerating}
                              className="flex items-center gap-1"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Generate with AI
                            </Button>
                          </div>
                          <RichTextEditor 
                            value={project.description}
                            onChange={(value) => dispatch(updateProject({ 
                              id: project.id, 
                              data: { description: value } 
                            }))}
                            placeholder="Describe the project, your role, and achievements..."
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                      onClick={addNewProject}
                    >
                      <Plus className="h-4 w-4" />
                      Add Project
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Education Section */}
              <AccordionItem value="education">
                <AccordionTrigger>Education</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-4">
                    {resume.education.map((edu) => (
                      <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">Education</h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => dispatch(removeEducation(edu.id))}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input 
                              value={edu.degree}
                              onChange={(e) => dispatch(updateEducation({ 
                                id: edu.id, 
                                data: { degree: e.target.value } 
                              }))}
                              placeholder="Bachelor of Science in Computer Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>School</Label>
                            <Input 
                              value={edu.school}
                              onChange={(e) => dispatch(updateEducation({ 
                                id: edu.id, 
                                data: { school: e.target.value } 
                              }))}
                              placeholder="University Name"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input 
                              value={edu.location}
                              onChange={(e) => dispatch(updateEducation({ 
                                id: edu.id, 
                                data: { location: e.target.value } 
                              }))}
                              placeholder="City, State"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Graduation Date</Label>
                            <Input 
                              type="date"
                              value={edu.graduationDate}
                              onChange={(e) => dispatch(updateEducation({ 
                                id: edu.id, 
                                data: { graduationDate: e.target.value } 
                              }))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Description</Label>
                            <Button 
                              onClick={() => generateEducationWithAI(edu.id, edu.degree, edu.school, edu.description)}
                              variant="outline"
                              size="sm"
                              disabled={isGenerating}
                              className="flex items-center gap-1"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              Generate with AI
                            </Button>
                          </div>
                          <RichTextEditor 
                            value={edu.description}
                            onChange={(value) => dispatch(updateEducation({ 
                              id: edu.id, 
                              data: { description: value } 
                            }))}
                            placeholder="Describe your studies, achievements, etc."
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                      onClick={addNewEducation}
                    >
                      <Plus className="h-4 w-4" />
                      Add Education
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Skills Section */}
              <AccordionItem value="skills">
                <AccordionTrigger>Skills</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g. JavaScript)"
                        onKeyPress={(e) => e.key === 'Enter' && addNewSkill()}
                      />
                      <Button onClick={addNewSkill}>Add</Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {resume.skills.map((skill) => (
                        <div 
                          key={skill.id} 
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          {skill.name}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 p-0"
                            onClick={() => dispatch(removeSkill(skill.id))}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* Resume Preview */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl border shadow-sm p-2 min-h-[1100px] max-h-[800px] overflow-y-auto relative">
            <h2 className="text-lg font-semibold sticky top-0 bg-card p-2 rounded z-10">
              Live Preview
            </h2>
            
            <ResumeTemplates componentRef={resumePreviewRef} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeEditor;
