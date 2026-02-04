<script lang="ts">
  import type { Profile } from '$lib/db';
  import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-svelte';

  interface Props {
    profile: Profile;
  }

  let { profile } = $props<Props>();
</script>

<div class="bg-white text-slate-900 font-sans p-10 min-h-[297mm] relative" style="font-family: 'Inter', sans-serif;">
  
  <!-- Header -->
  <header class="text-center mb-10">
    <h1 class="text-3xl font-bold tracking-tight mb-2 text-black">
      {profile.basics.firstName} {profile.basics.lastName}
    </h1>
    
    <div class="flex flex-wrap justify-center gap-3 text-xs text-slate-600 font-medium">
      {#if profile.basics.city}<span>{profile.basics.city}, {profile.basics.state}</span>{/if}
      {#if profile.basics.email}<span class="text-slate-400">•</span> <a href="mailto:{profile.basics.email}" class="hover:text-black transition-colors">{profile.basics.email}</a>{/if}
      {#if profile.basics.phone}<span class="text-slate-400">•</span> <span>{profile.basics.phone}</span>{/if}
      {#if profile.socials.linkedin}<span class="text-slate-400">•</span> <a href={profile.socials.linkedin} target="_blank" class="hover:text-black transition-colors">LinkedIn</a>{/if}
      {#if profile.socials.github}<span class="text-slate-400">•</span> <a href={profile.socials.github} target="_blank" class="hover:text-black transition-colors">GitHub</a>{/if}
      {#if profile.socials.website}<span class="text-slate-400">•</span> <a href={profile.socials.website} target="_blank" class="hover:text-black transition-colors">Portfolio</a>{/if}
    </div>
  </header>

  <!-- Summary -->
  {#if profile.basics.summary}
    <section class="mb-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-black border-b border-slate-200 pb-1 mb-3">Professional Summary</h2>
      <p class="text-sm leading-relaxed text-slate-800 text-justify">
        {profile.basics.summary}
      </p>
    </section>
  {/if}

  <!-- Experience -->
  {#if profile.experience.length > 0}
    <section class="mb-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-black border-b border-slate-200 pb-1 mb-4">Work Experience</h2>
      <div class="space-y-6">
        {#each profile.experience as exp}
          <div class="group">
            <div class="flex justify-between items-baseline mb-1">
              <div class="flex items-baseline gap-2">
                <h3 class="font-bold text-sm text-black">{exp.role}</h3>
                <span class="text-slate-300">|</span>
                <span class="text-sm font-medium text-slate-700">{exp.company}</span>
              </div>
              <div class="text-xs text-slate-500 font-medium italic">
                 {#if exp.location}<span class="mr-1">{exp.location} |</span>{/if}
                 {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
              </div>
            </div>
            
            {#if exp.raw_context}
              <ul class="list-disc list-outside ml-4 space-y-1">
                {#each exp.raw_context.split('\n').filter(l => l.trim()) as line}
                   <li class="text-xs text-slate-700 leading-relaxed pl-1">
                     {line.replace(/^•\s*/, '')}
                   </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Education -->
  {#if profile.education.length > 0}
    <section class="mb-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-black border-b border-slate-200 pb-1 mb-4">Education</h2>
      <div class="space-y-4">
        {#each profile.education as edu}
          <div>
            <div class="flex justify-between items-baseline mb-1">
              <h3 class="font-bold text-sm text-black">{edu.institution}</h3>
              <span class="text-xs text-slate-500 font-medium italic">{edu.startDate} – {edu.endDate}</span>
            </div>
            <div class="flex justify-between items-baseline">
               <div class="text-xs text-slate-700 italic">
                 {edu.studyType} in {edu.area}
               </div>
               {#if edu.location}
                 <div class="text-xs text-slate-500 italic">{edu.location}</div>
               {/if}
            </div>
          </div>
        {/each}
      </div>
    </section>
  {/if}

    <!-- Projects (Optional) -->
  {#if profile.projects && profile.projects.length > 0}
    <section class="mb-8">
      <h2 class="text-xs font-bold uppercase tracking-widest text-black border-b border-slate-200 pb-1 mb-4">Technical Projects</h2>
      <div class="space-y-4">
        {#each profile.projects as proj}
          <div>
            <div class="flex justify-between items-baseline mb-1">
              <div class="flex items-baseline gap-2">
                 <h3 class="font-bold text-sm text-black">{proj.name}</h3>
                 {#if proj.url}
                   <span class="text-slate-300">|</span>
                   <a href={proj.url} target="_blank" class="text-xs text-slate-500 hover:text-blue-600">Repository</a>
                 {/if}
              </div>
            </div>
             {#if proj.raw_context}
              <ul class="list-disc list-outside ml-4 space-y-1">
                {#each proj.raw_context.split('\n').filter(l => l.trim()) as line}
                   <li class="text-xs text-slate-700 leading-relaxed pl-1">
                     {line.replace(/^•\s*/, '')}
                   </li>
                {/each}
              </ul>
            {/if}
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Skills -->
  {#if profile.skills.length > 0}
    <section>
      <h2 class="text-xs font-bold uppercase tracking-widest text-black border-b border-slate-200 pb-1 mb-3">Skills</h2>
      <p class="text-xs text-slate-800 leading-relaxed">
        {profile.skills.map(s => s.name).join(' • ')}
      </p>
    </section>
  {/if}

</div>
