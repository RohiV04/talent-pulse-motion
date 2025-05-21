
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
import { Plus, Download, ArrowLeft, Trash2 } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
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
  Experience,
  Education,
  Skill
} from '@/store/resumeSlice';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  
  const resume = useSelector((state: RootState) => state.resume);
  const [newSkill, setNewSkill] = useState('');

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
            
            <Button onClick={generatePDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
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
                    <Label>Summary</Label>
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
                          <Label>Description</Label>
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
                          <Label>Description</Label>
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
          <div className="bg-white rounded-xl border shadow-sm p-8 min-h-[1100px] relative">
            <h2 className="text-lg font-semibold sticky top-0 bg-card p-2 rounded z-10">
              Live Preview
            </h2>
            
            <div ref={resumePreviewRef} className="pt-4">
              {/* Resume Header */}
              <div className="text-center mb-6 border-b pb-6">
                <h1 className="text-3xl font-bold text-resume-dark-gray">
                  {resume.personalInfo.fullName || 'Your Name'}
                </h1>
                <p className="text-xl text-resume-gray mt-1">
                  {resume.personalInfo.title || 'Professional Title'}
                </p>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-sm text-resume-gray">
                  {resume.personalInfo.email && (
                    <span>{resume.personalInfo.email}</span>
                  )}
                  {resume.personalInfo.phone && (
                    <span>{resume.personalInfo.phone}</span>
                  )}
                  {resume.personalInfo.location && (
                    <span>{resume.personalInfo.location}</span>
                  )}
                  {resume.personalInfo.website && (
                    <span>{resume.personalInfo.website}</span>
                  )}
                  {resume.personalInfo.linkedin && (
                    <span>{resume.personalInfo.linkedin}</span>
                  )}
                </div>
              </div>
              
              {/* Summary Section */}
              {resume.summary && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-resume-dark-purple border-b border-resume-gray pb-1 mb-3">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: resume.summary }} />
                </div>
              )}
              
              {/* Experience Section */}
              {resume.experience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-resume-dark-purple border-b border-resume-gray pb-1 mb-3">
                    EXPERIENCE
                  </h2>
                  
                  <div className="space-y-4">
                    {resume.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">{exp.title || 'Position Title'}</h3>
                          <div className="text-sm text-resume-gray">
                            {exp.startDate && exp.endDate ? 
                              `${new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - ${new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : 
                              'Present'
                            }
                          </div>
                        </div>
                        
                        <div className="text-resume-gray">
                          {[exp.company, exp.location].filter(Boolean).join(', ')}
                        </div>
                        
                        <div className="text-sm prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: exp.description }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Education Section */}
              {resume.education.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-resume-dark-purple border-b border-resume-gray pb-1 mb-3">
                    EDUCATION
                  </h2>
                  
                  <div className="space-y-4">
                    {resume.education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                          <div className="text-sm text-resume-gray">
                            {edu.graduationDate ? 
                              new Date(edu.graduationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 
                              ''
                            }
                          </div>
                        </div>
                        
                        <div className="text-resume-gray">
                          {[edu.school, edu.location].filter(Boolean).join(', ')}
                        </div>
                        
                        {edu.description && (
                          <div className="text-sm prose max-w-none mt-2" dangerouslySetInnerHTML={{ __html: edu.description }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Skills Section */}
              {resume.skills.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-resume-dark-purple border-b border-resume-gray pb-1 mb-3">
                    SKILLS
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill) => (
                      <span 
                        key={skill.id} 
                        className="bg-resume-soft-purple text-resume-dark-purple px-3 py-1 rounded-full text-sm"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeEditor;
