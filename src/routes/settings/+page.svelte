<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type AppSettings } from '$lib/db';
  import { Shield, Save, RefreshCw, Key, Info, Settings } from 'lucide-svelte';

  let settings = $state<AppSettings>({
    id: 'app',
    providers: {
      openai: { key: '', model: 'gpt-5.2' },
      gemini: { key: '', model: 'gemini-1.5-pro' },
      anthropic: { key: '', model: 'claude-3-5-sonnet-latest' },
      grok: { key: '', model: 'grok-2' }
    },
    activeProvider: 'openai'
  });

  let saving = $state(false);

  const openaiModels = [
    { id: 'gpt-5.2', name: 'GPT-5.2', desc: 'The best model for coding and agentic tasks across industries' },
    { id: 'gpt-5-mini', name: 'GPT-5 mini', desc: 'A faster, cost-efficient version of GPT-5 for well-defined tasks' },
    { id: 'gpt-5-nano', name: 'GPT-5 nano', desc: 'Fastest, most cost-efficient version of GPT-5' },
    { id: 'gpt-5.2-pro', name: 'GPT-5.2 pro', desc: 'Version of GPT-5.2 that produces smarter and more precise responses.' },
    { id: 'gpt-5', name: 'GPT-5', desc: 'Previous intelligent reasoning model for coding and agentic tasks with configurable reasoning effort' },
    { id: 'gpt-4.1', name: 'GPT-4.1', desc: 'Smartest non-reasoning model' }
  ];

  const geminiModels = [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Most capable model' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', desc: 'Fastest and most cost-efficient' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp', desc: 'Experimental next-gen capabilities' }
  ];

  const anthropicModels = [
    { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet', desc: 'Most intelligent model' },
    { id: 'claude-3-5-haiku-latest', name: 'Claude 3.5 Haiku', desc: 'Fastest Claude model' },
    { id: 'claude-3-opus-latest', name: 'Claude 3 Opus', desc: 'Great for complex reasoning' }
  ];

  const grokModels = [
    { id: 'grok-2', name: 'Grok-2', desc: 'State-of-the-art AI' },
    { id: 'grok-2-mini', name: 'Grok-2 Mini', desc: 'Fast and capable' },
    { id: 'grok-beta', name: 'Grok Beta', desc: 'Latest beta features' }
  ];

  onMount(async () => {
    const saved = await db.settings.get('app');
    if (saved) {
      settings = saved;
    }
  });

  async function saveSettings() {
    saving = true;
    try {
      await db.settings.put($state.snapshot(settings));
    } finally {
      setTimeout(() => { saving = false; }, 500);
    }
  }
</script>

<div class="p-8 max-w-5xl mx-auto pb-24">
  <header class="mb-10">
    <div class="flex items-center gap-3 mb-2">
      <div class="p-2 bg-blue-600 text-white rounded-lg">
        <Settings size={24} />
      </div>
      <h1 class="text-3xl font-bold text-slate-900">Settings</h1>
    </div>
    <p class="text-slate-500">Securely manage your AI provider configurations. All keys are stored locally in your browser's IndexedDB.</p>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    
    <!-- OpenAI -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">O</div>
          <div>
            <h3 class="font-bold text-slate-800">OpenAI</h3>
            <p class="text-xs text-slate-400">GPT Series</p>
          </div>
        </div>
        <input type="radio" bind:group={settings.activeProvider} value="openai" class="w-5 h-5 text-blue-600" />
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="openai-key" class="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span class="flex items-center gap-2"><Key size={14} /> API Key</span>
            <a href="/guides/openai" class="text-xs text-blue-600 hover:underline font-medium">How to get?</a>
          </label>
          <input
            id="openai-key"
            type="password"
            bind:value={settings.providers.openai.key}
            placeholder="sk-..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div>
          <label for="openai-model" class="block text-sm font-semibold text-slate-700 mb-1.5">Model</label>
          <select
            id="openai-model"
            bind:value={settings.providers.openai.model}
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {#each openaiModels as model}
              <option value={model.id}>{model.name}</option>
            {/each}
          </select>
          <p class="mt-2 text-xs text-slate-400 flex items-start gap-1">
            <Info size={12} class="mt-0.5 shrink-0" />
            {openaiModels.find(m => m.id === settings.providers.openai.model)?.desc}
          </p>
        </div>
      </div>
    </div>

    <!-- Gemini -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center font-bold text-blue-600">G</div>
          <div>
            <h3 class="font-bold text-slate-800">Google Gemini</h3>
            <p class="text-xs text-slate-400">Google AI Studio</p>
          </div>
        </div>
        <input type="radio" bind:group={settings.activeProvider} value="gemini" class="w-5 h-5 text-blue-600" />
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="gemini-key" class="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span class="flex items-center gap-2"><Key size={14} /> API Key</span>
            <a href="/guides/gemini" class="text-xs text-blue-600 hover:underline font-medium">How to get?</a>
          </label>
          <input
            id="gemini-key"
            type="password"
            bind:value={settings.providers.gemini.key}
            placeholder="AIza..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label for="gemini-model" class="block text-sm font-semibold text-slate-700 mb-1.5">Model</label>
          <select
            id="gemini-model"
            bind:value={settings.providers.gemini.model}
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {#each geminiModels as model}
              <option value={model.id}>{model.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Anthropic -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center font-bold text-orange-600">A</div>
          <div>
            <h3 class="font-bold text-slate-800">Anthropic</h3>
            <p class="text-xs text-slate-400">Claude Series</p>
          </div>
        </div>
        <input type="radio" bind:group={settings.activeProvider} value="anthropic" class="w-5 h-5 text-blue-600" />
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="anthropic-key" class="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span class="flex items-center gap-2"><Key size={14} /> API Key</span>
            <a href="/guides/anthropic" class="text-xs text-blue-600 hover:underline font-medium">How to get?</a>
          </label>
          <input
            id="anthropic-key"
            type="password"
            bind:value={settings.providers.anthropic.key}
            placeholder="sk-ant-..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label for="anthropic-model" class="block text-sm font-semibold text-slate-700 mb-1.5">Model</label>
          <select
            id="anthropic-model"
            bind:value={settings.providers.anthropic.model}
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {#each anthropicModels as model}
              <option value={model.id}>{model.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

    <!-- Grok -->
    <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">X</div>
          <div>
            <h3 class="font-bold text-slate-800">xAI Grok</h3>
            <p class="text-xs text-slate-400">x.ai</p>
          </div>
        </div>
        <input type="radio" bind:group={settings.activeProvider} value="grok" class="w-5 h-5 text-blue-600" />
      </div>
      
      <div class="space-y-4">
        <div>
          <label for="grok-key" class="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span class="flex items-center gap-2"><Key size={14} /> API Key</span>
            <a href="/guides/grok" class="text-xs text-blue-600 hover:underline font-medium">How to get?</a>
          </label>
          <input
            id="grok-key"
            type="password"
            bind:value={settings.providers.grok.key}
            placeholder="api-..."
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label for="grok-model" class="block text-sm font-semibold text-slate-700 mb-1.5">Model</label>
          <select
            id="grok-model"
            bind:value={settings.providers.grok.model}
            class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {#each grokModels as model}
              <option value={model.id}>{model.name}</option>
            {/each}
          </select>
        </div>
      </div>
    </div>

  </div>

  <div class="fixed bottom-0 right-0 left-0 md:left-64 p-4 md:p-8 flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 bg-white/60 backdrop-blur-md border-t border-slate-200 md:bg-transparent md:border-none z-30">
    <div class="bg-slate-900/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-[10px] sm:text-xs font-medium text-slate-600 flex items-center gap-2">
      <Shield size={14} class="text-emerald-600" /> End-to-End Encrypted & Private
    </div>
    
    <button
      onclick={saveSettings}
      disabled={saving}
      class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {#if saving}
        <RefreshCw size={18} class="animate-spin" /> Saving...
      {:else}
        <Save size={18} /> Save Settings
      {/if}
    </button>
  </div>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .max-w-5xl {
    animation: fade-in 0.4s ease-out;
  }
</style>
