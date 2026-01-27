<script lang="ts">
  import { X, Code, Play, AlertCircle, Save } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  interface Props {
    onClose: () => void;
    onSave: (code: string) => void;
    initialCode?: string;
  }

  let { onClose, onSave, initialCode = '' } = $props<Props>();

  let code = $state(initialCode || `<!-- 
  Available Data:
  - profile.basics.firstName
  - profile.experience[]
  - profile.skills[]
  ... and so on.
-->

<div class="p-8 font-sans">
  <h1 class="text-3xl font-bold text-slate-800">
    {profile.basics.firstName} {profile.basics.lastName}
  </h1>
  <p class="text-blue-600">{profile.basics.title}</p>
  
  <hr class="my-4"/>
  
  <div class="grid grid-cols-2 gap-4">
    <div>
      <h2 class="font-bold uppercase text-xs text-slate-400 mb-2">Experience</h2>
      {#each profile.experience as exp}
        <div class="mb-4">
          <p class="font-bold">{exp.role}</p>
          <p class="text-xs text-slate-500">{exp.company}</p>
        </div>
      {/each}
    </div>
    
    <div>
      <h2 class="font-bold uppercase text-xs text-slate-400 mb-2">Skills</h2>
      <div class="flex flex-wrap gap-1">
        {#each profile.skills as skill}
          <span class="px-2 py-1 bg-slate-100 rounded text-xs">
            {skill.name}
          </span>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  /* Add custom CSS here */
  h1 { color: #333; }
</style>`);

  function handleSave() {
    onSave(code);
    onClose();
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
    class="relative w-full max-w-5xl h-[85vh] bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-700"
    transition:fly={{ y: 20, duration: 300, delay: 100 }}
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
          <Code size={20} />
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-200">Custom Template Editor</h2>
          <p class="text-xs text-slate-500 font-medium">Write HTML/Svelte-like syntax to design your own layout.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button 
          onclick={handleSave}
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
        >
          <Play size={14} />
          Render Preview
        </button>
        <button 
          onclick={onClose}
          class="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>

    <!-- Editor Surface -->
    <div class="flex-1 flex relative">
      <!-- Line Numbers (Fake for visual) -->
      <div class="w-12 bg-slate-900 border-r border-slate-800 flex flex-col items-end py-6 pr-3 text-slate-600 font-mono text-xs select-none">
        {#each Array(20) as _, i}
          <div>{i + 1}</div>
        {/each}
        <div>...</div>
      </div>

      <!-- Textarea -->
      <textarea 
        bind:value={code}
        class="flex-1 bg-slate-900 text-slate-300 font-mono text-xs p-6 outline-none resize-none leading-relaxed"
        spellcheck="false"
        placeholder="<div>Your HTML here...</div>"
      ></textarea>
    </div>

    <!-- Footer Status -->
    <div class="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-500">
      <AlertCircle size={12} />
      <span>Supports basic HTML and Svelte-like &#123;#each&#125; blocks. Scripts are disabled for security.</span>
    </div>
  </div>
</div>
