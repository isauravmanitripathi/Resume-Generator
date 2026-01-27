import Dexie, { type Table } from 'dexie';

export interface PromptTemplate {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    userPromptTemplate: string;
    isCustom: boolean;
    lastUpdated: number;
}

export class PromptDatabase extends Dexie {
    prompts!: Table<PromptTemplate>;

    constructor() {
        super('PromptVaultDB');
        this.version(1).stores({
            prompts: 'id, name, isCustom'
        });
    }
}

export const promptDb = new PromptDatabase();

export const DEFAULT_PROMPTS: Record<string, Omit<PromptTemplate, 'lastUpdated'>> = {
    'resume-tailor': {
        id: 'resume-tailor',
        name: 'Experience Tailoring',
        description: 'Rewrites professional experience bullets based on a job description.',
        systemPrompt: 'You are an expert resume writer. Rewrite the professional experience bullets to align with the job description.\nIMPORTANT: Return strictly as a JSON object: {"tailored_content": "• Bullet 1\\n• Bullet 2..."}. Use exactly {{numPoints}} bullet points.',
        userPromptTemplate: 'Experience Item:\n{{experience}}\n\nJob Description:\n{{jobDescription}}\n\nRewrite as {{numPoints}} bullet points. Return ONLY the JSON object.',
        isCustom: false
    },
    'summary-gen': {
        id: 'summary-gen',
        name: 'Summary Generation',
        description: 'Generates a professional summary based on profile and JD.',
        systemPrompt: 'You are an expert career coach. Create a compelling, concise professional summary (2-3 sentences) for a resume.\nIMPORTANT: Return your response strictly as a JSON object: {"tailored_content": "your content here"}. Do not include markdown code blocks or any other text.',
        userPromptTemplate: 'Profile Data:\n{{profileSummary}}\n\nJob Description:\n{{jobDescription}}\n\nGenerate a professional summary. Return ONLY the JSON object.',
        isCustom: false
    },
    'skill-extract': {
        id: 'skill-extract',
        name: 'Skill Extraction',
        description: 'Extracts relevant skills from a job description.',
        systemPrompt: 'Extract key technical and soft skills from the following job description. Return them as a comma-separated list.',
        userPromptTemplate: 'Job Description:\n{{jobDescription}}',
        isCustom: false
    },
    'hello-json': {
        id: 'hello-json',
        name: 'Hello JSON Test',
        description: 'Test prompt to verify JSON response format.',
        systemPrompt: 'Return a JSON string exactly in this format: {"greetings": "hi"}',
        userPromptTemplate: 'Return hit in JSON format.',
        isCustom: false
    }
};

export async function initializePrompts() {
    const existingIds = new Set((await promptDb.prompts.toArray()).map(p => p.id));
    const now = Date.now();

    const missingPrompts = Object.values(DEFAULT_PROMPTS)
        .filter(p => !existingIds.has(p.id))
        .map(p => ({
            ...p,
            lastUpdated: now
        }));

    if (missingPrompts.length > 0) {
        await promptDb.prompts.bulkAdd(missingPrompts);
    }
}
