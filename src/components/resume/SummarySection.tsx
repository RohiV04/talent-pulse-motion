
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateSummary } from '@/store/resumeSlice';
import { Sparkles } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/resume/RichTextEditor';
import { useAIGenerator } from '@/services/ai-generator';
import { useState } from 'react';

const SummarySection = () => {
  const dispatch = useDispatch();
  const summary = useSelector((state: RootState) => state.resume.summary);
  const jobTitle = useSelector((state: RootState) => state.resume.personalInfo.title);
  const { generateWithAI } = useAIGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI content for summary
  const generateSummaryWithAI = async () => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "summary",
        jobTitle,
        currentText: summary
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

  return (
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
            value={summary}
            onChange={(value) => dispatch(updateSummary(value))}
            placeholder="Write a professional summary..."
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SummarySection;
