<script lang="ts">
  import { X, Code, Play, AlertCircle, Save } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

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

  $effect(() => {
    if (initialCode) {
      code = initialCode;
    }
  });

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
          <p class="text-xs text-slate-500 font-medium">Pure Mode: Write standard HTML & JavaScript.</p>
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
        placeholder="<html>...</html>"
      ></textarea>
    </div>

    <!-- Footer Status -->
    <div class="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-500">
      <AlertCircle size={12} />
      <span>Standard Sandbox Environment. Use &lt;script&gt; to fetch data via /api/profile.</span>
    </div>
  </div>
</div>
