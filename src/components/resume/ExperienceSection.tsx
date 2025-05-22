
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  addExperience, 
  updateExperience, 
  removeExperience,
  Experience 
} from '@/store/resumeSlice';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/resume/RichTextEditor';
import { useAIGenerator } from '@/services/ai-generator';
import { generateId } from '@/hooks/useResumeItem';

const ExperienceItem = ({ experience }: { experience: Experience }) => {
  const dispatch = useDispatch();
  const { generateWithAI } = useAIGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI content for experience
  const generateExperienceWithAI = async () => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "experience",
        jobTitle: experience.title,
        fieldContext: experience.company,
        currentText: experience.description
      });
      
      if (generatedText) {
        dispatch(updateExperience({ 
          id: experience.id, 
          data: { description: generatedText } 
        }));
      }
    } catch (error) {
      console.error("Error generating experience:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Work Experience</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => dispatch(removeExperience(experience.id))}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Job Title</Label>
          <Input 
            value={experience.title}
            onChange={(e) => dispatch(updateExperience({ 
              id: experience.id, 
              data: { title: e.target.value } 
            }))}
            placeholder="Senior Developer"
          />
        </div>
        <div className="space-y-2">
          <Label>Company</Label>
          <Input 
            value={experience.company}
            onChange={(e) => dispatch(updateExperience({ 
              id: experience.id, 
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
            value={experience.location}
            onChange={(e) => dispatch(updateExperience({ 
              id: experience.id, 
              data: { location: e.target.value } 
            }))}
            placeholder="City, State"
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            type="date"
            value={experience.startDate}
            onChange={(e) => dispatch(updateExperience({ 
              id: experience.id, 
              data: { startDate: e.target.value } 
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input 
            type="date"
            value={experience.endDate}
            onChange={(e) => dispatch(updateExperience({ 
              id: experience.id, 
              data: { endDate: e.target.value } 
            }))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Description</Label>
          <Button 
            onClick={generateExperienceWithAI}
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
          value={experience.description}
          onChange={(value) => dispatch(updateExperience({ 
            id: experience.id, 
            data: { description: value } 
          }))}
          placeholder="Describe your role and achievements..."
        />
      </div>
    </div>
  );
};

const ExperienceSection = () => {
  const dispatch = useDispatch();
  const experiences = useSelector((state: RootState) => state.resume.experience);

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

  return (
    <AccordionItem value="experience">
      <AccordionTrigger>Work Experience</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-4">
          {experiences.map((experience) => (
            <ExperienceItem key={experience.id} experience={experience} />
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
  );
};

export default ExperienceSection;
