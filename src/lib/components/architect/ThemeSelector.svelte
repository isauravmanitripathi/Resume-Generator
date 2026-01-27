<script lang="ts">
  import {  Layout, FileText, MousePointer2, Eraser, ChevronRight, Sparkles, Code, Database, Hammer } from 'lucide-svelte';
  import CustomThemeEditor from '$lib/components/architect/studio/CustomThemeEditor.svelte';

  interface Props {
    selectedTemplate: string;
    customCode?: string;
    onSelect: (id: string) => void;
    onUpdateCustomCode?: (code: string) => void;
  }

  let { selectedTemplate, customCode = '', onSelect, onUpdateCustomCode } = $props<Props>();

  let showEditor = $state(false);

  const templates = [
    { id: 'classic', name: 'Classic', icon: FileText, desc: 'Professional 2-column' },
    { id: 'modern', name: 'Modern', icon: Layout, desc: 'High-impact design' },
    { id: 'minimal', name: 'Minimal', icon: MousePointer2, desc: 'Clean & simple' },
    { id: 'blank', name: 'Blank', icon: Eraser, desc: 'Empty canvas' },
    { id: 'custom', name: 'Custom', icon: Code, desc: 'Dev Mode' },
  ];
</script>

{#if showEditor}
  <CustomThemeEditor 
    initialCode={customCode}
    onClose={() => showEditor = false} 
    onSave={(code) => {
      if(onUpdateCustomCode) onUpdateCustomCode(code);
      onSelect('custom');
    }}
  />
{/if}

<div class="space-y-8 animate-fade-in relative">
  <div class="space-y-4">
    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest" for="template-grid">Resume Look & Feel</label>
    <div id="template-grid" class="grid grid-cols-1 gap-4">
      {#each templates as t}
        <button 
          onclick={() => onSelect(t.id)}
          class="group relative flex items-center gap-4 p-4 rounded-3xl border-2 transition-all text-left
          {selectedTemplate === t.id 
            ? 'border-purple-600 bg-purple-50 shadow-lg shadow-purple-100' 
            : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'}"
        >
          <div class="w-16 h-20 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col p-1.5 group-hover:scale-105 transition-transform shrink-0">
            {#if t.id === 'classic'}
               <div class="w-2/3 h-1.5 bg-slate-900 mb-0.5"></div>
               <div class="w-1/3 h-1 bg-blue-600 mb-2"></div>
               <div class="flex gap-1 h-full">
                 <div class="w-1/4 h-full bg-slate-100 rounded-sm"></div>
                 <div class="flex-1 space-y-1">
                   <div class="w-full h-1 bg-slate-50"></div>
                   <div class="w-full h-1 bg-slate-50"></div>
                   <div class="w-full h-1 bg-slate-50"></div>
                 </div>
               </div>
            {:else if t.id === 'modern'}
               <div class="flex h-full gap-1">
                 <div class="w-1/3 h-full bg-slate-900 flex flex-col items-center pt-2">
                   <div class="w-4 h-4 bg-slate-700 rounded-full mb-2"></div>
                   <div class="w-4 h-0.5 bg-slate-700 mb-1"></div>
                   <div class="w-4 h-0.5 bg-slate-700"></div>
                 </div>
                 <div class="flex-1 h-full bg-white space-y-1.5 py-2 px-1">
                   <div class="w-3/4 h-1.5 bg-slate-100"></div>
                   <div class="w-full h-1 bg-slate-50"></div>
                   <div class="w-full h-1 bg-slate-50"></div>
                   <div class="w-full h-1 bg-slate-50"></div>
                 </div>
               </div>
            {:else if t.id === 'minimal'}
               <div class="px-2 py-2 flex flex-col items-center h-full">
                 <div class="w-1/2 h-2 bg-slate-100 mb-3"></div>
                 <div class="w-full h-1 bg-slate-50 mb-1"></div>
                 <div class="w-full h-1 bg-slate-50 mb-1"></div>
                 <div class="w-full h-1 bg-slate-50 mb-4"></div>
                 <div class="grid grid-cols-2 gap-1 w-full">
                   <div class="h-4 bg-slate-50"></div>
                   <div class="h-4 bg-slate-50"></div>
                 </div>
               </div>
            {:else}
               <div class="h-full w-full bg-slate-50/50 border-2 border-dashed border-slate-200 rounded flex items-center justify-center">
                 <Eraser size={16} class="text-slate-200" />
               </div>
            {/if}
          </div>
          <div class="flex-1">
            <p class="text-sm font-black text-slate-800">{t.name}</p>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.desc}</p>
          </div>
          {#if selectedTemplate === t.id}
            <div class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-md shadow-purple-200">
               <ChevronRight size={14} />
            </div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div class="space-y-4 pt-4 border-t border-slate-100">
    <div class="flex items-center gap-2 text-slate-400">
      <Hammer size={14} />
      <span class="text-[10px] font-black uppercase tracking-widest">Studio Developer Tools</span>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <a 
        href="/documentation"
        class="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-slate-300 transition-all group"
      >
        <div class="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform text-indigo-500">
          <Database size={18} />
        </div>
        <span class="text-[10px] font-bold text-slate-600">Data Schema</span>
      </a>

      <button 
        onclick={() => showEditor = true}
        class="flex flex-col items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-white hover:border-slate-300 transition-all group"
      >
        <div class="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform text-pink-500">
          <Code size={18} />
        </div>
        <span class="text-[10px] font-bold text-slate-600">Code Editor</span>
      </button>
    </div>
  </div>

  <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100">
     <p class="text-[10px] text-amber-700 font-bold leading-relaxed">
       <Sparkles size={10} class="inline mr-1" /> Custom fonts and color accents joining the party soon.
     </p>
  </div>
</div>
