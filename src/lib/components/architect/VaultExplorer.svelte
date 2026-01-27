<script lang="ts">
  import type { Profile } from '$lib/db';
  import { 
    User, Briefcase, GraduationCap, Award, Globe, Layout, FileText 
  } from 'lucide-svelte';

  interface Props {
    profile: Profile | null;
  }

  let { profile } = $props<Props>();
</script>

<div class="space-y-4 mb-10">
  {#if profile}
    <!-- Identity Blob -->
    <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
      <div class="flex items-center gap-2 text-slate-400">
        <User size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Basics</span>
      </div>
      <div class="space-y-1">
        <p class="text-sm font-bold text-slate-800">{profile.basics.firstName} {profile.basics.lastName}</p>
        <p class="text-xs text-slate-500 font-medium">{profile.basics.title}</p>
        <p class="text-[10px] text-slate-400">{profile.basics.email} • {profile.basics.city}</p>
      </div>
    </div>

    <!-- Socials Blob -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
        <Globe size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Social Presence</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        {#if profile.socials.linkedin}<div class="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 truncate">LinkedIn</div>{/if}
        {#if profile.socials.github}<div class="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 truncate">GitHub</div>{/if}
        {#if profile.socials.website}<div class="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 truncate">Website</div>{/if}
      </div>
    </div>

    <!-- Experience Blobs -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
        <Briefcase size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Experience</span>
      </div>
      {#each profile.experience as exp}
        <div class="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors">
          <p class="text-xs font-bold text-slate-800">{exp.role}</p>
          <p class="text-[10px] text-blue-600 font-bold uppercase">{exp.company}</p>
          <div class="mt-2 text-[10px] text-slate-400 line-clamp-2 italic leading-relaxed">
            {exp.raw_context}
          </div>
        </div>
      {/each}
    </div>

    <!-- Projects Blobs -->
    {#if profile.projects?.length > 0}
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
          <Layout size={14} />
          <span class="text-[9px] font-black uppercase tracking-widest">Projects</span>
        </div>
        {#each profile.projects as proj}
          <div class="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <p class="text-xs font-bold text-slate-800">{proj.name}</p>
            <p class="text-[10px] text-slate-500 line-clamp-2 mt-1">{proj.description}</p>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Education Blobs -->
     <div class="space-y-2">
      <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
        <GraduationCap size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Education</span>
      </div>
      {#each profile.education as edu}
        <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <p class="text-xs font-bold text-slate-700">{edu.studyType}</p>
          <p class="text-[10px] text-slate-500">{edu.institution}</p>
        </div>
      {/each}
    </div>

    <!-- Publications Blobs -->
    {#if profile.publications?.length > 0}
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
          <FileText size={14} />
          <span class="text-[9px] font-black uppercase tracking-widest">Publications</span>
        </div>
        {#each profile.publications as pub}
          <div class="p-3 bg-white border border-slate-100 rounded-xl">
            <p class="text-xs font-bold text-slate-800">{pub.name}</p>
            <p class="text-[10px] text-slate-400">{pub.publisher}</p>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Achievements Blobs -->
    {#if profile.achievements?.length > 0}
       <div class="space-y-2">
        <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
          <Award size={14} />
          <span class="text-[9px] font-black uppercase tracking-widest">Achievements</span>
        </div>
        {#each profile.achievements as ach}
          <div class="p-3 bg-amber-50/30 border border-amber-100 rounded-xl">
            <p class="text-xs font-bold text-amber-900">{ach.title}</p>
            <p class="text-[10px] text-amber-700/70">{ach.issuer}</p>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Skills Blob -->
    <div>
      <div class="flex items-center gap-2 text-slate-400 px-1 mb-1">
        <Award size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Skills Inventory</span>
      </div>
      <div class="flex flex-wrap gap-1.5 p-3 border border-dashed border-slate-200 rounded-2xl">
        {#each profile.skills as skill}
          <span class="px-2 py-0.5 bg-white border border-slate-100 rounded-full text-[9px] font-bold text-slate-600 shadow-sm whitespace-nowrap">
            {skill.name}
          </span>
        {/each}
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <p class="text-xs text-slate-400">Vault data not found.</p>
    </div>
  {/if}
</div>
