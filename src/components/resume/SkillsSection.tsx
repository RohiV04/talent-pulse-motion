
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addSkill, removeSkill, Skill } from '@/store/resumeSlice';
import { Trash2 } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateId } from '@/hooks/useResumeItem';

const SkillsSection = () => {
  const dispatch = useDispatch();
  const skills = useSelector((state: RootState) => state.resume.skills);
  const [newSkill, setNewSkill] = useState('');

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
            {skills.map((skill) => (
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
  );
};

export default SkillsSection;
