
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

interface ResumeState {
  templateStyle: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
}

const initialState: ResumeState = {
  templateStyle: 'professional',
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setTemplateStyle(state, action: PayloadAction<string>) {
      state.templateStyle = action.payload;
    },
    updatePersonalInfo(state, action: PayloadAction<Partial<PersonalInfo>>) {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    updateSummary(state, action: PayloadAction<string>) {
      state.summary = action.payload;
    },
    // Experience actions
    addExperience(state, action: PayloadAction<Experience>) {
      state.experience.push(action.payload);
    },
    updateExperience(state, action: PayloadAction<{ id: string; data: Partial<Experience> }>) {
      const index = state.experience.findIndex((exp) => exp.id === action.payload.id);
      if (index !== -1) {
        state.experience[index] = { ...state.experience[index], ...action.payload.data };
      }
    },
    removeExperience(state, action: PayloadAction<string>) {
      state.experience = state.experience.filter((exp) => exp.id !== action.payload);
    },
    // Education actions
    addEducation(state, action: PayloadAction<Education>) {
      state.education.push(action.payload);
    },
    updateEducation(state, action: PayloadAction<{ id: string; data: Partial<Education> }>) {
      const index = state.education.findIndex((edu) => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = { ...state.education[index], ...action.payload.data };
      }
    },
    removeEducation(state, action: PayloadAction<string>) {
      state.education = state.education.filter((edu) => edu.id !== action.payload);
    },
    // Skill actions
    addSkill(state, action: PayloadAction<Skill>) {
      state.skills.push(action.payload);
    },
    removeSkill(state, action: PayloadAction<string>) {
      state.skills = state.skills.filter((skill) => skill.id !== action.payload);
    },
    // Project actions
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
    updateProject(state, action: PayloadAction<{ id: string; data: Partial<Project> }>) {
      const index = state.projects.findIndex((proj) => proj.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload.data };
      }
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((proj) => proj.id !== action.payload);
    },
    resetResume(state) {
      return {
        ...initialState,
        templateStyle: state.templateStyle // Keep the selected template style
      };
    },
  },
});

export const {
  setTemplateStyle,
  updatePersonalInfo,
  updateSummary,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  resetResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
