
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatDate } from '@/lib/utils';

interface ResumeTemplateProps {
  componentRef: React.RefObject<HTMLDivElement>;
}

const ResumeTemplates: React.FC<ResumeTemplateProps> = ({ componentRef }) => {
  const resume = useSelector((state: RootState) => state.resume);
  const { templateStyle } = resume;

  // Format date function
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return formatDate(new Date(dateString), { month: 'short', year: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  // Professional template
  const ProfessionalTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-serif">
      <header className="text-center mb-6 pb-6 border-b-2 border-resume-gray">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">{resume.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl text-resume-dark-gray">{resume.personalInfo.title || 'Professional Title'}</p>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-sm">
          {resume.personalInfo.email && (
            <span className="flex items-center"><span className="font-bold mr-1">Email:</span> {resume.personalInfo.email}</span>
          )}
          {resume.personalInfo.phone && (
            <span className="flex items-center"><span className="font-bold mr-1">Phone:</span> {resume.personalInfo.phone}</span>
          )}
          {resume.personalInfo.location && (
            <span className="flex items-center"><span className="font-bold mr-1">Location:</span> {resume.personalInfo.location}</span>
          )}
          {resume.personalInfo.website && (
            <span className="flex items-center"><span className="font-bold mr-1">Website:</span> {resume.personalInfo.website}</span>
          )}
          {resume.personalInfo.linkedin && (
            <span className="flex items-center"><span className="font-bold mr-1">LinkedIn:</span> {resume.personalInfo.linkedin}</span>
          )}
        </div>
      </header>
      
      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-resume-gray pb-1 mb-3 uppercase">Professional Summary</h2>
          <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-resume-gray pb-1 mb-3 uppercase">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold">{exp.title || 'Position Title'}</h3>
                  <div className="text-sm text-resume-gray">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                <p className="font-semibold">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                <div className="text-sm mt-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-resume-gray pb-1 mb-3 uppercase">Projects</h2>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <div key={project.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold">{project.title}</h3>
                  <div className="text-sm text-resume-gray">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                {project.link && <p className="text-sm italic">{project.link}</p>}
                <p className="text-sm mt-1">{project.technologies}</p>
                <div className="text-sm mt-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-resume-gray pb-1 mb-3 uppercase">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                  <div className="text-sm text-resume-gray">
                    {edu.graduationDate ? formatDisplayDate(edu.graduationDate) : ''}
                  </div>
                </div>
                <p className="font-semibold">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.description && (
                  <div className="text-sm mt-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold border-b border-resume-gray pb-1 mb-3 uppercase">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="bg-resume-light-gray px-3 py-1 rounded-sm text-sm">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Minimalist template
  const MinimalistTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{resume.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl text-resume-gray">{resume.personalInfo.title || 'Professional Title'}</p>
        
        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-resume-gray">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
          {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
        </div>
      </header>
      
      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider text-resume-gray mb-2">Summary</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider text-resume-gray mb-2">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex flex-wrap justify-between items-baseline">
                  <h3 className="font-bold text-lg">{exp.title || 'Position Title'}</h3>
                  <div className="text-sm text-resume-gray">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                <p className="text-resume-gray mb-2">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider text-resume-gray mb-2">Projects</h2>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex flex-wrap justify-between items-baseline">
                  <h3 className="font-bold">{project.title}</h3>
                  <div className="text-sm text-resume-gray">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                {project.link && <p className="text-sm text-resume-blue">{project.link}</p>}
                <p className="text-sm italic text-resume-gray mb-1">{project.technologies}</p>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-md font-bold uppercase tracking-wider text-resume-gray mb-2">Education</h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex flex-wrap justify-between items-baseline">
                  <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                  <div className="text-sm text-resume-gray">
                    {edu.graduationDate ? formatDisplayDate(edu.graduationDate) : ''}
                  </div>
                </div>
                <p className="text-resume-gray mb-1">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.description && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-md font-bold uppercase tracking-wider text-resume-gray mb-2">Skills</h2>
          <div className="flex flex-wrap gap-x-2 gap-y-2">
            {resume.skills.map((skill) => (
              <span key={skill.id}>
                {skill.name}{resume.skills.indexOf(skill) < resume.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Technical template
  const TechTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-mono">
      <header className="mb-6 border-b-2 border-resume-dark-gray pb-4">
        <h1 className="text-2xl font-bold tracking-tight">{resume.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-resume-gray">{resume.personalInfo.title || 'Professional Title'}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2 text-sm">
          {resume.personalInfo.email && (
            <div><span className="text-resume-dark-gray">Email:</span> {resume.personalInfo.email}</div>
          )}
          {resume.personalInfo.phone && (
            <div><span className="text-resume-dark-gray">Phone:</span> {resume.personalInfo.phone}</div>
          )}
          {resume.personalInfo.location && (
            <div><span className="text-resume-dark-gray">Location:</span> {resume.personalInfo.location}</div>
          )}
          {resume.personalInfo.website && (
            <div><span className="text-resume-dark-gray">Web:</span> {resume.personalInfo.website}</div>
          )}
          {resume.personalInfo.linkedin && (
            <div><span className="text-resume-dark-gray">LinkedIn:</span> {resume.personalInfo.linkedin}</div>
          )}
        </div>
      </header>

      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-md font-bold bg-resume-dark-gray text-white p-1 mb-2">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="bg-resume-light-gray border border-resume-gray px-2 py-0.5 text-sm rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
      
      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-md font-bold bg-resume-dark-gray text-white p-1 mb-2">SUMMARY</h2>
          <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-md font-bold bg-resume-dark-gray text-white p-1 mb-2">EXPERIENCE</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between flex-wrap">
                  <h3 className="font-bold">{exp.title || 'Position Title'}</h3>
                  <div className="text-sm font-mono">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                <p className="font-semibold text-resume-dark-gray">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                <div className="text-sm mt-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-md font-bold bg-resume-dark-gray text-white p-1 mb-2">PROJECTS</h2>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <div key={project.id} className="mb-3">
                <div className="flex justify-between flex-wrap">
                  <h3 className="font-bold">{project.title}</h3>
                  <div className="text-sm">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : ''}
                  </div>
                </div>
                {project.link && <p className="text-sm text-blue-600">{project.link}</p>}
                <p className="text-sm italic text-resume-dark-gray">{project.technologies}</p>
                <div className="text-sm mt-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section>
          <h2 className="text-md font-bold bg-resume-dark-gray text-white p-1 mb-2">EDUCATION</h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between flex-wrap">
                  <h3 className="font-bold">{edu.degree || 'Degree'}</h3>
                  <div className="text-sm">
                    {edu.graduationDate ? formatDisplayDate(edu.graduationDate) : ''}
                  </div>
                </div>
                <p className="text-resume-dark-gray">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
                {edu.description && (
                  <div className="text-sm mt-1 prose max-w-none" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Elegant template
  const ElegantTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-serif">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-light mb-2 tracking-wide">{resume.personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-xl font-light text-resume-dark-gray italic">{resume.personalInfo.title || 'Professional Title'}</p>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-3 text-sm text-resume-gray">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>|</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>|</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
        {(resume.personalInfo.website || resume.personalInfo.linkedin) && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-1 text-sm text-resume-gray">
            {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
            {resume.personalInfo.website && resume.personalInfo.linkedin && <span>|</span>}
            {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
          </div>
        )}
      </header>
      
      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-3 tracking-wider">PROFESSIONAL SUMMARY</h2>
          <div className="text-sm prose max-w-none text-center" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-3 tracking-wider">EXPERIENCE</h2>
          <div className="space-y-5">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="font-semibold text-center">{exp.title || 'Position Title'}</h3>
                <p className="text-center italic mb-2">
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  {exp.startDate && exp.endDate
                    ? ` • ${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                    : ''}
                </p>
                <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-3 tracking-wider">PROJECTS</h2>
          <div className="space-y-5">
            {resume.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="font-semibold text-center">{project.title}</h3>
                <p className="text-center italic mb-1">
                  {project.technologies}
                  {project.startDate && project.endDate
                    ? ` • ${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                    : ''}
                </p>
                {project.link && <p className="text-center text-resume-dark-gray mb-2">{project.link}</p>}
                <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-center mb-3 tracking-wider">EDUCATION</h2>
          <div className="space-y-5">
            {resume.education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <h3 className="font-semibold text-center">{edu.degree || 'Degree'}</h3>
                <p className="text-center italic mb-2">
                  {edu.school}{edu.location ? `, ${edu.location}` : ''}
                  {edu.graduationDate ? ` • ${formatDisplayDate(edu.graduationDate)}` : ''}
                </p>
                {edu.description && (
                  <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-center mb-3 tracking-wider">SKILLS</h2>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-center">
            {resume.skills.map((skill, index) => (
              <span key={skill.id}>
                {skill.name}{index < resume.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Creative template
  const CreativeTemplate = () => (
    <div className="bg-white text-black min-h-[1100px] max-w-[800px] mx-auto flex">
      {/* Left sidebar */}
      <div className="w-1/3 bg-resume-dark-purple text-white p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-1">{resume.personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-sm">{resume.personalInfo.title || 'Professional Title'}</p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">Contact</h2>
          <div className="space-y-2 text-sm">
            {resume.personalInfo.email && <div>{resume.personalInfo.email}</div>}
            {resume.personalInfo.phone && <div>{resume.personalInfo.phone}</div>}
            {resume.personalInfo.location && <div>{resume.personalInfo.location}</div>}
            {resume.personalInfo.website && <div>{resume.personalInfo.website}</div>}
            {resume.personalInfo.linkedin && <div>{resume.personalInfo.linkedin}</div>}
          </div>
        </div>
        
        {resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">Skills</h2>
            <div className="space-y-1">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="text-sm">
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {resume.education.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3 border-b border-white/30 pb-1">Education</h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="font-bold text-sm">{edu.degree || 'Degree'}</h3>
                  <p className="text-xs">{edu.school}</p>
                  {edu.graduationDate && (
                    <p className="text-xs opacity-80">{formatDisplayDate(edu.graduationDate)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="w-2/3 p-6">
        {resume.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-resume-dark-purple mb-2">Professional Summary</h2>
            <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: resume.summary }} />
          </section>
        )}
        
        {resume.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-resume-dark-purple mb-3">Experience</h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="mb-4 relative pl-4 border-l-2 border-resume-purple">
                  <h3 className="font-bold">{exp.title || 'Position Title'}</h3>
                  <p className="text-sm text-resume-dark-gray">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  <p className="text-xs mb-2">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </p>
                  <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-resume-dark-purple mb-3">Projects</h2>
            <div className="space-y-4">
              {resume.projects.map((project) => (
                <div key={project.id} className="mb-4 relative pl-4 border-l-2 border-resume-purple">
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-xs mb-1">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : ''}
                  </p>
                  <p className="text-sm text-resume-purple mb-1">{project.technologies}</p>
                  {project.link && <p className="text-xs mb-2">{project.link}</p>}
                  <div className="text-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  // Return the appropriate template based on the templateStyle
  const renderTemplate = () => {
    switch (templateStyle) {
      case 'professional':
        return <ProfessionalTemplate />;
      case 'minimalist':
        return <MinimalistTemplate />;
      case 'tech':
        return <TechTemplate />;
      case 'elegant':
        return <ElegantTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      default:
        return <ProfessionalTemplate />;
    }
  };

  return <div ref={componentRef}>{renderTemplate()}</div>;
};

export default ResumeTemplates;
