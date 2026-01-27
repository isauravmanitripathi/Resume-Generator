<script lang="ts">
  import { Sparkles, User, Briefcase, GraduationCap, Hammer, ChevronDown } from 'lucide-svelte';
  import type { Profile } from '$lib/db';

  interface Props {
    profile: Profile | null;
    jobDescription: string;
    isGenerating: boolean;
    onGenerate: () => void;
  }

  let { profile, jobDescription = $bindable(), isGenerating, onGenerate } = $props<Props>();

  let selectedType = $state<'summary' | 'experience' | 'education' | 'skills'>('summary');
  let selectedId = $state<string | null>(null);

  // Derive the options based on profile
  let options = $derived(() => {
    if (!profile) return [];
    if (selectedType === 'experience') {
      return profile.experience.map(e => ({ id: e.id, name: e.company, label: e.role }));
    }
    if (selectedType === 'education') {
      return profile.education.map(e => ({ id: e.id, name: e.institution, label: e.area }));
    }
    if (selectedType === 'skills') {
      return profile.skills.map(s => ({ id: s.id, name: s.name, label: s.category }));
    }
    return [];
  });

  // Reset selectedId when type changes
  $effect(() => {
    if (selectedType !== 'summary') {
      const opts = options();
      if (opts.length > 0 && !selectedId) {
        selectedId = opts[0].id;
      }
    } else {
      selectedId = null;
    }
  });
</script>

<div class="space-y-6">
  <!-- Context Selection -->
  <div class="space-y-3">
    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Focus Area</label>
    
    <div class="grid grid-cols-4 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
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
    </div>

    {#if selectedType !== 'summary'}
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
    {:else}
      <div class="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <div class="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
          <User size={12} />
        </div>
        <p class="text-[10px] font-bold text-blue-700">Optimization focused on your Professional Summary</p>
      </div>
    {/if}
  </div>

  <div class="space-y-3">
    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest" for="jd">Target Job Description</label>
    <textarea 
      id="jd"
      bind:value={jobDescription}
      placeholder="Paste the target job description here..."
      class="w-full h-[300px] p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none shadow-inner"
    ></textarea>
  </div>
  
  <button 
    onclick={onGenerate}
    class="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group disabled:opacity-50"
    disabled={!jobDescription || isGenerating}
  >
    <Sparkles size={16} class="group-hover:animate-pulse" />
    {isGenerating ? 'Architecting...' : 'Build Tailored Resume'}
  </button>
</div>
