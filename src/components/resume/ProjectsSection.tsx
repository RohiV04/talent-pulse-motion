
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  addProject,
  updateProject, 
  removeProject,
  Project 
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

const ProjectItem = ({ project }: { project: Project }) => {
  const dispatch = useDispatch();
  const { generateWithAI } = useAIGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate AI content for projects
  const generateProjectWithAI = async () => {
    setIsGenerating(true);
    try {
      const generatedText = await generateWithAI({
        resumeSection: "project",
        jobTitle: project.title,
        fieldContext: project.technologies,
        currentText: project.description
      });
      
      if (generatedText) {
        dispatch(updateProject({ 
          id: project.id, 
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
    <div className="border rounded-lg p-4 space-y-4">
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
            onClick={generateProjectWithAI}
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
  );
};

const ProjectsSection = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state: RootState) => state.resume.projects);

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

  return (
    <AccordionItem value="projects">
      <AccordionTrigger>Projects</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-6 pt-4">
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
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
  );
};

export default ProjectsSection;
