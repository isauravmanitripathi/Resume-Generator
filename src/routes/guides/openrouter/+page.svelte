<script lang="ts">
  import { ArrowLeft, Key, ExternalLink } from 'lucide-svelte';
</script>

<div class="p-8 max-w-3xl mx-auto">
  <a href="/settings" class="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 text-sm font-medium transition-colors">
    <ArrowLeft size={16} />
    Back to Settings
  </a>

  <header class="mb-10">
    <div class="flex items-center gap-4 mb-4">
      <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">OR</div>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">OpenRouter Setup</h1>
        <p class="text-slate-500">Access 100+ AI models with a single API key</p>
      </div>
    </div>
  </header>

  <div class="space-y-8">
    <section class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Key size={20} class="text-purple-600" />
        Getting Your API Key
      </h2>

      <ol class="space-y-4 text-slate-600">
        <li class="flex gap-3">
          <span class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
          <div>
            <p class="font-medium text-slate-800">Create an OpenRouter account</p>
            <p class="text-sm text-slate-500">Go to <a href="https://openrouter.ai" target="_blank" class="text-purple-600 hover:underline">openrouter.ai</a> and sign up for free.</p>
          </div>
        </li>
        <li class="flex gap-3">
          <span class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
          <div>
            <p class="font-medium text-slate-800">Navigate to API Keys</p>
            <p class="text-sm text-slate-500">Click on your profile → Settings → API Keys</p>
          </div>
        </li>
        <li class="flex gap-3">
          <span class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
          <div>
            <p class="font-medium text-slate-800">Generate a new key</p>
            <p class="text-sm text-slate-500">Click "Create Key" and copy your new API key.</p>
          </div>
        </li>
        <li class="flex gap-3">
          <span class="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
          <div>
            <p class="font-medium text-slate-800">Add credits (optional)</p>
            <p class="text-sm text-slate-500">Some models are free; add credits for premium models.</p>
          </div>
        </li>
      </ol>

      <a 
        href="https://openrouter.ai/settings/keys" 
        target="_blank"
        class="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
      >
        Get API Key <ExternalLink size={16} />
      </a>
    </section>

    <section class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-3">Why OpenRouter?</h2>
      <ul class="space-y-2 text-sm text-slate-600">
        <li class="flex items-start gap-2">
          <span class="text-purple-600 font-bold">✓</span>
          <span><strong>100+ Models</strong> — Access OpenAI, Anthropic, Google, Meta, Mistral, and more</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-purple-600 font-bold">✓</span>
          <span><strong>Single API Key</strong> — No need to manage multiple provider accounts</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-purple-600 font-bold">✓</span>
          <span><strong>Free Models</strong> — Many models available at no cost</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-purple-600 font-bold">✓</span>
          <span><strong>Pay-per-use</strong> — Only pay for what you use, no subscriptions</span>
        </li>
      </ul>
    </section>
  </div>
</div>
