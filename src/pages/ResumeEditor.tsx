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
          <div className="bg-white rounded-xl border shadow-sm p-2 min-h-[400px] max-h-[800px] overflow-y-auto relative">
            <h2 className="text-lg font-semibold sticky top-0 bg-card p-2 rounded z-10 flex justify-between items-center">
              <span>Live Preview</span>
              <span className="text-xs text-muted-foreground">
                Content will be properly formatted in the exported PDF
              </span>
            </h2>
            
            {/* Scale down the preview for better visibility but keep the full size for PDF export */}
            <div className="scale-[0.65] origin-top transform-gpu">
              <ResumeTemplates componentRef={resumePreviewRef} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResumeEditor;
