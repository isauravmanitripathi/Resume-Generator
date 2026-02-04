<script lang="ts">
  import type { Profile } from '$lib/db';
  import { downloadResumePDF } from '$lib/pdfGenerator';
  import IframeRenderer from './IframeRenderer.svelte';
  import CreativeStudio from './creative/CreativeStudio.svelte';
  import ExecutiveTemplate from './templates/ExecutiveTemplate.svelte';
  import ElegantTemplate from './templates/ElegantTemplate.svelte';
  import CoverLetterModal from './architect/CoverLetterModal.svelte';
  import { 
    Briefcase, GraduationCap, Award, MapPin, 
    Smartphone, Mail, Linkedin, Github, Globe, Download, Printer, Loader2, Sparkles
  } from 'lucide-svelte';

  interface Props {
    profile: Profile;
    templateId: string;
    customCode?: string;
  }

  let { profile, templateId, customCode } = $props<Props>();
  let isDownloading = $state(false);
  let showCoverLetter = $state(false);

  async function handleDownload() {
    if (isDownloading) return;
    isDownloading = true;
    
    try {
      await downloadResumePDF(profile, templateId);
    } catch (e) {
      console.error('PDF Generation Error:', e);
      alert('PDF generation failed: ' + (e as Error).message);
    } finally {
      isDownloading = false;
    }
  }
</script>

<div class="fixed bottom-8 right-24 z-50 print:hidden animate-fade-in flex flex-row items-center gap-3" data-html2canvas-ignore="true">
  <!-- Cover Letter Button -->
  <button 
    onclick={() => showCoverLetter = true}
    class="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-bold shadow-xl shadow-slate-200/50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 hover:scale-105 transition-all text-xs"
  >
    <Sparkles size={14} />
    <span>Cover Letter</span>
  </button>

  <!-- Download PDF Button -->
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

{#if showCoverLetter}
  <CoverLetterModal 
    {profile} 
    onClose={() => showCoverLetter = false} 
  />
{/if}

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
  <!-- The container shows visual page separations at A4 height intervals -->
  <div id="resume-preview" 
       class="bg-white mx-auto text-slate-800 font-sans relative print:shadow-none resume-pages" 
       style="width: 210mm; min-height: 297mm; min-width: 210mm;">
    
    <style>
      /* Visual page separation for preview */
      .resume-pages {
        background: 
          linear-gradient(to bottom, white 296.5mm, #e2e8f0 296.5mm, #e2e8f0 297mm, white 297mm);
        background-size: 100% 297mm;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      /* Page number indicators (optional visual guide) */
      .resume-pages::after {
        content: '';
        position: absolute;
        top: 297mm;
        left: 0;
        right: 0;
        height: 0.5mm;
        background: repeating-linear-gradient(
          to bottom,
          transparent 0,
          transparent 296.5mm,
          #cbd5e1 296.5mm,
          #cbd5e1 297mm
        );
        pointer-events: none;
      }
      
      /* Comprehensive Print Styles */
      @media print {
        /* Page setup */
        @page {
          size: A4 portrait;
          margin: 10mm;
        }
        
        /* Reset body for print */
        body {
          margin: 0;
          padding: 0;
        }
        
        /* Hide everything except resume */
        body > *:not(.resume-print-container) {
          display: none !important;
        }
        
        /* Resume container - allow natural flow for multi-page */
        #resume-preview {
          position: static !important;
          width: 100% !important;
          max-width: 190mm !important;
          min-height: auto !important;
          height: auto !important;
          overflow: visible !important;
          background: white !important;
          box-shadow: none !important;
          margin: 0 auto;
        }
        
        .resume-pages {
          background: white !important;
          box-shadow: none !important;
          width: 100% !important;
          min-height: auto !important;
          height: auto !important;
        }
        
        .resume-pages::after {
          display: none !important;
        }
        
        /* Page break control - prevent splitting items */
        .avoid-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        
        /* Prevent orphans at page breaks */
        section {
          break-inside: avoid-column;
        }
        
        /* Hide UI elements during print */
        button, nav, header:not(#resume-preview header), 
        [data-html2canvas-ignore], .print\\:hidden {
          display: none !important;
        }
      }
    </style>

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
                <div class="avoid-break" style="break-inside: avoid;">
                  <p class="text-xs font-bold text-slate-800">{edu.studyType}</p>
                  <p class="text-[10px] text-slate-500">{edu.institution}</p>
                  <p class="text-[9px] text-slate-400 font-medium">{edu.startDate} - {edu.endDate}</p>
                  {#if edu.raw_context}
                     <p class="text-[10px] leading-relaxed text-slate-600 mt-1 whitespace-pre-line text-xs">{edu.raw_context}</p>
                  {/if}
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
                <div class="relative pl-4 border-l-2 border-slate-100 avoid-break" style="break-inside: avoid;">
                  <div class="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-600"></div>
                  <div class="mb-1">
                    <h4 class="text-sm font-bold text-slate-800">{exp.role}</h4>
                    <p class="text-xs font-bold text-blue-600">{exp.company}</p>
                    <p class="text-[10px] text-slate-400 font-medium mt-0.5">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <p class="text-[11px] leading-relaxed text-slate-600 mt-2 whitespace-pre-line">{exp.raw_context}</p>
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
                <div class="avoid-break" style="break-inside: avoid;">
                  <p class="text-xs font-bold text-white">{edu.studyType}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{edu.institution}</p>
                  {#if edu.raw_context}
                     <p class="text-[10px] leading-relaxed text-slate-300 mt-2 whitespace-pre-line">{edu.raw_context}</p>
                  {/if}
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
              <div class="avoid-break" style="break-inside: avoid;">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-base font-bold text-slate-900">{exp.role}</h4>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p class="text-sm font-bold text-blue-600 mb-2">{exp.company}</p>
                <p class="text-sm leading-relaxed text-slate-600 whitespace-pre-line">{exp.raw_context}</p>
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
            <div class="grid grid-cols-4 gap-4 avoid-break" style="break-inside: avoid;">
              <div class="text-[10px] font-bold text-slate-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</div>
              <div class="col-span-3">
                <h4 class="text-sm font-bold text-slate-800">{exp.role}</h4>
                <p class="text-xs text-slate-500 mb-2">{exp.company}</p>
                <p class="text-xs leading-relaxed text-slate-400 whitespace-pre-line">{exp.raw_context}</p>
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
            <div class="mb-4 avoid-break" style="break-inside: avoid;">
              <p class="text-xs font-bold text-slate-700">{edu.studyType}</p>
              <p class="text-[10px] text-slate-400">{edu.institution}</p>
              {#if edu.raw_context}
                 <p class="text-[10px] leading-relaxed text-slate-500 mt-1 whitespace-pre-line">{edu.raw_context}</p>
              {/if}
            </div>
          {/each}
        </section>
      </div>
    </div>

    {:else if templateId === 'executive'}
      <ExecutiveTemplate {profile} />
    {:else if templateId === 'elegant'}
      <ElegantTemplate {profile} />
  {/if}
  </div>
{/if}
