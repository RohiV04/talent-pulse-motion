
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

  // Professional template - clean and readable
  const ProfessionalTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-serif leading-relaxed">
      <header className="text-center mb-8 pb-6 border-b-2 border-gray-300">
        <h1 className="text-4xl font-bold uppercase tracking-wide mb-3 text-gray-900">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {resume.personalInfo.email && (
            <span className="flex items-center">
              <strong className="mr-2">Email:</strong> {resume.personalInfo.email}
            </span>
          )}
          {resume.personalInfo.phone && (
            <span className="flex items-center">
              <strong className="mr-2">Phone:</strong> {resume.personalInfo.phone}
            </span>
          )}
          {resume.personalInfo.location && (
            <span className="flex items-center">
              <strong className="mr-2">Location:</strong> {resume.personalInfo.location}
            </span>
          )}
        </div>
        
        {(resume.personalInfo.website || resume.personalInfo.linkedin) && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
            {resume.personalInfo.website && (
              <span className="flex items-center">
                <strong className="mr-2">Website:</strong> {resume.personalInfo.website}
              </span>
            )}
            {resume.personalInfo.linkedin && (
              <span className="flex items-center">
                <strong className="mr-2">LinkedIn:</strong> {resume.personalInfo.linkedin}
              </span>
            )}
          </div>
        )}
      </header>
      
      {resume.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wide text-gray-900">
            Professional Summary
          </h2>
          <div className="text-sm leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wide text-gray-900">
            Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{exp.title || 'Position Title'}</h3>
                    <p className="font-semibold text-base text-gray-700">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 font-medium ml-4">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm leading-relaxed text-gray-800 mt-3" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wide text-gray-900">
            Projects
          </h2>
          <div className="space-y-6">
            {resume.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                    {project.technologies && (
                      <p className="text-sm italic text-gray-600 mt-1">{project.technologies}</p>
                    )}
                    {project.link && (
                      <p className="text-sm text-blue-600 mt-1">{project.link}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 font-medium ml-4">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : ''}
                  </div>
                </div>
                {project.description && (
                  <div className="text-sm leading-relaxed text-gray-800 mt-3" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wide text-gray-900">
            Education
          </h2>
          <div className="space-y-6">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{edu.degree || 'Degree'}</h3>
                    <p className="font-semibold text-base text-gray-700">
                      {edu.school}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 font-medium ml-4">
                    {edu.graduationDate ? formatDisplayDate(edu.graduationDate) : ''}
                  </div>
                </div>
                {edu.description && (
                  <div className="text-sm leading-relaxed text-gray-800 mt-3" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-2 mb-4 uppercase tracking-wide text-gray-900">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="bg-gray-100 border border-gray-300 px-4 py-2 rounded text-sm font-medium text-gray-800">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Minimalist template - clean and simple
  const MinimalistTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-sans leading-relaxed">
      <header className="mb-10">
        <h1 className="text-4xl font-light mb-3 text-gray-900 tracking-wide">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
          {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
          {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
        </div>
      </header>
      
      {resume.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Summary
          </h2>
          <div className="text-sm leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-gray-900">{exp.title || 'Position Title'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-sm leading-relaxed text-gray-700 mt-3" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Projects
          </h2>
          <div className="space-y-6">
            {resume.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-gray-900">{project.title}</h3>
                    {project.technologies && (
                      <p className="text-sm italic text-gray-600 mt-1">{project.technologies}</p>
                    )}
                    {project.link && (
                      <p className="text-sm text-blue-600 mt-1">{project.link}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : ''}
                  </div>
                </div>
                {project.description && (
                  <div className="text-sm leading-relaxed text-gray-700 mt-3" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Education
          </h2>
          <div className="space-y-6">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-gray-900">{edu.degree || 'Degree'}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {edu.school}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 ml-4">
                    {edu.graduationDate ? formatDisplayDate(edu.graduationDate) : ''}
                  </div>
                </div>
                {edu.description && (
                  <div className="text-sm leading-relaxed text-gray-700 mt-3" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {resume.skills.map((skill, index) => (
              <span key={skill.id} className="text-sm text-gray-800">
                {skill.name}{index < resume.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Technical template - compact and efficient
  const TechTemplate = () => (
    <div className="bg-white text-black p-6 min-h-[1100px] max-w-[800px] mx-auto font-mono text-sm leading-tight">
      <header className="mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-base text-gray-700 mb-3">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
          {resume.personalInfo.email && (
            <div><span className="text-gray-800 font-semibold">Email:</span> {resume.personalInfo.email}</div>
          )}
          {resume.personalInfo.phone && (
            <div><span className="text-gray-800 font-semibold">Phone:</span> {resume.personalInfo.phone}</div>
          )}
          {resume.personalInfo.location && (
            <div><span className="text-gray-800 font-semibold">Location:</span> {resume.personalInfo.location}</div>
          )}
          {resume.personalInfo.website && (
            <div><span className="text-gray-800 font-semibold">Web:</span> {resume.personalInfo.website}</div>
          )}
          {resume.personalInfo.linkedin && (
            <div><span className="text-gray-800 font-semibold">LinkedIn:</span> {resume.personalInfo.linkedin}</div>
          )}
        </div>
      </header>

      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold bg-gray-800 text-white p-2 mb-3 uppercase tracking-wide">SKILLS</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span key={skill.id} className="bg-gray-100 border border-gray-400 px-3 py-1 text-xs rounded font-medium">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
      
      {resume.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold bg-gray-800 text-white p-2 mb-3 uppercase tracking-wide">SUMMARY</h2>
          <div className="text-xs leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold bg-gray-800 text-white p-2 mb-3 uppercase tracking-wide">EXPERIENCE</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-900">{exp.title || 'Position Title'}</h3>
                    <p className="font-semibold text-xs text-gray-700">
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <div className="text-xs leading-relaxed text-gray-800 mt-2" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold bg-gray-800 text-white p-2 mb-3 uppercase tracking-wide">PROJECTS</h2>
          <div className="space-y-4">
            {resume.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-900">{project.title}</h3>
                    {project.technologies && (
                      <p className="text-xs italic text-gray-600">{project.technologies}</p>
                    )}
                    {project.link && (
                      <p className="text-xs text-blue-600">{project.link}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : ''}
                  </div>
                </div>
                {project.description && (
                  <div className="text-xs leading-relaxed text-gray-800 mt-2" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section>
          <h2 className="text-sm font-bold bg-gray-800 text-white p-2 mb-3 uppercase tracking-wide">EDUCATION</h2>
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-900">{edu.degree || 'Degree'}</h3>
                    <p className="text-xs text-gray-700">
                      {edu.school}{edu.location ? `, ${edu.location}` : ''}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {edu.graduationDate ? formatDisplayDate(edu.graduationDate) : ''}
                  </div>
                </div>
                {edu.description && (
                  <div className="text-xs leading-relaxed text-gray-800 mt-2" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Elegant template - sophisticated and centered
  const ElegantTemplate = () => (
    <div className="bg-white text-black p-8 min-h-[1100px] max-w-[800px] mx-auto font-serif leading-relaxed">
      <header className="text-center mb-10 border-b border-gray-300 pb-8">
        <h1 className="text-3xl font-light mb-3 tracking-wide text-gray-900">
          {resume.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-lg font-light text-gray-600 italic mb-6">
          {resume.personalInfo.title || 'Professional Title'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && resume.personalInfo.email && <span className="text-gray-400">|</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && (resume.personalInfo.email || resume.personalInfo.phone) && <span className="text-gray-400">|</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
        
        {(resume.personalInfo.website || resume.personalInfo.linkedin) && (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
            {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
            {resume.personalInfo.website && resume.personalInfo.linkedin && <span className="text-gray-400">|</span>}
            {resume.personalInfo.linkedin && <span>{resume.personalInfo.linkedin}</span>}
          </div>
        )}
      </header>
      
      {resume.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-center mb-4 tracking-wider uppercase text-gray-800">
            Professional Summary
          </h2>
          <div className="text-sm leading-relaxed text-gray-800 text-center max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: resume.summary }} />
        </section>
      )}
      
      {resume.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-center mb-6 tracking-wider uppercase text-gray-800">
            Experience
          </h2>
          <div className="space-y-6">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h3 className="font-semibold text-base text-gray-900 mb-1">{exp.title || 'Position Title'}</h3>
                <p className="text-sm italic text-gray-600 mb-2">
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  {exp.startDate && exp.endDate
                    ? ` • ${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                    : ''}
                </p>
                {exp.description && (
                  <div className="text-sm leading-relaxed text-gray-800 max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-center mb-6 tracking-wider uppercase text-gray-800">
            Projects
          </h2>
          <div className="space-y-6">
            {resume.projects.map((project) => (
              <div key={project.id} className="text-center">
                <h3 className="font-semibold text-base text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm italic text-gray-600 mb-2">
                  {project.technologies}
                  {project.startDate && project.endDate
                    ? ` • ${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                    : ''}
                </p>
                {project.link && (
                  <p className="text-sm text-gray-700 mb-2">{project.link}</p>
                )}
                {project.description && (
                  <div className="text-sm leading-relaxed text-gray-800 max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: project.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-center mb-6 tracking-wider uppercase text-gray-800">
            Education
          </h2>
          <div className="space-y-6">
            {resume.education.map((edu) => (
              <div key={edu.id} className="text-center">
                <h3 className="font-semibold text-base text-gray-900 mb-1">{edu.degree || 'Degree'}</h3>
                <p className="text-sm italic text-gray-600 mb-2">
                  {edu.school}{edu.location ? `, ${edu.location}` : ''}
                  {edu.graduationDate ? ` • ${formatDisplayDate(edu.graduationDate)}` : ''}
                </p>
                {edu.description && (
                  <div className="text-sm leading-relaxed text-gray-800 max-w-4xl mx-auto" dangerouslySetInnerHTML={{ __html: edu.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-center mb-6 tracking-wider uppercase text-gray-800">
            Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-center text-sm">
            {resume.skills.map((skill, index) => (
              <span key={skill.id} className="text-gray-800">
                {skill.name}{index < resume.skills.length - 1 ? " • " : ""}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // Creative template - modern two-column layout
  const CreativeTemplate = () => (
    <div className="bg-white text-black min-h-[1100px] max-w-[800px] mx-auto flex">
      {/* Left sidebar */}
      <div className="w-1/3 bg-slate-800 text-white p-6">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold mb-2 leading-tight">
            {resume.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-sm text-slate-300">
            {resume.personalInfo.title || 'Professional Title'}
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-3 border-b border-white/30 pb-2 uppercase tracking-wide">
            Contact
          </h2>
          <div className="space-y-2 text-xs">
            {resume.personalInfo.email && (
              <div className="break-words">{resume.personalInfo.email}</div>
            )}
            {resume.personalInfo.phone && (
              <div>{resume.personalInfo.phone}</div>
            )}
            {resume.personalInfo.location && (
              <div>{resume.personalInfo.location}</div>
            )}
            {resume.personalInfo.website && (
              <div className="break-words">{resume.personalInfo.website}</div>
            )}
            {resume.personalInfo.linkedin && (
              <div className="break-words">{resume.personalInfo.linkedin}</div>
            )}
          </div>
        </div>
        
        {resume.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold mb-3 border-b border-white/30 pb-2 uppercase tracking-wide">
              Skills
            </h2>
            <div className="space-y-2">
              {resume.skills.map((skill) => (
                <div key={skill.id} className="text-xs bg-slate-700 px-2 py-1 rounded">
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {resume.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold mb-3 border-b border-white/30 pb-2 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-xs">{edu.degree || 'Degree'}</h3>
                  <p className="text-xs text-slate-300">{edu.school}</p>
                  {edu.location && (
                    <p className="text-xs text-slate-400">{edu.location}</p>
                  )}
                  {edu.graduationDate && (
                    <p className="text-xs text-slate-400">{formatDisplayDate(edu.graduationDate)}</p>
                  )}
                  {edu.description && (
                    <div className="text-xs text-slate-300 mt-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: edu.description }} />
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
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b-2 border-slate-300 pb-2">
              Professional Summary
            </h2>
            <div className="text-sm leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: resume.summary }} />
          </section>
        )}
        
        {resume.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b-2 border-slate-300 pb-2">
              Experience
            </h2>
            <div className="space-y-5">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-400">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-slate-600 rounded-full"></div>
                  <h3 className="font-bold text-sm text-gray-900">{exp.title || 'Position Title'}</h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {exp.startDate && exp.endDate
                      ? `${formatDisplayDate(exp.startDate)} - ${formatDisplayDate(exp.endDate)}`
                      : 'Present'}
                  </p>
                  {exp.description && (
                    <div className="text-xs leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: exp.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b-2 border-slate-300 pb-2">
              Projects
            </h2>
            <div className="space-y-5">
              {resume.projects.map((project) => (
                <div key={project.id} className="relative pl-4 border-l-2 border-slate-400">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-slate-600 rounded-full"></div>
                  <h3 className="font-bold text-sm text-gray-900">{project.title}</h3>
                  {project.technologies && (
                    <p className="text-xs text-slate-600 mb-1">{project.technologies}</p>
                  )}
                  {project.link && (
                    <p className="text-xs text-blue-600 mb-1">{project.link}</p>
                  )}
                  <p className="text-xs text-gray-500 mb-2">
                    {project.startDate && project.endDate
                      ? `${formatDisplayDate(project.startDate)} - ${formatDisplayDate(project.endDate)}`
                      : ''}
                  </p>
                  {project.description && (
                    <div className="text-xs leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: project.description }} />
                  )}
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
