import Dexie, { type Table } from 'dexie';

export interface Profile {
  id: string; // Singleton "master"
  basics: {
    name: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  raw_context: string; // The "blob" for AI
}

export interface EducationItem {
  id: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  raw_context: string;
}

export interface ResumeVersion {
  id: string;
  created: number;
  name: string;
  canvas: CanvasItem[];
  meta: any;
}

export interface CanvasItem {
  id: string;
  type: 'experience' | 'education' | 'skill' | 'project' | 'text' | 'divider';
  x: number;
  y: number;
  w: number;
  h: number | 'auto';
  data: any; // The tailored content
  style: any;
}

export interface AppSettings {
  id: string; // Singleton "app"
  providers: {
    openai: { key: string; model: string };
    gemini: { key: string; model: string };
    anthropic: { key: string; model: string };
    grok: { key: string; model: string };
  };
  activeProvider: 'openai' | 'gemini' | 'anthropic' | 'grok';
}

export class ResumeDatabase extends Dexie {
  profile!: Table<Profile>;
  resumes!: Table<ResumeVersion>;
  settings!: Table<AppSettings>;

  constructor() {
    super('INeedAResumeDB');
    this.version(1).stores({
      profile: 'id', // Singleton, usually just one row with id='master'
      resumes: 'id, created, name',
      settings: 'id'
    });
  }
}

export const db = new ResumeDatabase();
