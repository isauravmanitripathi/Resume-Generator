<script lang="ts">
  import type { Profile } from '$lib/db';
  import IframeRenderer from './IframeRenderer.svelte';
  import CreativeStudio from './creative/CreativeStudio.svelte';
  import ExecutiveTemplate from './templates/ExecutiveTemplate.svelte';
  import { 
    Briefcase, GraduationCap, Award, MapPin, 
    Smartphone, Mail, Linkedin, Github, Globe, Download, Printer, Loader2
  } from 'lucide-svelte';

  interface Props {
    profile: Profile;
    templateId: string;
    customCode?: string;
  }

  let { profile, templateId, customCode } = $props<Props>();
  let isDownloading = $state(false);

  async function handleDownload() {
    if (isDownloading) return;
    isDownloading = true;

    // Give UI time to paint the loading state
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Dynamic import
      const html2pdf = (await import('html2pdf.js')).default;
      
      let element: HTMLElement;
      
      if (templateId === 'custom') {
        // For Custom Templates, strictly capture the iframe content
        const iframe = document.querySelector('iframe[title="Resume Canvas"]') as HTMLIFrameElement;
        // @ts-ignore
        element = iframe?.contentDocument?.documentElement || iframe?.contentDocument?.body;
        
        if (!element) throw new Error("Could not access custom template content");
      } else {
        element = document.getElementById('resume-preview') as HTMLElement;
      }

      // Optimized settings
      const opt = {
        margin:       0,
        filename:     `${profile.basics.firstName}_${profile.basics.lastName}_Resume.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, // Restoring higher quality (scale 1 is too blurry for text sometimes, let's try 2 safely or 1.5)
          useCORS: true, 
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();

    } catch (e) {
      console.error('PDF Gen Error', e);
      // Last resort fallback
      if (templateId === 'custom') {
         const iframe = document.querySelector('iframe[title="Resume Canvas"]') as HTMLIFrameElement;
         iframe?.contentWindow?.print();
      } else {
         window.print();
      }
    } finally {
      isDownloading = false;
    }
  }
</script>

<div class="fixed bottom-8 right-8 z-50 print:hidden animate-fade-in flex flex-col gap-2" data-html2canvas-ignore="true">
  <button 
    onclick={handleDownload}
    disabled={isDownloading}
    class="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:bg-black hover:scale-105 transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
  >
    {#if isDownloading}
      <Loader2 size={16} class="animate-spin" />
      <span>Generating...</span>
    {:else}
      <Download size={16} />
      <span>Download PDF</span>
    {/if}
  </button>
</div>

<!-- Print Styles (Native Fallback) -->
<svelte:head>
  <style>
    @media print {
      body * {
        visibility: hidden;
      }
      #resume-preview, #resume-preview * {
        visibility: visible;
      }
      #resume-preview {
        position: fixed !important; /* Fixed ensures it overlays everything at top-left */
        left: 0;
        top: 0;
        z-index: 9999;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
      }
      @page {
        margin: 0;
        size: A4;
      }
    }
  </style>
</svelte:head>

{#if templateId === 'custom'}
  <div class="h-full flex items-center justify-center py-4">
     <IframeRenderer html={customCode || ''} {profile} />
  </div>

{:else if templateId === 'blank'}
  <!-- Creative Studio (Drag & Drop) -->
  <CreativeStudio {profile} />

{:else}
  <!-- Standard Templates (Classic / Modern / Minimal) -->
  <div id="resume-preview" class="bg-white shadow-2xl mx-auto text-slate-800 font-sans overflow-y-auto relative print:shadow-none" 
       style="width: 210mm; height: 297mm; min-width: 210mm; min-height: 297mm;">

  {#if templateId === 'classic'}
    <!-- Classic Template -->
    <div class="p-10">
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

      {#if profile.basics.summary}
        <section class="mb-10">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Professional Profile</h3>
          <p class="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{profile.basics.summary}</p>
        </section>
      {/if}

      <div class="grid grid-cols-12 gap-10">
        <div class="col-span-4 space-y-8">
          <section>
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Award size={14} /> Skills
            </h3>
            <div class="flex flex-wrap gap-2">
              {#each profile.skills as skill}
                <span class="px-2 py-1 bg-slate-50 border border-slate-100 rounded text-[10px] font-bold text-slate-700">{skill.name}</span>
              {/each}
            </div>
          </section>

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

        <div class="col-span-8 space-y-8">
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
                    <p class="text-[10px] text-slate-400 font-medium mt-0.5">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <p class="text-[11px] leading-relaxed text-slate-600 mt-2 italic">{exp.raw_context?.slice(0, 200)}...</p>
                </div>
              {/each}
            </div>
          </section>
        </div>
      </div>
    </div>

  {:else if templateId === 'modern'}
    <!-- Modern Template -->
    <div class="flex min-h-[297mm]">
      <!-- Dark Sidebar -->
      <aside class="w-1/3 bg-slate-900 text-white p-8">
        <div class="mb-12">
          <h1 class="text-3xl font-bold mb-1 leading-tight">{profile.basics.firstName}<br/>{profile.basics.lastName}</h1>
          <p class="text-blue-400 text-sm font-bold tracking-widest uppercase">{profile.basics.title}</p>
        </div>

        <div class="space-y-8">
          <section>
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Contact</h3>
            <div class="space-y-3 text-xs text-slate-300">
              {#if profile.basics.email}<p class="flex items-center gap-3"><Mail size={14} class="text-blue-400" /> {profile.basics.email}</p>{/if}
              {#if profile.basics.phone}<p class="flex items-center gap-3"><Smartphone size={14} class="text-blue-400" /> {profile.basics.phone}</p>{/if}
              {#if profile.basics.city}<p class="flex items-center gap-3"><MapPin size={14} class="text-blue-400" /> {profile.basics.city}, {profile.basics.state}</p>{/if}
            </div>
          </section>

          <section>
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Expertise</h3>
            <div class="flex flex-wrap gap-2">
              {#each profile.skills as skill}
                <span class="px-2 py-1 bg-slate-800 rounded text-[10px] font-medium text-slate-200">{skill.name}</span>
              {/each}
            </div>
          </section>

          <section>
            <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Education</h3>
            <div class="space-y-5">
              {#each profile.education as edu}
                <div>
                  <p class="text-xs font-bold text-white">{edu.studyType}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{edu.institution}</p>
                </div>
              {/each}
            </div>
          </section>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-10 bg-white">
        {#if profile.basics.summary}
          <section class="mb-12">
            <h2 class="text-lg font-bold text-slate-900 mb-4 border-b-2 border-slate-900 pb-2 inline-block">Profile</h2>
            <p class="text-sm leading-relaxed text-slate-600">{profile.basics.summary}</p>
          </section>
        {/if}

        <section>
          <h2 class="text-lg font-bold text-slate-900 mb-8 border-b-2 border-slate-900 pb-2 inline-block">Experience</h2>
          <div class="space-y-10">
            {#each profile.experience as exp}
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-base font-bold text-slate-900">{exp.role}</h4>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p class="text-sm font-bold text-blue-600 mb-2">{exp.company}</p>
                <p class="text-sm leading-relaxed text-slate-600">{exp.raw_context?.slice(0, 250)}...</p>
              </div>
            {/each}
          </div>
        </section>
      </main>
    </div>

  {:else if templateId === 'minimal'}
    <!-- Minimal Template -->
    <div class="p-16 max-w-[180mm] mx-auto">
      <header class="mb-12">
        <h1 class="text-3xl font-light text-slate-900 mb-1">{profile.basics.firstName} <span class="font-bold">{profile.basics.lastName}</span></h1>
        <p class="text-slate-500 font-medium tracking-widest text-xs uppercase mb-6">{profile.basics.title}</p>
        <div class="flex gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span>{profile.basics.email}</span>
          <span>{profile.basics.city}</span>
          <span>{profile.socials.website?.replace('https://', '')}</span>
        </div>
      </header>

      <section class="mb-12">
        <p class="text-sm leading-relaxed text-slate-500">{profile.basics.summary}</p>
      </section>

      <section class="mb-12">
        <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Experience</h2>
        <div class="space-y-12">
          {#each profile.experience as exp}
            <div class="grid grid-cols-4 gap-4">
              <div class="text-[10px] font-bold text-slate-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
              <div class="col-span-3">
                <h4 class="text-sm font-bold text-slate-800">{exp.role}</h4>
                <p class="text-xs text-slate-500 mb-2">{exp.company}</p>
                <p class="text-xs leading-relaxed text-slate-400">{exp.raw_context?.slice(0, 180)}...</p>
              </div>
            </div>
          {/each}
        </div>
      </section>

      <div class="grid grid-cols-2 gap-12">
        <section>
          <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Skills</h2>
          <div class="space-y-2">
            {#each profile.skills as skill}
              <p class="text-xs text-slate-500 font-medium">• {skill.name}</p>
            {/each}
          </div>
        </section>
        <section>
          <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6">Education</h2>
          {#each profile.education as edu}
            <div class="mb-4">
              <p class="text-xs font-bold text-slate-700">{edu.studyType}</p>
              <p class="text-[10px] text-slate-400">{edu.institution}</p>
            </div>
          {/each}
        </section>
      </div>
    </div>

    {:else if templateId === 'executive'}
      <ExecutiveTemplate {profile} />
  {/if}
  </div>
{/if}
