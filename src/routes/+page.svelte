<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { db, type Profile, type ResumeVersion } from '$lib/db';
  import { 
    Sparkles, Database, Palette, Lightbulb, RefreshCw, Eye, FileText, ChevronDown, Plus, Save, Trash2
  } from 'lucide-svelte';
  import ResumePreview from '$lib/components/ResumePreview.svelte';
  import VaultExplorer from '$lib/components/architect/VaultExplorer.svelte';
  import ThemeSelector from '$lib/components/architect/ThemeSelector.svelte';
  import AIArchitect from '$lib/components/architect/AIArchitect.svelte';
  import { toasts } from '$lib/toastStore';

  let profile = $state<Profile | null>(null);
  let resumes = $state<ResumeVersion[]>([]);
  let activeResumeId = $state<string | null>(null);
  let activeResume = $derived(resumes.find(r => r.id === activeResumeId) || null);

  let jobDescription = $state('');
  let isGenerating = $state(false);
  let selectedTemplate = $state('classic');
  
  $effect(() => {
    if (activeResumeId && selectedTemplate) {
      db.resumes.update(activeResumeId, { templateId: selectedTemplate });
    }
  });

  let activeSubTab = $state('ai');
  let customCode = $state('');

  const navTabs = [
    { id: 'ai', name: 'AI Mode', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'info', name: 'Information', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'design', name: 'Design', icon: Palette, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'creative', name: 'Creative', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Sync template/code when active resume changes
  $effect(() => {
    if (activeResume) {
      if (activeResume.templateId) selectedTemplate = activeResume.templateId;
      if (activeResume.customCode) customCode = activeResume.customCode;
    }
  });

  // Derived profile with tailored content applied
  let appliedProfile = $derived.by(() => {
    if (!profile) return null;
    if (!activeResume) return profile;

    const merged = { ...$state.snapshot(profile) };
    const tailored = activeResume.tailoredContent;

    if (tailored.summary) merged.basics.summary = tailored.summary;
    
    // Apply tailored Experience
    merged.experience = merged.experience.map(exp => ({
      ...exp,
      raw_context: tailored.experience[exp.id] || exp.raw_context
    }));

    // Apply tailored Education
    merged.education = merged.education.map(edu => ({
      ...edu,
      studyType: tailored.education[edu.id] || edu.studyType
    }));

    // Apply tailored Skills
    merged.skills = merged.skills.map(skill => ({
      ...skill,
      name: tailored.skills[skill.id] || skill.name
    }));

    return merged;
  });

  onMount(async () => {
    try {
      await refreshData();
      
      // Load last used resume from DB settings
      const settings = await db.settings.get('app');
      const lastId = settings?.lastActiveResumeId;

      const allResumes = await db.resumes.orderBy('created').reverse().toArray();
      resumes = allResumes;

      if (lastId && resumes.some(r => r.id === lastId)) {
        activeResumeId = lastId;
        toasts.add(`Restored session: "${resumes.find(r => r.id === lastId)?.name}"`, "success");
      } else if (resumes.length > 0) {
        activeResumeId = resumes[0].id;
      }
    } catch (err: any) {
      toasts.add(`Failed to load session: ${err.message}`, "error");
    }
  });

  $effect(() => {
    if (activeResumeId) {
      db.settings.get('app').then(settings => {
        if (settings) {
          db.settings.update('app', { lastActiveResumeId: activeResumeId });
        } else {
          // Initialize if missing
          db.settings.put({
            id: 'app',
            lastActiveResumeId: activeResumeId,
            activeProvider: 'openai',
            providers: {
              openai: { key: '', model: 'gpt-4o' },
              gemini: { key: '', model: '' },
              anthropic: { key: '', model: '' },
              grok: { key: '', model: '' }
            }
          });
        }
      });
    }
  });

  async function refreshData() {
    const saved = await db.profile.get('master');
    if (saved) {
      profile = saved;
      if (saved.customTemplate) customCode = saved.customTemplate;
    }
    const allResumes = await db.resumes.orderBy('created').reverse().toArray();
    resumes = allResumes;
  }

  async function createNewResume() {
    const name = prompt("Enter a name for your new tailored resume:");
    if (!name) return;

    try {
      const newResume: ResumeVersion = {
        id: crypto.randomUUID(),
        name,
        created: Date.now(),
        templateId: selectedTemplate,
        customCode: customCode,
        tailoredContent: {
          experience: {},
          education: {},
          skills: {}
        }
      };

      await db.resumes.add(newResume);
      await refreshData();
      activeResumeId = newResume.id;
      toasts.add(`Created "${name}"`, "success");
    } catch (err: any) {
      toasts.add(`Failed to create resume: ${err.message}`, "error");
    }
  }

  async function handleGenerate(tailored: { type: string, id: string | null, content: string }) {
    if (!activeResumeId) {
      const name = prompt("You don't have an active tailored resume. Enter a name to create one:", "My Tailored Resume");
      if (!name) return;
      
      try {
        const newResume: ResumeVersion = {
          id: crypto.randomUUID(),
          name,
          created: Date.now(),
          templateId: selectedTemplate,
          customCode: customCode,
          tailoredContent: {
            experience: {},
            education: {},
            skills: {}
          }
        };
        await db.resumes.add(newResume);
        await refreshData(); // Ensure UI knows about it!
        activeResumeId = newResume.id;
        toasts.add(`Created "${name}"`, "success");
      } catch (err: any) {
        toasts.add(`Failed to create auto-resume: ${err.message}`, "error");
        return;
      }
    }

    const resume = await db.resumes.get(activeResumeId);
    if (!resume) return;

    if (tailored.type === 'summary') {
      resume.tailoredContent.summary = tailored.content;
    } else if (tailored.type === 'experience' && tailored.id) {
      resume.tailoredContent.experience[tailored.id] = tailored.content;
    } else if (tailored.type === 'education' && tailored.id) {
      resume.tailoredContent.education[tailored.id] = tailored.content;
    } else if (tailored.type === 'skills' && tailored.id) {
      resume.tailoredContent.skills[tailored.id] = tailored.content;
    }

    await db.resumes.update(activeResumeId, { tailoredContent: resume.tailoredContent });
    await refreshData();
  }

  async function handleSaveCustomCode(code: string) {
    customCode = code;
    if (activeResumeId) {
      await db.resumes.update(activeResumeId, { customCode: code });
    }
    await db.profile.update('master', { customTemplate: code });
    await refreshData();
  }

  async function handleSaveResume() {
    if (!activeResumeId) return;
    try {
      // Just update timestamp for now to "touch" the file
      await db.resumes.update(activeResumeId, { created: Date.now() });
      const r = resumes.find(r => r.id === activeResumeId);
      toasts.add(`Saved resume "${r?.name}"`, "success");
      await refreshData();
    } catch (e) {
      toasts.add("Failed to save", "error");
    }
  }

  async function handleDeleteResume() {
    if (!activeResumeId) return;
    const r = resumes.find(r => r.id === activeResumeId);
    if (!confirm(`Are you sure you want to delete "${r?.name}"? This cannot be undone.`)) return;

    try {
      await db.resumes.delete(activeResumeId);
      
      // If we deleted the active one from settings, clear it
      const settings = await db.settings.get('app');
      if (settings?.lastActiveResumeId === activeResumeId) {
        await db.settings.update('app', { lastActiveResumeId: undefined });
      }

      toasts.add(`Deleted "${r?.name}"`, "success");
      await refreshData();
      
      // Select another resume if available
      if (resumes.length > 0) {
        activeResumeId = resumes[0].id;
      } else {
        activeResumeId = null;
      }
    } catch (e) {
      toasts.add("Failed to delete", "error");
    }
  }
</script>

<div class="h-full flex flex-col overflow-hidden">
  <!-- Header -->
  <header class="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-4">
      <div class="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-100">
        <Sparkles size={20} />
      </div>
      <div>
        <h1 class="text-xl font-bold text-slate-900 tracking-tight">AI Architect</h1>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Version 1.0 • Phase 2</p>
      </div>
    </div>
    
    <div class="flex items-center gap-3">
      <!-- Resume Selector -->
      <div class="relative">
        <select 
          bind:value={activeResumeId}
          class="pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none hover:bg-slate-100 transition-all cursor-pointer min-w-[200px]"
        >
          {#each resumes as res}
            <option value={res.id}>{res.name}</option>
          {/each}
          {#if resumes.length === 0}
            <option value={null} disabled>No Resumes Found</option>
          {/if}
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <ChevronDown size={14} />
        </div>
      </div>

      <button 
        onclick={createNewResume}
        class="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 px-3 text-xs font-bold"
        title="New Tailored Resume"
      >
        <Plus size={16} />
        <span>New</span>
      </button>

      <div class="h-6 w-px bg-slate-200 mx-1"></div>
      
      <button 
        onclick={handleSaveResume}
        class="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-2 px-3 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        title="Save Resume"
      >
        <Save size={16} />
        <span>Save</span>
      </button>

      <button 
        onclick={handleDeleteResume}
        class="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 px-3 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete Resume"
      >
        <Trash2 size={16} />
        <span>Delete</span>
      </button>

      <div class="h-6 w-px bg-slate-200 mx-1"></div>

      <button 
        onclick={refreshData}
        class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        title="Sync Workspace"
      >
        <RefreshCw size={18} />
      </button>
      <div class="h-6 w-px bg-slate-200 mx-1"></div>
      <a href="/vault" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm">
        Edit Vault
      </a>
    </div>
  </header>

  <div class="flex-1 flex overflow-hidden">
    <!-- Sub-Navigation Sidebar (Vertical) -->
    <nav class="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0 relative z-10">
      {#each navTabs as tab}
        {@const Icon = tab.icon}
        <button
          onclick={() => activeSubTab = tab.id}
          class="group relative flex flex-col items-center gap-1 transition-all"
          title={tab.name}
        >
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
            {activeSubTab === tab.id 
              ? `${tab.bg} ${tab.color} shadow-inner scale-105` 
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}"
          >
            <Icon size={22} strokeWidth={activeSubTab === tab.id ? 2.5 : 2} />
          </div>
          <span class="text-[9px] font-bold uppercase tracking-tighter transition-colors
            {activeSubTab === tab.id ? tab.color : 'text-slate-400 group-hover:text-slate-600'}">
            {tab.id}
          </span>
          {#if activeSubTab === tab.id}
            <div class="absolute -right-[21px] top-1/2 -translate-y-1/2 w-1 h-8 
              {tab.id === 'ai' ? 'bg-blue-600' : tab.id === 'info' ? 'bg-emerald-600' : tab.id === 'design' ? 'bg-purple-600' : 'bg-amber-600'} rounded-l-full"></div>
          {/if}
        </button>
      {/each}
    </nav>

    <!-- Content Pane (Dynamic) -->
    <div class="w-[400px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
      <!-- Tab Header -->
      <div class="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 class="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center gap-2">
          {#if activeSubTab === 'ai'}<Sparkles size={16} class="text-blue-600" /> AI Mode{/if}
          {#if activeSubTab === 'info'}<Database size={16} class="text-emerald-600" /> Explorer{/if}
          {#if activeSubTab === 'design'}<Palette size={16} class="text-purple-600" /> Studio{/if}
          {#if activeSubTab === 'creative'}<Lightbulb size={16} class="text-amber-600" /> Lab{/if}
        </h2>
        <span class="text-[10px] font-bold text-slate-400">Section 0{navTabs.findIndex(t => t.id === activeSubTab) + 1}</span>
      </div>

      <div class="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {#if activeSubTab === 'ai'}
          <AIArchitect 
            {profile}
            bind:jobDescription 
            isGenerating={isGenerating} 
            onGenerate={handleGenerate} 
          />

        {:else if activeSubTab === 'info'}
          <VaultExplorer {profile} />

        {:else if activeSubTab === 'design'}
          <ThemeSelector 
            selectedTemplate={selectedTemplate} 
            customCode={customCode}
            onSelect={(id) => selectedTemplate = id} 
            onUpdateCustomCode={handleSaveCustomCode}
          />

        {:else if activeSubTab === 'creative'}
           <div class="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in py-12">
              <div class="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                <Lightbulb size={32} />
              </div>
              <div>
                <h3 class="font-black text-slate-800 uppercase text-xs tracking-widest">Creative Lab</h3>
                <p class="text-xs text-slate-400 mt-2 max-w-[200px]">Unlock visualization tools, network graphs, and smart interview prep here.</p>
              </div>
              <div class="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Under Development
              </div>
           </div>
        {/if}
      </div>
    </div>

    <!-- Preview Surface -->
    <main class="flex-1 bg-slate-50/30 overflow-y-auto p-8 lg:p-12 relative">
      <div class="absolute top-6 right-8 flex items-center gap-4 text-slate-300">
         <div class="flex items-center gap-2">
           <Eye size={14} />
           <span class="text-[10px] font-black uppercase tracking-widest">Live View</span>
         </div>
      </div>

      <div class="min-h-full flex items-start justify-center">
        {#if appliedProfile}
          <div class="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm">
            <ResumePreview 
              profile={appliedProfile} 
              templateId={activeResume?.templateId || selectedTemplate} 
              customCode={activeResume?.customCode || customCode} 
            />
          </div>
        {:else if profile}
          <!-- In case appliedProfile is null but profile exists -->
          <div class="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm">
             <ResumePreview {profile} templateId={selectedTemplate} {customCode} />
          </div>
        {:else}
          <!-- Empty State -->
           <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 mt-32">
            <div class="bg-white p-6 rounded-full mb-4 shadow-sm">
              <FileText size={48} class="text-slate-200" />
            </div>
            <p class="text-lg font-medium text-slate-500">Your Vault is empty</p>
            <p class="text-sm max-w-xs mx-auto mt-2">Go to the Profile Vault to add your experience, education, and skills first.</p>
            <a href="/vault" class="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Open Vault
            </a>
          </div>
        {/if}
      </div>
    </main>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .animate-fade-in {
    animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .input-field {
    @apply w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400 font-medium;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
</style>
