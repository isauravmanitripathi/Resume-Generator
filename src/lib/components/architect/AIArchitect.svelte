<script lang="ts">
  import { Sparkles, User, Briefcase, GraduationCap, Hammer, FolderGit2, ChevronDown, Loader2, Zap, ChevronRight } from 'lucide-svelte';
  import type { Profile } from '$lib/db';
  import { db } from '$lib/db';
  import { promptDb } from '$lib/promptDb';
  import { generateTailoredContent } from '../../../routes/guides/openai/openai';
  import { generateOpenRouterContent } from '../../../routes/guides/openrouter/openrouter';
  import { toasts } from '$lib/toastStore';

  interface Props {
    profile: Profile | null;
    resolvedProfile: Profile | null;
    jobDescription: string;
    isGenerating: boolean;
    onGenerate: (result: { type: string, id: string | null, content: string }) => void;
  }

  let { profile, resolvedProfile, jobDescription = $bindable(), isGenerating = $bindable(), onGenerate } = $props<Props>();

  let selectedType = $state<'summary' | 'experience' | 'education' | 'skills' | 'projects'>('summary');
  let selectedId = $state<string | null>(null);
  let numPoints = $state(4);
  let numSkills = $state(10);
  let yearsOfExperience = $state('');

  // Bulk tailoring state
  let showBulkPanel = $state(false);
  let bulkSections = $state({ summary: true, experience: true, projects: true });
  let bulkCompleted = $state(0);
  let bulkTotal = $state(0);
  let isBulkGenerating = $state(false);

  // Derive the options based on profile (only for types that need a dropdown)
  let options = $derived(() => {
    if (!profile) return [];
    if (selectedType === 'experience') {
      return profile.experience.map(e => ({ id: e.id, name: e.company, label: e.role }));
    }
    if (selectedType === 'education') {
      return profile.education.map(e => ({ id: e.id, name: e.institution, label: e.area }));
    }
    if (selectedType === 'projects') {
      return profile.projects.map(p => ({ id: p.id, name: p.name, label: 'Project' }));
    }
    return [];
  });

  // Reset selectedId when type changes
  $effect(() => {
    if (selectedType !== 'summary' && selectedType !== 'skills') {
      const opts = options();
      if (opts.length > 0 && !selectedId) {
        selectedId = opts[0].id;
      }
    } else {
      selectedId = null;
    }
  });

  // Core generation logic — shared between single and bulk modes
  async function generateForItem(
    type: 'summary' | 'experience' | 'education' | 'skills' | 'projects',
    id: string | null
  ): Promise<string> {
    if (!profile) throw new Error("No profile loaded.");

    const settings = await db.settings.get('app');
    const activeProvider = settings?.activeProvider || 'openai';
    const model = activeProvider === 'openrouter'
      ? settings?.providers.openrouter.model || 'openai/gpt-5-mini'
      : settings?.providers.openai.model || 'gpt-4.1';

    let contextContent = "";
    let promptId = "resume-tailor";

    if (type === 'summary') {
      const src = resolvedProfile || profile;
      const expContext = src.experience
        .map(e => `${e.role} at ${e.company}:\n${e.raw_context || ''}`)
        .join('\n\n');
      const skillsList = src.skills.map(s => s.name).filter(Boolean).join(', ');
      const projContext = src.projects
        .map(p => `${p.name}:\n${p.raw_context || ''}`)
        .filter(p => p.trim().length > 0)
        .join('\n\n');
      contextContent = [
        `Years of Experience: ${yearsOfExperience || 'Not specified'}`,
        `\nExperience:\n${expContext}`,
        skillsList ? `\nSkills: ${skillsList}` : '',
        projContext ? `\nProjects:\n${projContext}` : ''
      ].join('\n');
      promptId = "summary-gen";
    } else if (type === 'experience') {
      const item = profile.experience.find(e => e.id === id);
      contextContent = item ? `${item.role} at ${item.company}: ${item.raw_context || ''}` : "";
    } else if (type === 'education') {
      const item = profile.education.find(e => e.id === id);
      contextContent = item ? `${item.studyType} in ${item.area} at ${item.institution}. Details: ${item.raw_context || ''}` : "";
      promptId = "education-tailor";
    } else if (type === 'skills') {
      const src = resolvedProfile || profile;
      const expContext = src.experience
        .map(e => `${e.role} at ${e.company}:\n${e.raw_context || ''}`)
        .join('\n\n');
      const projContext = src.projects
        .map(p => `${p.name}:\n${p.raw_context || ''}`)
        .join('\n\n');
      contextContent = `Experience:\n${expContext}\n\nProjects:\n${projContext}`;
      promptId = "skill-gen";
    } else if (type === 'projects') {
      const item = profile.projects.find(p => p.id === id);
      contextContent = item ? `${item.name}: ${item.description}. ${item.raw_context || ''}` : "";
      promptId = "project-tailor";
    }

    const template = await promptDb.prompts.get(promptId);
    if (!template) throw new Error("Tailoring prompt not found.");

    const systemPrompt = template.systemPrompt
      .replace('{{numPoints}}', numPoints.toString())
      .replace('{{numSkills}}', numSkills.toString()) + "\nIMPORTANT: Return your response strictly as a JSON object: {\"tailored_content\": \"your content here\"}.";

    const userPrompt = template.userPromptTemplate
      .replace('{{experience}}', contextContent)
      .replace('{{education}}', contextContent)
      .replace('{{project}}', contextContent)
      .replace('{{context}}', contextContent)
      .replace('{{profileSummary}}', contextContent)
      .replace('{{jobDescription}}', jobDescription)
      .replace('{{numPoints}}', numPoints.toString())
      .replace('{{numSkills}}', numSkills.toString());

    let rawResponse: string;
    if (activeProvider === 'openrouter') {
      rawResponse = await generateOpenRouterContent(systemPrompt, userPrompt, model);
    } else {
      rawResponse = await generateTailoredContent(systemPrompt, userPrompt, model);
    }

    try {
      let cleanJson = rawResponse.trim();
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) cleanJson = jsonMatch[0];
      const parsed = JSON.parse(cleanJson);
      return parsed.tailored_content || rawResponse;
    } catch {
      return rawResponse.replace(/^Professional Summary:\s*/i, '').trim();
    }
  }

  async function executeTailoring() {
    if (!profile) return;
    isGenerating = true;
    try {
      const content = await generateForItem(selectedType, selectedId);
      onGenerate({ type: selectedType, id: selectedId, content });
    } catch (err) {
      console.error(err);
    } finally {
      isGenerating = false;
    }
  }

  async function executeBulkTailoring() {
    if (!profile || !jobDescription) return;

    // Build queue of items to process based on selections
    const queue: { type: 'summary' | 'experience' | 'projects'; id: string | null; label: string }[] = [];

    if (bulkSections.summary) {
      queue.push({ type: 'summary', id: null, label: 'Summary' });
    }
    if (bulkSections.experience) {
      profile.experience.forEach(e => queue.push({
        type: 'experience',
        id: e.id,
        label: `${e.role} at ${e.company}`
      }));
    }
    if (bulkSections.projects) {
      profile.projects.forEach(p => queue.push({
        type: 'projects',
        id: p.id,
        label: p.name
      }));
    }

    if (queue.length === 0) return;

    isBulkGenerating = true;
    isGenerating = true;
    bulkCompleted = 0;
    bulkTotal = queue.length;

    // Fire all calls in parallel — each saves atomically as it completes
    await Promise.allSettled(
      queue.map(async (item) => {
        const toastId = toasts.add(`Tailoring: ${item.label}`, 'loading');
        try {
          const content = await generateForItem(item.type, item.id);
          onGenerate({ type: item.type, id: item.id, content });
          toasts.update(toastId, { message: `Done: ${item.label}`, type: 'success' });
        } catch (err) {
          console.error(`Failed to tailor "${item.label}":`, err);
          toasts.update(toastId, { message: `Failed: ${item.label}`, type: 'error' });
        } finally {
          bulkCompleted++;
        }
      })
    );

    isBulkGenerating = false;
    isGenerating = false;
    bulkCompleted = 0;
    bulkTotal = 0;
  }
</script>

<div class="space-y-6">
  <!-- Context Selection -->
  <div class="space-y-3">
    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Focus Area</label>

    <div class="grid grid-cols-5 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
      <button
        onclick={() => selectedType = 'summary'}
        class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all
        {selectedType === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
      >
        <User size={14} />
        <span class="text-[9px] font-black uppercase tracking-tighter mt-1">Summary</span>
      </button>
      <button
        onclick={() => selectedType = 'experience'}
        class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all
        {selectedType === 'experience' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
      >
        <Briefcase size={14} />
        <span class="text-[9px] font-black uppercase tracking-tighter mt-1">Exp</span>
      </button>
      <button
        onclick={() => selectedType = 'education'}
        class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all
        {selectedType === 'education' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
      >
        <GraduationCap size={14} />
        <span class="text-[9px] font-black uppercase tracking-tighter mt-1">Edu</span>
      </button>
      <button
        onclick={() => selectedType = 'skills'}
        class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all
        {selectedType === 'skills' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
      >
        <Hammer size={14} />
        <span class="text-[9px] font-black uppercase tracking-tighter mt-1">Skills</span>
      </button>
      <button
        onclick={() => selectedType = 'projects'}
        class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all
        {selectedType === 'projects' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}"
      >
        <FolderGit2 size={14} />
        <span class="text-[9px] font-black uppercase tracking-tighter mt-1">Proj</span>
      </button>
    </div>

    {#if selectedType === 'summary'}
      <div class="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3">
          <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-0.5">
            <User size={12} />
          </div>
          <p class="text-[10px] font-bold text-blue-700 leading-relaxed">Reads your tailored experience, skills & projects to craft a Harvard-style summary</p>
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years of Experience</label>
          <input
            type="number"
            min="0"
            max="50"
            placeholder="e.g. 3"
            bind:value={yearsOfExperience}
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
          />
        </div>
      </div>

    {:else if selectedType === 'skills'}
      <div class="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-start gap-3">
          <div class="p-1.5 bg-rose-100 text-rose-600 rounded-lg shrink-0 mt-0.5">
            <FolderGit2 size={12} />
          </div>
          <p class="text-[10px] font-bold text-rose-700 leading-relaxed">Analyzes your tailored experience & projects alongside the job description to generate the most relevant skills</p>
        </div>
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Number of Skills</span>
            <span class="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">{numSkills} Skills</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-bold text-slate-400">Few</span>
            <input
              type="range"
              min="5"
              max="20"
              step="1"
              bind:value={numSkills}
              class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-rose-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
            />
            <span class="text-[10px] font-bold text-slate-400">Many</span>
          </div>
        </div>
      </div>

    {:else}
      <div class="relative animate-in fade-in slide-in-from-top-2 duration-300">
        <select
          bind:value={selectedId}
          class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        >
          {#each options() as opt}
            <option value={opt.id}>{opt.name} ({opt.label})</option>
          {/each}
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown size={14} />
        </div>
      </div>

      <!-- Bullet count config for experience and projects -->
      {#if selectedType === 'experience' || selectedType === 'projects'}
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Output Configuration</span>
            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{numPoints} Bullets</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-[10px] font-bold text-slate-400">Short</span>
            <input
              type="range"
              min="3"
              max="8"
              step="1"
              bind:value={numPoints}
              class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
            />
            <span class="text-[10px] font-bold text-slate-400">Detailed</span>
          </div>
        </div>
      {/if}
    {/if}
  </div>

  <div class="space-y-3">
    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest" for="jd">Target Job Description</label>
    <textarea
      id="jd"
      bind:value={jobDescription}
      placeholder="Paste the target job description here..."
      class="w-full h-[300px] p-5 bg-slate-50 border border-slate-200 rounded-3xl text-sm leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none shadow-inner"
    ></textarea>
  </div>

  <!-- Single item generate button -->
  <button
    onclick={executeTailoring}
    class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group disabled:opacity-50"
    disabled={!jobDescription || isGenerating}
  >
    {#if isGenerating && !isBulkGenerating}
      <Loader2 size={16} class="animate-spin" />
      Architecting...
    {:else}
      <Sparkles size={16} class="group-hover:animate-pulse" />
      Build Tailored Resume
    {/if}
  </button>

  <!-- Auto-Tailor All toggle button -->
  <button
    onclick={() => showBulkPanel = !showBulkPanel}
    class="w-full py-3 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2 group"
    disabled={isGenerating}
  >
    <Zap size={14} class="group-hover:text-violet-600 transition-colors" />
    Auto-Tailor Entire Resume
    <ChevronRight size={12} class="transition-transform duration-200 {showBulkPanel ? 'rotate-90' : ''}" />
  </button>

  <!-- Bulk Tailoring Panel -->
  {#if showBulkPanel}
    <div class="space-y-4 p-5 bg-violet-50/60 border border-violet-200 rounded-3xl animate-in fade-in slide-in-from-top-2 duration-300">
      <div class="flex items-start gap-3">
        <div class="p-1.5 bg-violet-100 text-violet-600 rounded-lg shrink-0 mt-0.5">
          <Zap size={12} />
        </div>
        <p class="text-[10px] font-bold text-violet-700 leading-relaxed">
          Rewrites every selected section one by one using the job description above. Watch your resume build itself live.
        </p>
      </div>

      <!-- Years of experience for bulk (shared with single-mode) -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years of Experience (for Summary)</label>
        <input
          type="number"
          min="0"
          max="50"
          placeholder="e.g. 3"
          bind:value={yearsOfExperience}
          class="w-full px-4 py-3 bg-white border border-violet-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-400/20 focus:bg-white transition-all"
        />
      </div>

      <!-- Section checkboxes -->
      <div class="space-y-2">
        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections to Rewrite</label>

        <label class="flex items-center gap-3 p-3 bg-white border border-violet-100 rounded-xl cursor-pointer hover:border-violet-300 transition-all group">
          <input
            type="checkbox"
            bind:checked={bulkSections.summary}
            class="w-4 h-4 rounded accent-violet-600 cursor-pointer"
          />
          <User size={13} class="text-blue-500 shrink-0" />
          <span class="text-xs font-bold text-slate-700">Summary</span>
        </label>

        <label class="flex items-center gap-3 p-3 bg-white border border-violet-100 rounded-xl cursor-pointer hover:border-violet-300 transition-all group">
          <input
            type="checkbox"
            bind:checked={bulkSections.experience}
            class="w-4 h-4 rounded accent-violet-600 cursor-pointer"
          />
          <Briefcase size={13} class="text-emerald-500 shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="text-xs font-bold text-slate-700">All Experiences</span>
            {#if profile && profile.experience.length > 0}
              <span class="ml-2 text-[10px] font-bold text-slate-400">{profile.experience.length} job{profile.experience.length !== 1 ? 's' : ''}</span>
            {/if}
          </div>
        </label>

        <label class="flex items-center gap-3 p-3 bg-white border border-violet-100 rounded-xl cursor-pointer hover:border-violet-300 transition-all group">
          <input
            type="checkbox"
            bind:checked={bulkSections.projects}
            class="w-4 h-4 rounded accent-violet-600 cursor-pointer"
          />
          <FolderGit2 size={13} class="text-rose-500 shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="text-xs font-bold text-slate-700">All Projects</span>
            {#if profile && profile.projects.length > 0}
              <span class="ml-2 text-[10px] font-bold text-slate-400">{profile.projects.length} project{profile.projects.length !== 1 ? 's' : ''}</span>
            {/if}
          </div>
        </label>
      </div>

      <!-- Bullet points config for bulk mode -->
      <div class="p-4 bg-white border border-violet-100 rounded-2xl">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bullets per Experience / Project</span>
          <span class="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{numPoints} Bullets</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-bold text-slate-400">Short</span>
          <input
            type="range"
            min="3"
            max="8"
            step="1"
            bind:value={numPoints}
            class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-violet-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
          />
          <span class="text-[10px] font-bold text-slate-400">Detailed</span>
        </div>
      </div>

      <!-- Progress bar (shown while running in parallel) -->
      {#if isBulkGenerating && bulkTotal > 0}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-violet-600 uppercase tracking-widest flex items-center gap-1">
              <Loader2 size={10} class="animate-spin" />
              Running {bulkTotal} calls in parallel
            </span>
            <span class="text-[10px] font-bold text-slate-400">{bulkCompleted}/{bulkTotal} done</span>
          </div>
          <div class="w-full h-1.5 bg-violet-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-violet-500 rounded-full transition-all duration-300"
              style="width: {bulkTotal > 0 ? (bulkCompleted / bulkTotal) * 100 : 0}%"
            ></div>
          </div>
        </div>
      {/if}

      <!-- Auto-Tailor button -->
      <button
        onclick={executeBulkTailoring}
        class="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-3 group disabled:opacity-50"
        disabled={!jobDescription || isGenerating || (!bulkSections.summary && !bulkSections.experience && !bulkSections.projects)}
      >
        {#if isBulkGenerating}
          <Loader2 size={16} class="animate-spin" />
          {bulkCompleted}/{bulkTotal} Completed...
        {:else}
          <Zap size={16} class="group-hover:animate-pulse" />
          Start Auto-Tailor
        {/if}
      </button>
    </div>
  {/if}
</div>
