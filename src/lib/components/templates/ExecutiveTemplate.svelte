<script lang="ts">
  import type { Profile } from '$lib/db';
  import { 
    Phone, Mail, MapPin, Linkedin, Globe, Shield 
  } from 'lucide-svelte';

  interface Props {
    profile: Profile;
  }

  let { profile } = $props<Props>();
</script>

<div class="w-full h-full bg-white font-sans text-slate-800">
  <!-- Header -->
  <header class="bg-[#0f2b4c] text-white py-8 px-10 text-center">
    <h1 class="text-4xl font-bold uppercase tracking-wide mb-2">
      {profile.basics.firstName} {profile.basics.lastName}
    </h1>
    <p class="text-sm font-medium tracking-[0.2em] uppercase opacity-80">
      {profile.basics.title}
    </p>
  </header>

  <!-- Main Grid -->
  <div class="flex h-full min-h-[calc(297mm-120px)]"> 
    
    <!-- Left Sidebar -->
    <aside class="w-[32%] px-6 py-8 border-r border-slate-100 flex flex-col gap-8">
      
      <!-- Contact Info -->
      <section class="space-y-3">
        {#if profile.basics.phone}
          <div class="flex items-center gap-3 text-xs">
            <div class="w-6 h-6 rounded-full bg-[#d3cbb8] flex items-center justify-center text-white shrink-0">
               <Phone size={12} fill="white" />
            </div>
            <span class="text-slate-600 font-medium">{profile.basics.phone}</span>
          </div>
        {/if}
        {#if profile.basics.email}
          <div class="flex items-center gap-3 text-xs">
            <div class="w-6 h-6 rounded-full bg-[#d3cbb8] flex items-center justify-center text-white shrink-0">
               <Mail size={12} fill="white" />
            </div>
            <span class="text-slate-600 font-medium">{profile.basics.email}</span>
          </div>
        {/if}
        {#if profile.basics.city}
          <div class="flex items-center gap-3 text-xs">
             <div class="w-6 h-6 rounded-full bg-[#d3cbb8] flex items-center justify-center text-white shrink-0">
               <MapPin size={12} fill="white" />
            </div>
            <span class="text-slate-600 font-medium">{profile.basics.city}, {profile.basics.state}</span>
          </div>
        {/if}
        {#if profile.socials.linkedin}
          <div class="flex items-center gap-3 text-xs">
             <div class="w-6 h-6 rounded-full bg-[#d3cbb8] flex items-center justify-center text-white shrink-0">
               <Linkedin size={12} fill="white" />
            </div>
            <a href={profile.socials.linkedin} target="_blank" class="text-slate-600 font-medium hover:underline">
              {profile.socials.linkedin.replace('https://www.', '').replace('https://', '')}
            </a>
          </div>
        {/if}
        {#if profile.socials.website}
           <div class="flex items-center gap-3 text-xs">
             <div class="w-6 h-6 rounded-full bg-[#d3cbb8] flex items-center justify-center text-white shrink-0">
               <Globe size={12} />
            </div>
            <a href={profile.socials.website} target="_blank" class="text-slate-600 font-medium hover:underline">
              {profile.socials.website.replace('https://www.', '').replace('https://', '')}
            </a>
          </div>
        {/if}
      </section>

      <!-- Summary -->
      {#if profile.basics.summary}
        <section>
          <h3 class="text-[#d3cbb8] text-sm font-bold uppercase border-b border-[#d3cbb8] pb-1 mb-3">
            Summary
          </h3>
          <p class="text-[11px] leading-relaxed text-slate-700 italic">
            {profile.basics.summary}
          </p>
        </section>
      {/if}

      <!-- Skills -->
      {#if profile.skills?.length > 0}
        <section>
           <h3 class="text-[#d3cbb8] text-sm font-bold uppercase border-b border-[#d3cbb8] pb-1 mb-3">
            Key Skills
          </h3>
          <div class="space-y-2">
            {#each (profile.skills || []) as skill}
              <div>
                <p class="text-[11px] font-bold text-slate-800">{skill.name}</p>
                <!-- Optional: Level/Category if needed layout-wise, but design shows list -->
              </div>
            {/each}
          </div>
        </section>
      {/if}
       
       <!-- Technical Skills (Assuming category separation or just reuse skills for now) -->
       <!-- If we had categories, we'd list them. For now, let's assume 'skills' is mixed. -->
    </aside>

    <!-- Right Content -->
    <main class="w-[68%] p-8 flex flex-col gap-6">

      <!-- Experience -->
      <section>
        <h3 class="text-[#d3cbb8] text-sm font-bold uppercase border-b border-[#d3cbb8] pb-1 mb-4 tracking-wide">
          Professional Experience
        </h3>
        <div class="space-y-6">
          {#each (profile.experience || []) as exp}
            <div class="group">
              <div class="flex justify-between items-baseline mb-1">
                <h4 class="text-sm font-bold text-slate-900 uppercase">{exp.role}</h4>
                <span class="text-xs font-medium text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div class="text-xs font-bold text-slate-600 mb-2">{exp.company}{#if exp.location} | {exp.location}{/if}</div>
              
              <div class="text-[11px] leading-relaxed text-slate-700 space-y-1">
                  <!-- Render raw context as bullet points if possible, or just text -->
                  <div class="whitespace-pre-line pl-1">{exp.raw_context}</div>
              </div>
            </div>
          {/each}
        </div>
      </section>

       <!-- Education -->
      <section>
        <h3 class="text-[#d3cbb8] text-sm font-bold uppercase border-b border-[#d3cbb8] pb-1 mb-4 tracking-wide">
          Education
        </h3>
        <div class="space-y-4">
          {#each (profile.education || []) as edu}
            <div>
               <div class="flex justify-between items-baseline mb-1">
                <h4 class="text-sm font-bold text-slate-900 uppercase">{edu.studyType}</h4>
                <span class="text-xs font-medium text-slate-500">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div class="text-xs font-bold text-slate-600 mb-1">{edu.institution}</div>
            </div>
          {/each}
        </div>
      </section>

    </main>
  </div>
</div>
