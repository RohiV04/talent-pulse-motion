
import { useRef, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button';
import { Sparkle } from 'lucide-react';
import { useAIGenerator } from '@/services/ai-generator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resumeSection?: 'summary' | 'experience' | 'education' | string;
  jobTitle?: string;
  fieldContext?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start writing...',
  resumeSection,
  jobTitle,
  fieldContext
}: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null);
  const { generateWithAI } = useAIGenerator();
  const { toast } = useToast();
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // Toolbar options
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean'],
    ]
  };

  // Apply custom styles for dark mode
  useEffect(() => {
    // Dynamically inject styles to handle dark mode
    document.head.querySelectorAll('[data-quill-dark-styles]').forEach(el => el.remove());

    const style = document.createElement('style');
    style.setAttribute('data-quill-dark-styles', 'true');
    style.textContent = `
      .dark .ql-toolbar {
        border-color: hsl(var(--border));
        background-color: hsl(var(--secondary));
      }
      
      .dark .ql-container {
        border-color: hsl(var(--border));
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
      }
      
      .dark .ql-toolbar button,
      .dark .ql-toolbar .ql-picker {
        color: hsl(var(--foreground));
      }
      
      .dark .ql-toolbar button:hover,
      .dark .ql-toolbar button.ql-active,
      .dark .ql-toolbar .ql-picker:hover .ql-picker-label,
      .dark .ql-toolbar .ql-picker.ql-expanded .ql-picker-label {
        color: hsl(var(--primary));
      }
      
      .dark .ql-toolbar button:hover .ql-stroke,
      .dark .ql-toolbar button.ql-active .ql-stroke,
      .dark .ql-toolbar .ql-picker:hover .ql-stroke,
      .dark .ql-toolbar .ql-picker.ql-expanded .ql-stroke {
        stroke: hsl(var(--primary));
      }
      
      .dark .ql-toolbar button:hover .ql-fill,
      .dark .ql-toolbar button.ql-active .ql-fill,
      .dark .ql-toolbar .ql-picker:hover .ql-fill,
      .dark .ql-toolbar .ql-picker.ql-expanded .ql-fill {
        fill: hsl(var(--primary));
      }
      
      .dark .ql-stroke {
        stroke: hsl(var(--foreground));
      }
      
      .dark .ql-fill {
        fill: hsl(var(--foreground));
      }
      
      .dark .ql-picker-options {
        background-color: hsl(var(--secondary));
        border-color: hsl(var(--border));
      }
      
      .dark .ql-picker-item {
        color: hsl(var(--foreground));
      }
      
      .dark .ql-editor.ql-blank::before {
        color: hsl(var(--muted-foreground));
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Generate content using AI
  const handleGenerateContent = async () => {
    if (!resumeSection) {
      toast({
        title: "Cannot generate content",
        description: "Resume section not specified",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingContent(true);
    
    try {
      const result = await generateWithAI({
        resumeSection,
        jobTitle: jobTitle || '',
        fieldContext: fieldContext || '',
        currentText: value,
      });
      
      if (result) {
        setGeneratedContent(result);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Apply generated content
  const applyGeneratedContent = () => {
    if (generatedContent) {
      onChange(generatedContent);
      setIsDialogOpen(false);
      setGeneratedContent(null);
    }
  };

  return (
    <div className="rich-text-editor">
      <div className="flex items-center justify-between mb-2">
        <div className="h-6">
          {/* Optional label or other UI elements can go here */}
        </div>
        {resumeSection && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5"
            onClick={handleGenerateContent}
            disabled={isGeneratingContent}
          >
            <Sparkle className="h-4 w-4" />
            {isGeneratingContent ? "Generating..." : "Generate with AI"}
          </Button>
        )}
      </div>
      
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className="min-h-[150px]"
      />
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Generated Content</DialogTitle>
          </DialogHeader>
          
          <div className="border rounded-md p-4 my-4 prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: generatedContent || '' }} />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyGeneratedContent}>
              Use This Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RichTextEditor;
