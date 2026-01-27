<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { db, type Profile } from '$lib/db';
  import { 
    Sparkles, Database, Palette, Lightbulb, RefreshCw, Eye, FileText
  } from 'lucide-svelte';
  import ResumePreview from '$lib/components/ResumePreview.svelte';
  import VaultExplorer from '$lib/components/architect/VaultExplorer.svelte';
  import ThemeSelector from '$lib/components/architect/ThemeSelector.svelte';
  import AIArchitect from '$lib/components/architect/AIArchitect.svelte';

  let profile = $state<Profile | null>(null);
  let jobDescription = $state('');
  let isGenerating = $state(false);
  let selectedTemplate = $state('classic');
  let activeSubTab = $state('ai');
  let customCode = $state('');

  const navTabs = [
    { id: 'ai', name: 'AI Mode', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'info', name: 'Information', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'design', name: 'Design', icon: Palette, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'creative', name: 'Creative', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  /* 
    Phase 4: Creative Lab Placeholder 
  */

  onMount(async () => {
    const saved = await db.profile.get('master');
    if (saved) {
      profile = saved;
      if (saved.customTemplate) customCode = saved.customTemplate;
    }
  });

  async function refreshData() {
    const saved = await db.profile.get('master');
    if (saved) {
      profile = saved;
      if (saved.customTemplate) customCode = saved.customTemplate;
    }
  }

  function handleGenerate() {
    isGenerating = true;
    setTimeout(() => {
      isGenerating = false;
      alert('AI Generation Mock: Resume tailored!');
    }, 2000);
  }

  async function handleSaveCustomCode(code: string) {
    customCode = code;
    // Persist to DB
    await db.profile.update('master', { customTemplate: code });
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
        {#if profile}
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
