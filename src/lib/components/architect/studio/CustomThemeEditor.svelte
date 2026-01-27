<script lang="ts">
  import { X, Code, Play, AlertCircle, Save, Trash2, FileCode, Plus } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';
  import { db, type CustomTemplate } from '$lib/db';
  import { onMount } from 'svelte';

  interface Props {
    onClose: () => void;
    onSave: (code: string) => void;
    initialCode?: string;
  }

  let { onClose, onSave, initialCode = '' } = $props<Props>();

  const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 2rem; color: #333; }
    h1 { margin-bottom: 0.5rem; }
    .job { margin-bottom: 1.5rem; border-left: 4px solid #3b82f6; padding-left: 1rem; }
    .date { color: #64748b; font-size: 0.9rem; margin-bottom: 0.25rem; }
  </style>
</head>
<body>
  <div id="app">Loading Profile...</div>

  <script>
    async function render() {
      // 1. Fetch Profile Data (Mock API)
      const res = await fetch('/api/profile');
      const profile = await res.json();

      // 2. Build HTML
      const html = \`
        <h1>\${profile.basics.firstName} \${profile.basics.lastName}</h1>
        <p class="lead">\${profile.basics.title}</p>
        <p>\${profile.basics.summary}</p>
        <hr style="margin: 2rem 0; border:none; border-top:1px solid #eee;" />
        
        <h2>Experience</h2>
        \${profile.experience.map(exp => \`
          <div class="job">
            <h3>\${exp.role} <span>at \${exp.company}</span></h3>
            <p class="date">\${exp.startDate} - \${exp.current ? 'Present' : exp.endDate}</p>
            <p>\${exp.raw_context || ''}</p>
          </div>
        \`).join('')}
      \`;

      // 3. Render
      document.getElementById('app').innerHTML = html;
    }

    render();
  <\/script>
</body>
</html>`;

  let code = $state(initialCode || defaultTemplate);
  let savedTemplates = $state<CustomTemplate[]>([]);
  let templateName = $state('');

  onMount(async () => {
    loadTemplates();
  });

  async function loadTemplates() {
    savedTemplates = await db.customTemplates.orderBy('updated').reverse().toArray();
  }

  $effect(() => {
    if (initialCode) {
      code = initialCode;
    }
  });

  function handleApply() {
    onSave(code);
    onClose();
  }

  async function handleSaveToLibrary() {
    const name = prompt('Name your template:', templateName || 'My New Template');
    if (!name) return;

    const id = crypto.randomUUID();
    await db.customTemplates.put({
      id,
      name,
      code,
      created: Date.now(),
      updated: Date.now()
    });
    
    await loadTemplates();
    alert('Template saved to library!');
  }

  async function loadTemplate(t: CustomTemplate) {
    if (confirm('Load this template? Unsaved changes will be lost.')) {
      code = t.code;
      templateName = t.name;
    }
  }

  async function deleteTemplate(id: string) {
    if (confirm('Delete this template permanently?')) {
      await db.customTemplates.delete(id);
      await loadTemplates();
    }
  }
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
    class="relative w-full max-w-6xl h-[90vh] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-700"
    transition:fly={{ y: 20, duration: 300, delay: 100 }}
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900 shrink-0">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
          <Code size={20} />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-200">Custom Template Editor</h2>
          <p class="text-xs text-slate-500 font-medium">Pure Mode: Write standard HTML & JavaScript.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
         <button 
          onclick={handleSaveToLibrary}
          class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-slate-700"
        >
          <Save size={14} />
          Save to Library
        </button>
        <div class="w-px h-6 bg-slate-700 mx-2"></div>
        <button 
          onclick={handleApply}
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <Play size={14} />
          Apply & Render
        </button>
        <button 
          onclick={onClose}
          class="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="flex-1 flex overflow-hidden">
       <!-- Sidebar: Saved Templates -->
       <div class="w-64 bg-slate-900/50 border-r border-slate-800 flex flex-col shrink-0">
          <div class="p-4 border-b border-slate-800">
             <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileCode size={12} /> Library
             </h3>
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-1">
             <button onclick={() => code = defaultTemplate} class="w-full text-left p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all group flex items-center justify-between">
                <span class="text-xs font-medium">Reset / Default</span>
                <Plus size={12} class="opacity-0 group-hover:opacity-100" />
             </button>
             
             {#each savedTemplates as t}
               <div class="group flex items-center gap-1 p-2 rounded-xl hover:bg-slate-800 transition-colors">
                  <button onclick={() => loadTemplate(t)} class="flex-1 text-left">
                     <p class="text-xs font-bold text-slate-300 group-hover:text-white truncate">{t.name}</p>
                     <p class="text-[10px] text-slate-500">{new Date(t.updated).toLocaleDateString()}</p>
                  </button>
                  <button onclick={() => deleteTemplate(t.id)} class="p-1.5 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                     <Trash2 size={12} />
                  </button>
               </div>
             {/each}

             {#if savedTemplates.length === 0}
               <div class="p-4 text-center mt-10">
                 <p class="text-[10px] text-slate-600 italic">No saved templates yet.<br/>Save your work to see it here.</p>
               </div>
             {/if}
          </div>
       </div>

       <!-- Editor Surface -->
       <div class="flex-1 flex flex-col relative bg-slate-900">
          <div class="flex-1 flex">
            <!-- Line Numbers (Fake for visual) -->
            <div class="w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-end py-6 pr-3 text-slate-600 font-mono text-xs select-none">
              {#each Array(30) as _, i}
                <div>{i + 1}</div>
              {/each}
              <div>...</div>
            </div>

            <!-- Textarea -->
            <textarea 
              bind:value={code}
              class="flex-1 bg-slate-900 text-slate-300 font-mono text-xs p-6 outline-none resize-none leading-relaxed"
              spellcheck="false"
              placeholder="<html>...</html>"
            ></textarea>
          </div>
       </div>
    </div>

    <!-- Footer Status -->
    <div class="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
      <AlertCircle size={12} />
      <span>Standard Sandbox. Use &lt;script&gt; to fetch /api/profile. Changes are local until applied.</span>
    </div>
  </div>
</div>
