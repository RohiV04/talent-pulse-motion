
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/use-toast';
import { extractResumeData, extractTextFromFile, ParsedResumeData } from '@/services/resume-parser';
import { 
  updatePersonalInfo, 
  updateSummary, 
  addExperience, 
  addEducation, 
  addSkill, 
  addProject,
  resetResume 
} from '@/store/resumeSlice';

export const useResumeImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const importResume = async (file: File) => {
    setIsImporting(true);
    
    try {
      toast({
        title: "Processing Resume",
        description: "Extracting text from your resume file...",
      });

      // Extract text from file
      const resumeText = await extractTextFromFile(file);
      
      toast({
        title: "Analyzing Resume",
        description: "AI is parsing your resume content...",
      });

      // Parse resume data using Gemini function calling
      const parsedData = await extractResumeData(resumeText);
      
      toast({
        title: "Populating Fields",
        description: "Filling in your resume data...",
      });

      // Clear existing resume data
      dispatch(resetResume());

      // Update personal info
      dispatch(updatePersonalInfo(parsedData.personalInfo));

      // Update summary
      if (parsedData.summary) {
        dispatch(updateSummary(parsedData.summary));
      }

      // Add experience entries
      parsedData.experience?.forEach((exp) => {
        dispatch(addExperience({
          id: Date.now().toString() + Math.random(),
          ...exp
        }));
      });

      // Add education entries
      parsedData.education?.forEach((edu) => {
        dispatch(addEducation({
          id: Date.now().toString() + Math.random(),
          ...edu
        }));
      });

      // Add skills
      parsedData.skills?.forEach((skill) => {
        dispatch(addSkill({
          id: Date.now().toString() + Math.random(),
          ...skill
        }));
      });

      // Add projects
      parsedData.projects?.forEach((project) => {
        dispatch(addProject({
          id: Date.now().toString() + Math.random(),
          ...project
        }));
      });

      toast({
        title: "Resume Imported Successfully!",
        description: "Your resume data has been populated. Please review and edit as needed.",
      });

    } catch (error) {
      console.error('Error importing resume:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importResume,
    isImporting
  };
};
