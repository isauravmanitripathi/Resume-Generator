<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Profile } from '$lib/db';
  import { 
    Briefcase, GraduationCap, Award, MapPin, 
    Smartphone, Mail, Linkedin, Github, Globe, Sparkles
  } from 'lucide-svelte';

  let profile = $state<Profile | null>(null);
  let jobDescription = $state('');
  let isGenerating = $state(false);

  onMount(async () => {
    const saved = await db.profile.get('master');
    if (saved) {
      profile = saved;
    }
  });

  // Re-fetch data if needed (simple refresh button)
  async function refreshData() {
    const saved = await db.profile.get('master');
    if (saved) profile = saved;
  }
</script>

<div class="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col gap-8">
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
        AI Architect <Sparkles class="text-blue-600" size={24} />
      </h1>
      <p class="text-slate-500">Tailor your master profile to any job description instantly.</p>
    </div>
    
    <button 
      onclick={refreshData}
      class="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
    >
      Sync with Vault
    </button>
  </header>

  <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
    <!-- Left: Inputs -->
    <div class="lg:col-span-5 flex flex-col gap-6">
      <div class="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold text-slate-800 uppercase text-xs tracking-widest">Job Description</h2>
          <span class="text-[10px] text-slate-400 font-medium">Step 1: Paste the JD here</span>
        </div>
        <textarea 
          bind:value={jobDescription}
          placeholder="Paste the target job description here. Our AI will analyze requirements and tailor your highlights..."
          class="flex-1 input-field resize-none py-4"
        ></textarea>
        
        <button 
          class="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group"
          disabled={!jobDescription || isGenerating}
        >
          <Sparkles size={18} class="group-hover:animate-pulse" />
          {isGenerating ? 'Analyzing...' : 'Generate Tailored Content'}
        </button>
      </div>
    </div>

    <!-- Right: Preview -->
    <div class="lg:col-span-7 flex flex-col gap-4">
      <div class="flex items-center justify-between px-2">
        <h2 class="font-bold text-slate-800 uppercase text-xs tracking-widest">Resume Quick View</h2>
        <span class="text-[10px] text-slate-400 font-medium whitespace-nowrap">Your data from the Vault</span>
      </div>

      <div class="flex-1 bg-slate-100/50 rounded-3xl border border-slate-200 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        {#if profile}
          <!-- The Resume Canvas -->
          <div class="bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] p-10 text-slate-800 font-sans">
            <!-- Header -->
            <header class="text-center mb-10">
              <h1 class="text-4xl font-extrabold text-slate-900 mb-2 uppercase tracking-tight">
                {profile.basics.firstName} {profile.basics.lastName}
              </h1>
              <p class="text-blue-600 font-bold mb-4 tracking-wide">{profile.basics.title || 'Professional Title'}</p>
              
              <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500 font-medium">
                {#if profile.basics.email}<span class="flex items-center gap-1.5"><Mail size={14} /> {profile.basics.email}</span>{/if}
                {#if profile.basics.phone}<span class="flex items-center gap-1.5"><Smartphone size={14} /> {profile.basics.phone}</span>{/if}
                {#if profile.basics.city}<span class="flex items-center gap-1.5"><MapPin size={14} /> {profile.basics.city}, {profile.basics.state}</span>{/if}
              </div>

              <div class="flex justify-center gap-4 mt-4">
                {#if profile.socials.linkedin}<a href={profile.socials.linkedin} target="_blank" class="text-slate-400 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>{/if}
                {#if profile.socials.github}<a href={profile.socials.github} target="_blank" class="text-slate-400 hover:text-slate-900 transition-colors"><Github size={18} /></a>{/if}
                {#if profile.socials.website}<a href={profile.socials.website} target="_blank" class="text-slate-400 hover:text-emerald-600 transition-colors"><Globe size={18} /></a>{/if}
              </div>
            </header>

            <!-- Summary -->
            {#if profile.basics.summary}
              <section class="mb-10">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Professional Profile</h3>
                <p class="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{profile.basics.summary}</p>
              </section>
            {/if}

            <div class="grid grid-cols-12 gap-10">
              <!-- Sidebar -->
              <div class="col-span-4 space-y-8">
                <!-- Skills -->
                <section>
                  <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Award size={14} /> Skills
                  </h3>
                  <div class="flex flex-wrap gap-2">
                    {#each profile.skills as skill}
                      <span class="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-700">
                        {skill.name}
                      </span>
                    {/each}
                  </div>
                </section>

                <!-- Education -->
                <section>
                  <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <GraduationCap size={14} /> Education
                  </h3>
                  <div class="space-y-4">
                    {#each profile.education as edu}
                      <div>
                        <p class="text-xs font-bold text-slate-800">{edu.studyType}</p>
                        <p class="text-[10px] text-slate-500">{edu.institution}</p>
                        <p class="text-[9px] text-slate-400 font-medium">{edu.startDate} - {edu.endDate}</p>
                      </div>
                    {/each}
                  </div>
                </section>
              </div>

              <!-- Main Content -->
              <div class="col-span-8 space-y-8">
                <!-- Experience -->
                <section>
                  <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Briefcase size={14} /> Experience
                  </h3>
                  <div class="space-y-8">
                    {#each profile.experience as exp}
                      <div class="relative pl-4 border-l-2 border-slate-100">
                        <div class="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600"></div>
                        <div class="mb-1">
                          <h4 class="text-sm font-bold text-slate-800">{exp.role}</h4>
                          <p class="text-xs font-bold text-blue-600">{exp.company}</p>
                          <p class="text-[10px] text-slate-400 font-medium mt-0.5">
                            {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        <p class="text-[11px] leading-relaxed text-slate-600 mt-2 italic">
                          {exp.raw_context?.slice(0, 200)}...
                        </p>
                      </div>
                    {/each}
                  </div>
                </section>
              </div>
            </div>
          </div>
        {:else}
          <div class="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <div class="bg-white p-6 rounded-full mb-4 shadow-sm">
              <Briefcase size={48} class="text-slate-200" />
            </div>
            <p class="text-lg font-medium text-slate-500">Your Vault is empty</p>
            <p class="text-sm max-w-xs mx-auto mt-2">Go to the Profile Vault to add your experience, education, and skills first.</p>
            <a href="/vault" class="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Open Vault
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .input-field {
    @apply w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400 font-medium;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
</style>
