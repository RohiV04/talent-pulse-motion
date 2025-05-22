
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  addEducation,
  updateEducation, 
  removeEducation,
  Education 
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
import { useState } from 'react';

const EducationItem = ({ education }: { education: Education }) => {
  const dispatch = useDispatch();
  const { generateWithAI } = useAIGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI content for education
  const generateEducationWithAI = async () => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "education",
        jobTitle: education.degree,
        fieldContext: education.school,
        currentText: education.description
      });
      
      if (generatedText) {
        dispatch(updateEducation({ 
          id: education.id, 
          data: { description: generatedText } 
        }));
      }
    } catch (error) {
      console.error("Error generating education:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Education</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => dispatch(removeEducation(education.id))}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Degree</Label>
          <Input 
            value={education.degree}
            onChange={(e) => dispatch(updateEducation({ 
              id: education.id, 
              data: { degree: e.target.value } 
            }))}
            placeholder="Bachelor of Science in Computer Science"
          />
        </div>
        <div className="space-y-2">
          <Label>School</Label>
          <Input 
            value={education.school}
            onChange={(e) => dispatch(updateEducation({ 
              id: education.id, 
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
            value={education.location}
            onChange={(e) => dispatch(updateEducation({ 
              id: education.id, 
              data: { location: e.target.value } 
            }))}
            placeholder="City, State"
          />
        </div>
        <div className="space-y-2">
          <Label>Graduation Date</Label>
          <Input 
            type="date"
            value={education.graduationDate}
            onChange={(e) => dispatch(updateEducation({ 
              id: education.id, 
              data: { graduationDate: e.target.value } 
            }))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Description</Label>
          <Button 
            onClick={generateEducationWithAI}
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
          value={education.description}
          onChange={(value) => dispatch(updateEducation({ 
            id: education.id, 
            data: { description: value } 
          }))}
          placeholder="Describe your studies, achievements, etc."
        />
      </div>
    </div>
  );
};

const EducationSection = () => {
  const dispatch = useDispatch();
  const educations = useSelector((state: RootState) => state.resume.education);

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

  return (
    <AccordionItem value="education">
      <AccordionTrigger>Education</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-4">
          {educations.map((education) => (
            <EducationItem key={education.id} education={education} />
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
  );
};

export default EducationSection;
