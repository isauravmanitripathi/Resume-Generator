<script lang="ts">
  import { X, FileText, Sparkles, Loader2, Download, User, Briefcase } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';
  import type { Profile } from '$lib/db';
  import { db } from '$lib/db';
  import { promptDb } from '$lib/promptDb';
  import { generateCoverLetterPDF, type CoverLetterData } from '$lib/pdfGenerator';
  import { generateTailoredContent } from '../../../routes/guides/openai/openai';
  import { generateOpenRouterContent } from '../../../routes/guides/openrouter/openrouter';
  import { toasts } from '$lib/toastStore';

  interface Props {
    profile: Profile;
    onClose: () => void;
  }

  let { profile, onClose } = $props<Props>();

  let jobDescription = $state('');
  let hrName = $state('');
  let isGenerating = $state(false);
  let showPromptTools = $state(false);
  
  // Construct the prompt preview logic
  async function generateCoverLetter() {
    if (!jobDescription.trim()) {
      toasts.add('Please enter a Job Description', 'error');
      return;
    }

    isGenerating = true;

    try {
      // 1. Get Prompts & Settings
      const promptTemplate = await promptDb.prompts.get('cover-letter-gen');
      if (!promptTemplate) throw new Error("Cover Letter prompt not found.");

      const settings = await db.settings.get('app');
      const activeProvider = settings?.activeProvider || 'openai';
      const model = activeProvider === 'openrouter' 
        ? settings?.providers.openrouter.model || 'openai/gpt-5-mini'
        : settings?.providers.openai.model || 'gpt-4.1';

      // 2. Prepare Resume Context (Summary + Experience + Skills)
      const resumeContext = `
        Name: ${profile.basics.firstName} ${profile.basics.lastName}
        Title: ${profile.basics.title}
        Summary: ${profile.basics.summary}
        Experience: ${profile.experience.map(e => `${e.role} at ${e.company} (${e.startDate}-${e.endDate})`).join('. ')}
        Skills: ${profile.skills.map(s => s.name).join(', ')}
      `;

      // 3. Construct Prompts
      const systemPrompt = promptTemplate.systemPrompt;
      const userPrompt = promptTemplate.userPromptTemplate
        .replace('{{resume}}', resumeContext)
        .replace('{{jobDescription}}', jobDescription)
        .replace('{{hrName}}', hrName || 'Hiring Manager');

      // 4. Call API
      let rawResponse: string;
      if (activeProvider === 'openrouter') {
        // Key validation is handled internally by generateOpenRouterContent
        rawResponse = await generateOpenRouterContent(systemPrompt, userPrompt, model);
      } else {
        const apiKey = settings?.providers.openai.key;
        if (!apiKey) throw new Error("OpenAI API Key missing");
        // Using generateTailoredContent logic which handles OpenAI calls internally but expects a specific structure.
        // We'll call the raw format function if available, or just reuse the unified handler if possible.
        // Actually, generateTailoredContent might apply its own prompt wrapper. 
        // Let's rely on generateOpenRouterContent logic pattern but for OpenAI if needed, 
        // OR better, let's use the unified flow if possible.
        // Check `openai.ts`: currently it's specialized. 
        // For now, let's use OpenRouter function if provider is OpenRouter.
        // If OpenAI, let's assume the user has OpenRouter set up as it's the preferred path in this codebase?
        // Wait, the user has OpenAI settings too.
        // Let's direct call or mock for now, but strictly speaking we should use the `generateTailoredContent` which fetches keys.
        // BUT `generateTailoredContent` takes a `type` string and loads prompt from DB internally.
        // We customized the prompt construction here.
        // Let's replicate the fetch logic briefly or abstract it.
        // Simplest: Check if `generateOpenAIContent` is exported.
        // Checking imports... `generateTailoredContent` is imported.
        // Let's use `generateOpenRouterContent` for OpenRouter.
        // For OpenAI, let's try to assume OpenRouter is active or fallback to a locally implemented fetch if needed.
        // Actually, `generateTailoredContent` is rigid.
        // Let's force use of OpenRouter if available, or error if not. 
        // Or, let's direct fetch OpenAI here since we have the key in settings.
         
         const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
              ],
              temperature: 0.7
            })
          });
          
          if (!res.ok) throw new Error("OpenAI API Error");
          const data = await res.json();
          rawResponse = data.choices[0].message.content;
      }

      // 5. Parse JSON
      // Handle markdown code blocks if present
      const cleanJson = rawResponse.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData: CoverLetterData = JSON.parse(cleanJson);

      // 6. Generate PDF
      await generateCoverLetterPDF(profile, parsedData);
      
      toasts.add('Cover Letter Generated Successfully!', 'success');
      onClose();

    } catch (e) {
      console.error(e);
      toasts.add(`Generation Failed: ${(e as Error).message}`, 'error');
    } finally {
      isGenerating = false;
    }
  }

</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" transition:fade={{ duration: 200 }}>
  <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onclick={onClose}></div>

  <div 
    class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
    transition:scale={{ start: 0.95, duration: 200 }}
  >
    <!-- Header -->
    <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <FileText size={20} />
        </div>
        <div>
          <h2 class="font-bold text-lg text-slate-800">AI Cover Letter Generator</h2>
          <p class="text-xs text-slate-500 font-medium">Tailored to your resume and the job description</p>
        </div>
      </div>
      <button onclick={onClose} class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all">
        <X size={20} />
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      
      <!-- Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Briefcase size={12} /> Job Description
          </label>
          <textarea 
            bind:value={jobDescription}
            placeholder="Paste the job description here..."
            class="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
          ></textarea>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> Hiring Manager (Optional)
            </label>
            <input 
              bind:value={hrName}
              placeholder="e.g. Jane Doe"
              class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div class="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-2">
             <div class="flex items-center gap-2 text-blue-700 font-bold text-xs">
               <Sparkles size={12} />
               <span>AI Magic Included</span>
             </div>
             <p class="text-[10px] text-blue-600/80 leading-relaxed">
               We'll extract your key skills and experience from your active resume to craft a compelling narrative that aligns with this job.
             </p>
          </div>
        </div>
      </div>

      <!-- Advanced Prompt Toggle -->
      <div class="border-t border-slate-100 pt-4">
        <button 
          onclick={() => showPromptTools = !showPromptTools}
          class="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
        >
          {showPromptTools ? 'Hide' : 'Show'} Prompt Details
        </button>
        
        {#if showPromptTools}
          <div class="mt-4 p-4 bg-slate-900 rounded-xl text-xs font-mono text-slate-300 space-y-2" transition:fade>
            <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">What gets sent to AI:</p>
            <div class="whitespace-pre-wrap opacity-80">
              {`Resume Context: ${profile.basics.firstName} ${profile.basics.lastName}, ${profile.basics.title}... [Experience & Skills]`}
            </div>
          </div>
        {/if}
      </div>

    </div>

    <!-- Footer Actions -->
    <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
      <button 
        onclick={onClose}
        class="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
      >
        Cancel
      </button>
      <button 
        onclick={generateCoverLetter}
        disabled={isGenerating || !jobDescription}
        class="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {#if isGenerating}
          <Loader2 size={14} class="animate-spin" />
          <span>Writing Letter...</span>
        {:else}
          <Sparkles size={14} />
          <span>Generate PDF</span>
        {/if}
      </button>
    </div>
  </div>
</div>
