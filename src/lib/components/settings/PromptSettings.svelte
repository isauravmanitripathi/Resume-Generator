<script lang="ts">
  import { onMount } from 'svelte';
  import { promptDb, type PromptTemplate, DEFAULT_PROMPTS } from '$lib/promptDb';
  import { Sparkles, Save, RotateCcw, ChevronRight, MessageSquare, Info } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  let prompts = $state<PromptTemplate[]>([]);
  let selectedId = $state<string | null>(null);
  let selectedPrompt = $derived(prompts.find(p => p.id === selectedId) || null);
  let saving = $state(false);

  onMount(async () => {
    await loadPrompts();
  });

  async function loadPrompts() {
    prompts = await promptDb.prompts.toArray();
  }

  async function handleSave() {
    if (!selectedPrompt) return;
    saving = true;
    
    // Create a plain object for saving (Dexie doesn't like Svelte proxies in bulkUpdate/put sometimes)
    const toSave = { ...$state.snapshot(selectedPrompt), lastUpdated: Date.now(), isCustom: true };
    await promptDb.prompts.put(toSave);
    
    setTimeout(() => { 
      saving = false; 
      loadPrompts();
    }, 500);
  }

  async function restoreDefault() {
    if (!selectedId || !DEFAULT_PROMPTS[selectedId]) return;
    
    const original = DEFAULT_PROMPTS[selectedId];
    const restored: PromptTemplate = {
      ...original,
      lastUpdated: Date.now()
    };
    
    await promptDb.prompts.put(restored);
    await loadPrompts();
  }
</script>

<div class="grid grid-cols-12 gap-8 h-[600px]">
  <!-- Prompt List -->
  <aside class="col-span-4 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
    <div class="p-4 border-b border-slate-100 bg-slate-50/50">
       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Library</span>
    </div>
    <div class="flex-1 overflow-y-auto">
      {#each prompts as p}
        <button 
          onclick={() => selectedId = p.id}
          class="w-full p-4 border-b border-slate-50 text-left transition-all hover:bg-slate-50 group flex items-center justify-between
          {selectedId === p.id ? 'bg-blue-50/50 border-blue-100' : ''}"
        >
          <div>
            <p class="text-xs font-bold {selectedId === p.id ? 'text-blue-600' : 'text-slate-700'}">{p.name}</p>
            <p class="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{p.description}</p>
          </div>
          <ChevronRight size={14} class="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>
      {/each}
    </div>
  </aside>

  <!-- Editor -->
  <main class="col-span-8 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
    {#if selectedPrompt}
      <div class="flex-1 flex flex-col overflow-hidden" in:fade={{ duration: 200 }}>
        <!-- Editor Header -->
        <header class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
             <div class="p-2 bg-purple-50 text-purple-600 rounded-xl">
               <Sparkles size={18} />
             </div>
             <div>
               <h3 class="text-sm font-bold text-slate-800">{selectedPrompt.name}</h3>
               {#if selectedPrompt.isCustom}
                 <span class="text-[8px] font-black text-purple-500 uppercase tracking-widest bg-purple-50 px-1.5 py-0.5 rounded">Modified</span>
               {:else}
                 <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">Default</span>
               {/if}
             </div>
          </div>

          <div class="flex items-center gap-2">
            <button 
              onclick={restoreDefault}
              class="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              title="Restore to default"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onclick={handleSave}
              disabled={saving}
              class="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all disabled:opacity-50"
            >
              {#if saving}
                <RotateCcw size={14} class="animate-spin" />
              {:else}
                <Save size={14} />
              {/if}
              Save
            </button>
          </div>
        </header>

        <!-- Editor Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={12} /> System Instructions
            </label>
            <textarea 
               bind:value={prompts[prompts.findIndex(p => p.id === selectedId)].systemPrompt}
               class="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono leading-relaxed"
            ></textarea>
          </div>

          <div class="space-y-2">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span class="w-3 h-3 border-2 border-slate-300 rounded-sm"></span> User Template
            </label>
            <textarea 
               bind:value={prompts[prompts.findIndex(p => p.id === selectedId)].userPromptTemplate}
               class="w-full h-48 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono leading-relaxed"
            ></textarea>
            <div class="bg-blue-50/50 p-3 rounded-xl border border-blue-50 flex items-start gap-3">
              <Info size={14} class="text-blue-500 mt-0.5 shrink-0" />
              <p class="text-[9px] text-blue-700 leading-normal">
                Use <code class="bg-blue-100 px-1 rounded">{"{{variableName}}"}</code> placeholders. These will be swapped with actual data during generation.
              </p>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <MessageSquare size={32} class="text-slate-300" />
        </div>
        <p class="text-sm font-bold text-slate-400">Select a prompt template from the library to begin customizing.</p>
      </div>
    {/if}
  </main>
</div>
