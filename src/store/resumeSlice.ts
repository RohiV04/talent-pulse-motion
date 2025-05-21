
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
}

export interface ResumeState {
  id: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certificates: Certificate[];
  languages: Language[];
  createdAt: string;
  updatedAt: string;
}

const initialState: ResumeState = {
  id: '',
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
  certificates: [],
  languages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<Partial<PersonalInfo>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
      state.updatedAt = new Date().toISOString();
    },
    updateSummary: (state, action: PayloadAction<string>) => {
      state.summary = action.payload;
      state.updatedAt = new Date().toISOString();
    },
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experience.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },
    updateExperience: (state, action: PayloadAction<{ id: string, data: Partial<Experience> }>) => {
      const { id, data } = action.payload;
      const index = state.experience.findIndex(exp => exp.id === id);
      if (index !== -1) {
        state.experience[index] = { ...state.experience[index], ...data };
        state.updatedAt = new Date().toISOString();
      }
    },
    removeExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter(exp => exp.id !== action.payload);
      state.updatedAt = new Date().toISOString();
    },
    addEducation: (state, action: PayloadAction<Education>) => {
      state.education.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },
    updateEducation: (state, action: PayloadAction<{ id: string, data: Partial<Education> }>) => {
      const { id, data } = action.payload;
      const index = state.education.findIndex(edu => edu.id === id);
      if (index !== -1) {
        state.education[index] = { ...state.education[index], ...data };
        state.updatedAt = new Date().toISOString();
      }
    },
    removeEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
      state.updatedAt = new Date().toISOString();
    },
    addSkill: (state, action: PayloadAction<Skill>) => {
      state.skills.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
      state.updatedAt = new Date().toISOString();
    },
    addCertificate: (state, action: PayloadAction<Certificate>) => {
      state.certificates.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },
    updateCertificate: (state, action: PayloadAction<{ id: string, data: Partial<Certificate> }>) => {
      const { id, data } = action.payload;
      const index = state.certificates.findIndex(cert => cert.id === id);
      if (index !== -1) {
        state.certificates[index] = { ...state.certificates[index], ...data };
        state.updatedAt = new Date().toISOString();
      }
    },
    removeCertificate: (state, action: PayloadAction<string>) => {
      state.certificates = state.certificates.filter(cert => cert.id !== action.payload);
      state.updatedAt = new Date().toISOString();
    },
    addLanguage: (state, action: PayloadAction<Language>) => {
      state.languages.push(action.payload);
      state.updatedAt = new Date().toISOString();
    },
    removeLanguage: (state, action: PayloadAction<string>) => {
      state.languages = state.languages.filter(lang => lang.id !== action.payload);
      state.updatedAt = new Date().toISOString();
    },
    importResume: (state, action: PayloadAction<ResumeState>) => {
      return { ...action.payload, updatedAt: new Date().toISOString() };
    },
    resetResume: () => {
      return { ...initialState, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    }
  },
});

export const {
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
  addCertificate,
  updateCertificate,
  removeCertificate,
  addLanguage,
  removeLanguage,
  importResume,
  resetResume
} = resumeSlice.actions;

export default resumeSlice.reducer;
