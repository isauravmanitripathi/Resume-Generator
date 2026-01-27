<script lang="ts">
  import type { Profile } from '$lib/db';
  import { 
    User, Briefcase, GraduationCap, Award, Globe, Layout, FileText 
  } from 'lucide-svelte';

  interface Props {
    profile: Profile | null;
  }

  let { profile } = $props<Props>();

  function handleDragStart(e: DragEvent, text: string) {
    if (!e.dataTransfer) return;
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'text', data: text }));
    e.dataTransfer.effectAllowed = 'copy';
  }
</script>

<div class="space-y-4 mb-10 select-none">
  {#if profile}
    <!-- Identity Blob -->
    <div class="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
      <div class="flex items-center gap-2 text-slate-400">
        <User size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Basics</span>
      </div>
      <div class="space-y-1">
        <p draggable="true" ondragstart={(e) => handleDragStart(e, `${profile.basics.firstName} ${profile.basics.lastName}`)} class="text-sm font-bold text-slate-800 cursor-grab active:cursor-grabbing hover:text-blue-600 transition-colors w-fit">{profile.basics.firstName} {profile.basics.lastName}</p>
        <p draggable="true" ondragstart={(e) => handleDragStart(e, profile.basics.title)} class="text-xs text-slate-500 font-medium cursor-grab active:cursor-grabbing hover:text-blue-600 transition-colors w-fit">{profile.basics.title}</p>
        <p draggable="true" ondragstart={(e) => handleDragStart(e, profile.basics.summary)} class="text-[10px] text-slate-400 cursor-grab active:cursor-grabbing hover:text-blue-600 transition-colors w-fit line-clamp-2">{profile.basics.summary}</p>
        <p draggable="true" ondragstart={(e) => handleDragStart(e, `${profile.basics.email} • ${profile.basics.phone} • ${profile.basics.city}`)} class="text-[10px] text-slate-400 cursor-grab active:cursor-grabbing hover:text-blue-600 transition-colors w-fit">{profile.basics.email} • {profile.basics.city}</p>
      </div>
    </div>

    <!-- Socials Blob -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
        <Globe size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Social Presence</span>
      </div>
      <div class="grid grid-cols-2 gap-2">
        {#if profile.socials.linkedin}<div draggable="true" ondragstart={(e) => handleDragStart(e, profile.socials.linkedin)} class="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 truncate cursor-grab active:cursor-grabbing hover:bg-slate-100">LinkedIn</div>{/if}
        {#if profile.socials.github}<div draggable="true" ondragstart={(e) => handleDragStart(e, profile.socials.github)} class="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 truncate cursor-grab active:cursor-grabbing hover:bg-slate-100">GitHub</div>{/if}
        {#if profile.socials.website}<div draggable="true" ondragstart={(e) => handleDragStart(e, profile.socials.website)} class="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 truncate cursor-grab active:cursor-grabbing hover:bg-slate-100">Website</div>{/if}
      </div>
    </div>

    <!-- Experience Blobs -->
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-slate-400 px-1 py-1">
        <Briefcase size={14} />
        <span class="text-[9px] font-black uppercase tracking-widest">Experience</span>
      </div>
      {#each profile.experience as exp}
        <div 
          draggable="true" 
          ondragstart={(e) => handleDragStart(e, `${exp.role}\n${exp.company}\n${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n\n${exp.raw_context}`)}
          class="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors cursor-grab active:cursor-grabbing"
        >
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
          <div 
            draggable="true" 
            ondragstart={(e) => handleDragStart(e, `${proj.name}\n${proj.description}`)}
            class="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-200"
          >
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
        <div 
          draggable="true" 
          ondragstart={(e) => handleDragStart(e, `${edu.studyType}\n${edu.institution}\n${edu.startDate} - ${edu.endDate}`)}
          class="p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-grab active:cursor-grabbing hover:bg-slate-100"
        >
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
          <div 
            draggable="true" 
            ondragstart={(e) => handleDragStart(e, `${pub.name} - ${pub.publisher}`)}
            class="p-3 bg-white border border-slate-100 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-200"
          >
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
          <div 
             draggable="true" 
             ondragstart={(e) => handleDragStart(e, `${ach.title} - ${ach.issuer}`)}
             class="p-3 bg-amber-50/30 border border-amber-100 rounded-xl cursor-grab active:cursor-grabbing hover:bg-amber-50"
          >
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
          <span 
            draggable="true" 
            ondragstart={(e) => handleDragStart(e, skill.name)}
            class="px-2 py-0.5 bg-white border border-slate-100 rounded-full text-[9px] font-bold text-slate-600 shadow-sm whitespace-nowrap cursor-grab active:cursor-grabbing hover:bg-slate-50"
          >
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
