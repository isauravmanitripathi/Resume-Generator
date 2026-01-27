<script lang="ts">
  import { Sparkles } from 'lucide-svelte';

  interface Props {
    jobDescription: string;
    isGenerating: boolean;
    onGenerate: () => void;
  }

  let { jobDescription = $bindable(), isGenerating, onGenerate } = $props<Props>();
</script>

<div class="space-y-6">
  <div class="space-y-3">
    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest" for="jd">Target Job Description</label>
    <textarea 
      id="jd"
      bind:value={jobDescription}
      placeholder="Paste the target job description here..."
      class="w-full h-[400px] p-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none shadow-inner"
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
