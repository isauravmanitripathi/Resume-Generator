<script lang="ts">
  import { X, Database, FileJson, Code } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  interface Props {
    onClose: () => void;
  }

  let { onClose } = $props<Props>();

  const dbSchema = `
  interface Profile {
    basics: {
      firstName: string;
      lastName: string;
      email: string;
      // ...
    };
    socials: { linkedin: string; github: string; ... };
    experience: ExperienceItem[];
    education: EducationItem[];
    skills: SkillItem[];
    projects: ProjectItem[];
    // ...
  }
  `;

  const fetchExample = `
  import { db } from '$lib/db';

  // Fetch the master profile
  const profile = await db.profile.get('master');

  // Use in your component
  console.log(profile.basics.firstName);
  `;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 200 }}>
  <!-- Backdrop -->
  <div 
    class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    onclick={onClose}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  ></div>

  <!-- Modal -->
  <div 
    class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
    transition:fly={{ y: 20, duration: 300, delay: 100 }}
  >
    <!-- Header -->
    <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
          <Database size={20} />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900">Developer Resources</h2>
          <p class="text-xs text-slate-500 font-medium">Data Schema & Integration Guide</p>
        </div>
      </div>
      <button 
        onclick={onClose}
        class="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
      >
        <X size={20} />
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-8 bg-slate-50/30">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Schema Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-slate-500 mb-2">
            <FileJson size={16} />
            <h3 class="text-xs font-black uppercase tracking-widest">Data Structure</h3>
          </div>
          <div class="relative group">
            <div class="absolute inset-0 bg-slate-900 rounded-2xl transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <div class="relative bg-slate-800 rounded-2xl p-6 ring-1 ring-white/10 overflow-hidden">
               <pre class="font-mono text-xs text-blue-200 overflow-x-auto custom-scrollbar"><code>{dbSchema.trim()}</code></pre>
            </div>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            All user data is stored locally in IndexedDB using Dexie.js. The <code class="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-700">Profile</code> interface is the single source of truth for the resume.
          </p>
        </div>

        <!-- Fetching Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-slate-500 mb-2">
            <Code size={16} />
            <h3 class="text-xs font-black uppercase tracking-widest">Fetching Data</h3>
          </div>
          <div class="relative group">
            <div class="absolute inset-0 bg-slate-900 rounded-2xl transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            <div class="relative bg-slate-800 rounded-2xl p-6 ring-1 ring-white/10 overflow-hidden">
               <pre class="font-mono text-xs text-emerald-300 overflow-x-auto custom-scrollbar"><code>{fetchExample.trim()}</code></pre>
            </div>
          </div>
          <p class="text-xs text-slate-500 leading-relaxed">
            Use the <code class="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-700">$lib/db</code> module to access the database. The 'master' ID is reserved for the active user profile.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-8 py-4 bg-white border-t border-slate-100 flex justify-end">
      <button 
        onclick={onClose}
        class="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
      >
        Close Documentation
      </button>
    </div>
  </div>
</div>

<style>
  .custom-scrollbar::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
</style>
