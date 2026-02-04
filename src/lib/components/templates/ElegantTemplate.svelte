<script lang="ts">
  import type { Profile } from '$lib/db';

  interface Props {
    profile: Profile;
  }

  let { profile } = $props<Props>();
</script>

<div class="w-full h-full bg-white font-sans text-slate-900 p-12">
  <!-- Header -->
  <header class="text-center mb-8">
    <h1 class="text-5xl font-bold uppercase tracking-wide mb-3">
      {profile.basics.firstName} {profile.basics.lastName}
    </h1>
    
    <div class="text-sm text-slate-600 font-medium tracking-wide mb-4">
      <span class="inline-flex flex-wrap justify-center gap-x-3 gap-y-1">
        {#if profile.basics.phone}<span>{profile.basics.phone}</span>{/if}
        {#if profile.basics.email}<span>{profile.basics.email}</span>{/if}
        {#if profile.socials.linkedin}
          <a href={profile.socials.linkedin.startsWith('http') ? profile.socials.linkedin : `https://${profile.socials.linkedin}`} target="_blank" class="hover:underline">LinkedIn</a>
        {/if}
        {#if profile.socials.website}
          <a href={profile.socials.website.startsWith('http') ? profile.socials.website : `https://${profile.socials.website}`} target="_blank" class="hover:underline">Portfolio</a>
        {/if}
      </span>
      {#if profile.basics.city}
        <div class="mt-1">{profile.basics.city}, {profile.basics.state}</div>
      {/if}
    </div>

    <!-- Thick Separator -->
    <div class="w-full h-[3px] bg-slate-900"></div>
  </header>

  <div class="space-y-6">
    <!-- Profile / Summary -->
    {#if profile.basics.summary}
      <section>
        <h2 class="text-center text-sm font-bold uppercase tracking-wider mb-3">Profile</h2>
        <p class="text-sm leading-relaxed text-slate-700 text-center max-w-4xl mx-auto">
          {profile.basics.summary}
        </p>
        <!-- Section Separator -->
        <div class="w-full h-px bg-slate-300 mt-6"></div>
      </section>
    {/if}

    <!-- Experience -->
    {#if profile.experience?.length > 0}
      <section>
        <h2 class="text-center text-sm font-bold uppercase tracking-wider mb-6">Professional Experience</h2>
        <div class="space-y-6">
          {#each (profile.experience || []) as exp}
            <div class="avoid-break" style="break-inside: avoid;">
              <!-- Header Row -->
              <div class="flex justify-between items-baseline mb-1">
                <div class="flex flex-col">
                  <h3 class="font-bold text-base text-slate-900">{exp.role}</h3>
                  <span class="text-sm text-slate-600 italic">{exp.company}{#if exp.location}, {exp.location}{/if}</span>
                </div>
                <div class="text-sm font-bold text-slate-900 shrink-0">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              
              <!-- Content -->
              <div class="text-sm leading-relaxed text-slate-700 pl-2">
                 {#if exp.raw_context}
                  <div class="whitespace-pre-line">{exp.raw_context}</div>
                 {/if}
              </div>
            </div>
          {/each}
        </div>
        <!-- Section Separator -->
        <div class="w-full h-px bg-slate-300 mt-8"></div>
      </section>
    {/if}

    <!-- Education -->
    {#if profile.education?.length > 0}
      <section>
        <h2 class="text-center text-sm font-bold uppercase tracking-wider mb-6">Education</h2>
        <div class="space-y-6">
          {#each (profile.education || []) as edu}
            <div class="avoid-break text-center" style="break-inside: avoid;">
              <h3 class="font-bold text-base text-slate-900">{edu.studyType}</h3>
              <div class="text-sm text-slate-600 mb-1">{edu.startDate} – {edu.endDate}</div>
              <div class="text-sm text-slate-800 italic">{edu.institution}</div>
              {#if edu.raw_context}
                <div class="text-sm text-slate-600 mt-2 max-w-2xl mx-auto whitespace-pre-line">{edu.raw_context}</div>
              {/if}
            </div>
          {/each}
        </div>
        <!-- Section Separator -->
        <div class="w-full h-px bg-slate-300 mt-8"></div>
      </section>
    {/if}

    <!-- Skills -->
    {#if profile.skills?.length > 0}
      <section>
        <h2 class="text-center text-sm font-bold uppercase tracking-wider mb-6">Key Skills</h2>
        <div class="grid grid-cols-2 gap-x-12 gap-y-2 max-w-4xl mx-auto">
          {#each (profile.skills || []) as skill}
            <div class="flex items-start gap-2 text-sm text-slate-700">
              <span class="text-slate-900 font-bold">•</span>
              <span><span class="font-bold text-slate-900">{skill.name}</span>{#if skill.category}: {skill.category}{/if}</span>
            </div>
          {/each}
        </div>
         <!-- Section Separator -->
        <div class="w-full h-px bg-slate-300 mt-8"></div>
      </section>
    {/if}
    
    <!-- Awards / Achievements -->
    {#if profile.achievements?.length > 0}
      <section>
        <h2 class="text-center text-sm font-bold uppercase tracking-wider mb-6">Professional Awards</h2>
        <ul class="space-y-2 max-w-4xl mx-auto">
          {#each (profile.achievements || []) as ach}
            <li class="flex items-start gap-2 text-sm text-slate-700">
               <span class="text-slate-900 font-bold mt-1.5 w-1.5 h-1.5 bg-slate-900 rounded-full shrink-0"></span>
               <span>
                 <span class="font-bold text-slate-900">{ach.title}</span>
                 {#if ach.date} <span class="text-slate-500 italic">({ach.date})</span>{/if}
                 {#if ach.summary}: {ach.summary}{/if}
               </span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</div>
