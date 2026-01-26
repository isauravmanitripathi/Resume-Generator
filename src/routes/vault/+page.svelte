<script lang="ts">
  import { onMount } from 'svelte';
  import { db, type Profile, type ExperienceItem, type EducationItem, type SkillItem, type AchievementItem, type PublicationItem } from '$lib/db';
  import { 
    User, MapPin, Briefcase, GraduationCap, Award, BookOpen, 
    Linkedin, Github, Twitter, Youtube, Instagram, Globe,
    Plus, Trash2, Smartphone, Mail, Hash, Save, CheckCircle
  } from 'lucide-svelte';
  import { v4 as uuidv4 } from 'uuid';

  let profile = $state<Profile>({
    id: 'master',
    basics: {
      firstName: '', middleName: '', lastName: '', email: '', phone: '',
      countryCode: '', address: '', city: '', state: '', zipCode: '',
      country: '', summary: '', title: ''
    },
    socials: {
      linkedin: '', github: '', twitter: '', youtube: '', instagram: '', website: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    achievements: [],
    publications: []
  });

  let activeTab = $state('basics');
  let isSaving = $state(false);
  let lastSaved = $state<Date | null>(null);

  onMount(async () => {
    const saved = await db.profile.get('master');
    if (saved) {
      profile = saved;
    }
  });

  async function save() {
    isSaving = true;
    await db.profile.put($state.snapshot(profile));
    lastSaved = new Date();
    setTimeout(() => { isSaving = false; }, 800);
  }

  // Helper to add items
  function addExperience() {
    profile.experience = [...profile.experience, {
      id: uuidv4(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, raw_context: ''
    }];
    save();
  }

  function addEducation() {
    profile.education = [...profile.education, {
      id: uuidv4(), institution: '', area: '', studyType: '', startDate: '', endDate: '', score: '', location: ''
    }];
    save();
  }

  function addSkill() {
    profile.skills = [...profile.skills, { id: uuidv4(), name: '', level: 'Intermediate', category: 'Software' }];
    save();
  }

  function addAchievement() {
    profile.achievements = [...profile.achievements, { id: uuidv4(), title: '', date: '', issuer: '', description: '' }];
    save();
  }

  function addPublication() {
    profile.publications = [...profile.publications, { id: uuidv4(), name: '', publisher: '', releaseDate: '', url: '', summary: '' }];
    save();
  }

  // Helper to remove items
  function remove(arrayName: keyof Profile, id: string) {
    if (Array.isArray(profile[arrayName])) {
      (profile[arrayName] as any) = (profile[arrayName] as any[]).filter(i => i.id !== id);
      save();
    }
  }

  const tabs = [
    { id: 'basics', label: 'Basics', icon: User },
    { id: 'location', label: 'Contact', icon: MapPin },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'extras', label: 'Extras', icon: BookOpen },
  ];
</script>

<div class="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col">
  <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Profile Vault</h1>
      <p class="text-slate-500">Your master data used by AI to build tailored resumes.</p>
    </div>
    
    <div class="flex items-center gap-3 text-sm font-medium">
      {#if isSaving}
        <span class="text-blue-600 flex items-center gap-2 animate-pulse">
           <Save size={16} class="animate-spin" /> Saving...
        </span>
      {:else if lastSaved}
        <span class="text-emerald-600 flex items-center gap-2">
           <CheckCircle size={16} /> Auto-saved
        </span>
      {/if}
      <button 
        onclick={save}
        class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
      >
        Save Now
      </button>
    </div>
  </header>

  <div class="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">
    <!-- Sidebar Tabs -->
    <nav class="lg:w-48 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 shrink-0">
      {#each tabs as tab}
        <button
          onclick={() => (activeTab = tab.id)}
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
          {activeTab === tab.id 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}"
        >
          <tab.icon size={18} />
          {tab.label}
        </button>
      {/each}
    </nav>

    <!-- Form Content -->
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <div class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {#if activeTab === 'basics'}
          <div class="space-y-8 animate-fade-in">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User size={20} class="text-blue-600" /> Personal Identity
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider" for="fn">First Name</label>
                <input id="fn" bind:value={profile.basics.firstName} oninput={save} class="input-field" placeholder="John" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider" for="mn">Middle Name</label>
                <input id="mn" bind:value={profile.basics.middleName} oninput={save} class="input-field" placeholder="Quincy" />
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider" for="ln">Last Name</label>
                <input id="ln" bind:value={profile.basics.lastName} oninput={save} class="input-field" placeholder="Doe" />
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider" for="title">Professional Title</label>
              <input id="title" bind:value={profile.basics.title} oninput={save} class="input-field" placeholder="Senior Software Engineer" />
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-wider" for="summary">Long Bio / Summary</label>
              <textarea id="summary" bind:value={profile.basics.summary} oninput={save} class="input-field min-h-[150px] py-4" placeholder="Briefly describe your professional background..."></textarea>
            </div>
          </div>

        {:else if activeTab === 'location'}
          <div class="space-y-8 animate-fade-in">
            <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MapPin size={20} class="text-blue-600" /> Contact & Social
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label for="email" class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Mail size={12} /> Email
                </label>
                <input id="email" bind:value={profile.basics.email} oninput={save} class="input-field" placeholder="john@example.com" />
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div class="space-y-1.5 col-span-1">
                  <label for="countryCode" class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={12} /> Code
                  </label>
                  <input id="countryCode" bind:value={profile.basics.countryCode} oninput={save} class="input-field" placeholder="+1" />
                </div>
                <div class="space-y-1.5 col-span-3">
                  <label for="phone" class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone size={12} /> Phone
                  </label>
                  <input id="phone" bind:value={profile.basics.phone} oninput={save} class="input-field" placeholder="555-0123" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
              <div class="space-y-4">
                <h3 class="text-sm font-bold text-slate-700">Address</h3>
                <div class="space-y-1.5">
                  <label for="address" class="sr-only">Address</label>
                  <input id="address" bind:value={profile.basics.address} oninput={save} class="input-field" placeholder="Street Address" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <label for="city" class="sr-only">City</label>
                  <input id="city" bind:value={profile.basics.city} oninput={save} class="input-field" placeholder="City" />
                  <label for="state" class="sr-only">State</label>
                  <input id="state" bind:value={profile.basics.state} oninput={save} class="input-field" placeholder="State/Prov" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <label for="zipCode" class="sr-only">Postal Code</label>
                  <input id="zipCode" bind:value={profile.basics.zipCode} oninput={save} class="input-field" placeholder="ZIP/Post" />
                  <label for="country" class="sr-only">Country</label>
                  <input id="country" bind:value={profile.basics.country} oninput={save} class="input-field" placeholder="Country" />
                </div>
              </div>

              <div class="space-y-4">
                <h3 class="text-sm font-bold text-slate-700">Digital Links</h3>
                <div class="grid grid-cols-1 gap-3">
                  <div class="relative">
                    <Linkedin size={16} class="absolute left-3 top-3 text-slate-400" />
                    <label for="linkedin" class="sr-only">LinkedIn</label>
                    <input id="linkedin" bind:value={profile.socials.linkedin} oninput={save} class="input-field pl-10" placeholder="LinkedIn URL" />
                  </div>
                  <div class="relative">
                    <Github size={16} class="absolute left-3 top-3 text-slate-400" />
                    <label for="github" class="sr-only">GitHub</label>
                    <input id="github" bind:value={profile.socials.github} oninput={save} class="input-field pl-10" placeholder="GitHub URL" />
                  </div>
                  <div class="relative">
                    <Twitter size={16} class="absolute left-3 top-3 text-slate-400" />
                    <label for="twitter" class="sr-only">Twitter</label>
                    <input id="twitter" bind:value={profile.socials.twitter} oninput={save} class="input-field pl-10" placeholder="X (Twitter) URL" />
                  </div>
                  <div class="relative">
                    <Globe size={16} class="absolute left-3 top-3 text-slate-400" />
                    <label for="website" class="sr-only">Website</label>
                    <input id="website" bind:value={profile.socials.website} oninput={save} class="input-field pl-10" placeholder="Portfolio/Website" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        {:else if activeTab === 'experience'}
          <div class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} class="text-blue-600" /> Professional Experience
              </h2>
              <button onclick={addExperience} class="btn-add">
                <Plus size={16} /> Add Position
              </button>
            </div>

            {#each profile.experience as exp (exp.id)}
              <div class="p-6 border border-slate-100 bg-slate-50/30 rounded-2xl relative group">
                <button onclick={() => remove('experience', exp.id)} class="absolute right-4 top-4 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input bind:value={exp.company} oninput={save} class="input-field bg-white" placeholder="Company Name" />
                  <input bind:value={exp.role} oninput={save} class="input-field bg-white" placeholder="Role / Title" />
                  <div class="grid grid-cols-2 gap-2">
                    <input bind:value={exp.startDate} oninput={save} class="input-field bg-white" placeholder="Start Date" />
                    <input bind:value={exp.endDate} oninput={save} disabled={exp.current} class="input-field bg-white" placeholder={exp.current ? 'Present' : 'End Date'} />
                  </div>
                  <div class="flex items-center gap-2 px-1">
                    <input type="checkbox" id="curr-{exp.id}" bind:checked={exp.current} onchange={save} class="w-4 h-4 text-blue-600 rounded" />
                    <label for="curr-{exp.id}" class="text-sm font-medium text-slate-600">I currently work here</label>
                  </div>
                </div>
                <div class="mt-4">
                  <label class="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Context Blob (Details for AI)</label>
                  <textarea bind:value={exp.raw_context} oninput={save} class="input-field bg-white min-h-[100px]" placeholder="Dump everything you did in this role..."></textarea>
                </div>
              </div>
            {/each}
          </div>

        {:else if activeTab === 'education'}
          <div class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap size={20} class="text-blue-600" /> Education History
              </h2>
              <button onclick={addEducation} class="btn-add">
                <Plus size={16} /> Add Education
              </button>
            </div>

            {#each profile.education as edu (edu.id)}
              <div class="p-6 border border-slate-100 bg-slate-50/30 rounded-2xl relative group">
                <button onclick={() => remove('education', edu.id)} class="absolute right-4 top-4 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input bind:value={edu.institution} oninput={save} class="input-field bg-white" placeholder="Institution" />
                  <input bind:value={edu.studyType} oninput={save} class="input-field bg-white" placeholder="Degree (e.g. Bachelor of Science)" />
                  <input bind:value={edu.area} oninput={save} class="input-field bg-white" placeholder="Field of Study" />
                  <div class="grid grid-cols-2 gap-2">
                    <input bind:value={edu.startDate} oninput={save} class="input-field bg-white" placeholder="Start Date" />
                    <input bind:value={edu.endDate} oninput={save} class="input-field bg-white" placeholder="End Date" />
                  </div>
                  <input bind:value={edu.score} oninput={save} class="input-field bg-white" placeholder="GPA / Score" />
                  <input bind:value={edu.location} oninput={save} class="input-field bg-white" placeholder="Location" />
                </div>
              </div>
            {/each}
          </div>

        {:else if activeTab === 'skills'}
          <div class="space-y-6 animate-fade-in">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Award size={20} class="text-blue-600" /> Skills & Expertise
              </h2>
              <button onclick={addSkill} class="btn-add">
                <Plus size={16} /> Add Skill
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each profile.skills as skill (skill.id)}
                <div class="flex items-center gap-2 p-3 border border-slate-100 bg-slate-50 rounded-xl">
                  <input bind:value={skill.name} oninput={save} class="flex-1 bg-transparent outline-none text-sm font-medium" placeholder="Skill name" />
                  <select bind:value={skill.level} onchange={save} class="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-1">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Expert</option>
                  </select>
                  <button onclick={() => remove('skills', skill.id)} class="text-slate-300 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              {/each}
            </div>
          </div>

        {:else if activeTab === 'extras'}
          <div class="space-y-12 animate-fade-in">
            <section class="space-y-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                   Achievements
                </h3>
                <button onclick={addAchievement} class="btn-add text-xs py-1.5">
                  <Plus size={14} /> Add
                </button>
              </div>
              {#each profile.achievements as ach (ach.id)}
                <div class="p-4 border border-slate-100 bg-slate-50 rounded-2xl relative">
                  <button onclick={() => remove('achievements', ach.id)} class="absolute right-3 top-3 text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input bind:value={ach.title} oninput={save} class="input-field bg-white col-span-2" placeholder="Award / Achievement Title" />
                    <input bind:value={ach.date} oninput={save} class="input-field bg-white" placeholder="Date" />
                  </div>
                  <input bind:value={ach.issuer} oninput={save} class="input-field bg-white mt-3" placeholder="Issuer / Organization" />
                </div>
              {/each}
            </section>

            <section class="space-y-6 border-t border-slate-100 pt-8">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                   Publications
                </h3>
                <button onclick={addPublication} class="btn-add text-xs py-1.5">
                  <Plus size={14} /> Add
                </button>
              </div>
              {#each profile.publications as pub (pub.id)}
                <div class="p-4 border border-slate-100 bg-slate-50 rounded-2xl relative">
                  <button onclick={() => remove('publications', pub.id)} class="absolute right-3 top-3 text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input bind:value={pub.name} oninput={save} class="input-field bg-white col-span-2" placeholder="Publication Title" />
                    <input bind:value={pub.releaseDate} oninput={save} class="input-field bg-white" placeholder="Date" />
                  </div>
                  <input bind:value={pub.url} oninput={save} class="input-field bg-white mt-3" placeholder="Publication URL" />
                </div>
              {/each}
            </section>
          </div>
        {/if}

      </div>
    </div>
  </div>
</div>

<style>
  @reference "tailwindcss";

  .input-field {
    @apply w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-700 placeholder:text-slate-400 font-medium;
  }
  
  .btn-add {
    @apply flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-100 transition-all;
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
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
