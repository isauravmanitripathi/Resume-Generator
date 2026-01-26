import Dexie, { type Table } from 'dexie';

export interface Profile {
  id: string; // Singleton "master"
  basics: {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    countryCode: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    summary: string;
    title: string;
  };
  socials: {
    linkedin: string;
    github: string;
    twitter: string;
    youtube: string;
    instagram: string;
    website: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  achievements: AchievementItem[];
  publications: PublicationItem[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  raw_context: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  location: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: string; // Beginner, Intermediate, Expert
  category: string; // Hardware, Software, Soft Skill
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  url: string;
  raw_context: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  issuer: string;
  description: string;
}

export interface PublicationItem {
  id: string;
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
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
