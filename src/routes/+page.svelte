<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Profile } from '$lib/db';
  import { Sparkles, Layout, Eye, FileText, MousePointer2, Eraser } from 'lucide-svelte';
  import ResumePreview from '$lib/components/ResumePreview.svelte';

  let profile = $state<Profile | null>(null);
  let jobDescription = $state('');
  let isGenerating = $state(false);
  let selectedTemplate = $state('classic');

  const templates = [
    { id: 'classic', name: 'Classic', icon: FileText, desc: 'Professional 2-column' },
    { id: 'modern', name: 'Modern', icon: Layout, desc: 'High-impact design' },
    { id: 'minimal', name: 'Minimal', icon: MousePointer2, desc: 'Clean & simple' },
    { id: 'blank', name: 'Blank', icon: Eraser, desc: 'Empty canvas' },
  ];

  onMount(async () => {
    const saved = await db.profile.get('master');
    if (saved) {
      profile = saved;
    }
  });

  async function refreshData() {
    const saved = await db.profile.get('master');
    if (saved) profile = saved;
  }
</script>

<div class="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col gap-8">
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
        AI Architect <Sparkles class="text-blue-600" size={24} />
      </h1>
      <p class="text-slate-500">Tailor your master profile to any job description instantly.</p>
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        onclick={refreshData}
        class="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
      >
        Sync Vault
      </button>
      <a href="/vault" class="text-xs font-bold text-white bg-slate-900 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors">
        Edit Vault
      </a>
    </div>
  </header>

  <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
    <!-- Left: Inputs -->
    <div class="lg:col-span-4 flex flex-col gap-6">
      <div class="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-slate-800 uppercase text-xs tracking-widest">Job Description</h2>
          <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">Phase 1: Input</span>
        </div>
        <textarea 
          bind:value={jobDescription}
          placeholder="Paste the target job description here. Our AI will analyze requirements and tailor your highlights..."
          class="flex-1 input-field resize-none py-4"
        ></textarea>
        
        <button 
          class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
          disabled={!jobDescription || isGenerating}
        >
          <Sparkles size={18} class="group-hover:animate-pulse" />
          {isGenerating ? 'Analyzing...' : 'Generate Resume'}
        </button>
      </div>
    </div>

    <!-- Right: Preview & Templates -->
    <div class="lg:col-span-8 flex flex-col gap-4 min-h-0">
      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div class="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          {#each templates as t}
            <button 
              onclick={() => selectedTemplate = t.id}
              class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
              {selectedTemplate === t.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50'}"
            >
              <t.icon size={14} />
              {t.name}
            </button>
          {/each}
        </div>
        <div class="hidden sm:flex items-center gap-2 px-3 text-slate-400">
           <Eye size={14} />
           <span class="text-[10px] font-bold uppercase tracking-wider">Live Preview</span>
        </div>
      </div>

      <div class="flex-1 bg-slate-100/50 rounded-3xl border border-slate-200 p-4 lg:p-10 overflow-y-auto custom-scrollbar">
        {#if profile}
          <ResumePreview {profile} templateId={selectedTemplate} />
        {:else}
          <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
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
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

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
