
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import AppLayout from '@/components/layout/AppLayout';
import {
  Accordion
} from '@/components/ui/accordion';
import ResumeTemplates from '@/components/resume/ResumeTemplates';
import PersonalInfoSection from '@/components/resume/PersonalInfoSection';
import SummarySection from '@/components/resume/SummarySection';
import ExperienceSection from '@/components/resume/ExperienceSection';
import ProjectsSection from '@/components/resume/ProjectsSection';
import EducationSection from '@/components/resume/EducationSection';
import SkillsSection from '@/components/resume/SkillsSection';
import ResumeActionBar from '@/components/resume/ResumeActionBar';

const ResumeEditor = () => {
  const { id } = useParams();
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const resumeFullName = useSelector((state: RootState) => state.resume.personalInfo.fullName);
  
  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
        <div className="lg:w-1/2 space-y-6">
          <ResumeActionBar 
            id={id} 
            resumePreviewRef={resumePreviewRef} 
            resumeFullName={resumeFullName}
          />

          <div className="space-y-6 p-6 bg-card border rounded-xl shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              <PersonalInfoSection />
              <SummarySection />
              <ExperienceSection />
              <ProjectsSection />
              <EducationSection />
              <SkillsSection />
            </Accordion>
          </div>
        </div>
        
        {/* Resume Preview */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[700px] max-h-[900px] overflow-y-auto">
            <div className="sticky top-0 bg-white p-2 rounded z-10 flex justify-between items-center border-b mb-4">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <span className="text-xs text-muted-foreground">
                PDF export will be properly formatted
              </span>
            </div>
            
            {/* Scale down the preview for better visibility */}
            <div className="transform scale-75 origin-top-left w-[133.33%]">
              <ResumeTemplates componentRef={resumePreviewRef} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeEditor;
