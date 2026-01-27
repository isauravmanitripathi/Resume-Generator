<script lang="ts">
  import { Database, Code, BookOpen, ChevronRight, Layout, FileJson, ArrowLeft, Server, Save, Copy, Check } from 'lucide-svelte';

  let activeSection = $state('intro');
  let copied = $state(false);

  const sections = [
    { id: 'intro', title: 'Introduction', icon: BookOpen },
    { id: 'arch', title: 'Architecture', icon: Server },
    { id: 'schema', title: 'Data Schema', icon: Database },
    { id: 'custom', title: 'Custom Templates', icon: Code },
    { id: 'layout', title: 'Layout & Dimensions', icon: Layout },
    { id: 'scripting', title: 'Scripting & Logic', icon: Code },
  ];

  /* Documentation Content Config - Centralized for easy copying */
  const docsContent = {
    intro: {
      title: "Architect Developer Portal",
      body: "Welcome to the Developer Documentation. Here you'll find everything you need to understand how the Resume Architect stores data and how you can build completely custom resume templates using standard web technologies."
    },
    arch: {
      title: "Architecture",
      intro: "The application follows a <strong>Local-First</strong> architecture. No user data is sent to the cloud unless explicitly requested (e.g., for AI generation).",
      dexieTitle: "Dexie.js (IndexedDB)",
      dexieBody: "We use Dexie.js as a wrapper around the browser's IndexedDB. This allows for:\n• <strong>Persistent Storage:</strong> Data survives browser restarts.\n• <strong>Large Capacity:</strong> Store vastly more than `localStorage`.\n• <strong>Performance:</strong> Async non-blocking I/O.",
      singletonTitle: "Singleton Pattern",
      singletonBody: "The application creates a single database named <code>INeedAResumeDB</code>. \nInside the <code>profile</code> table, we store a single record with <code>id: 'master'</code>. This Master Profile contains all your vault data."
    },
    schema: {
      title: "Data Schema",
      intro: "The core data structure is the <code class=\"bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-700\">Profile</code> interface.\nBelow is the complete JSON structure you can expect when fetching data."
    },
    custom: {
      title: "Custom Templates",
      intro: "The Studio Code Editor allows you to write raw HTML and CSS to define exactly how your resume looks. We provide a tailored environment where you can access the <code class=\"bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-700\">profile</code> object directly in your markup."
    },
    layout: {
      title: "Layout & Dimensions",
      intro: "Designing for print requires strict adherence to physical dimensions. The Architect enforces a standard <strong>A4</strong> page size.",
      magicTitle: "The Magic Numbers",
      magicStats: "Width:  210mm (794px @ 96dpi)\nHeight: 297mm (1123px @ 96dpi)\nMargin: ~20mm (recommended)",
      magicBody: "The preview window is locked to these dimensions. If your content exceeds 297mm height, it will be clipped (hidden) to prevent layout breakages during printing.",
      practicesTitle: "Best Practices",
      practicesList: [
        "Use <code>mm</code> or <code>cm</code> for sizing containers.",
        "Use <code>rem</code> or <code>px</code> for font sizes.",
        "Use <code>flex</code> or <code>grid</code> for main layout structure.",
        "Avoid <code>vh/vw</code> units as they relate to the window, not the page."
      ]
    },
    scripting: {
      title: "Scripting & Logic",
      intro: "You can include a <code>&lt;script&gt;</code> block in your template to execute JavaScript before rendering.",
      howTitle: "How it works",
      howBody: "The code inside your script tag is executed in a sandbox. You are provided with the <code>profile</code> object. \nYou can modify this object directly, and the modified version will be used for rendering.\n<br/><br/>\n<strong>Note:</strong> You cannot access the DOM (document, window) or external APIs (fetch). This is for data transformation only."
    }
  };

  const fullProfileSchema = `
  // The "Master" Profile Object
  {
    "id": "master",
    "basics": {
      "firstName": "Saurav",
      "lastName": "Tripathi",
      "title": "Senior Software Engineer",
      "email": "saurav@example.com",
      "summary": "Full-stack developer with 5+ years..."
      // ... address, phone, etc.
    },
    "socials": {
      "linkedin": "...",
      "github": "...",
      "website": "..."
    },
    "experience": [
      {
        "id": "uuid-v4",
        "company": "Google",
        "role": "Software Engineer",
        "startDate": "2020-01",
        "endDate": "Present",
        "current": true,
        "raw_context": "Detailed description of responsibilities..."
      }
    ],
    "education": [
      {
        "id": "uuid-v4",
        "institution": "Stanford University",
        "area": "Computer Science",
        "studyType": "MS",
        "startDate": "2018",
        "endDate": "2020"
      }
    ],
    "skills": [
      { "name": "Svelte", "level": "Expert", "category": "Frontend" },
      { "name": "Rust", "level": "Intermediate", "category": "Backend" }
    ],
    "projects": [],
    "achievements": [],
    "publications": []
  }`;

  const fetchExample = `
  import { db } from '$lib/db';

  // 1. Fetching the Profile
  async function loadProfile() {
    const profile = await db.profile.get('master');
    if (profile) {
      console.log(\`Hello, \${profile.basics.firstName}!\`);
    }
  }

  // 2. Saving/Updating Data
  async function updateTitle(newTitle: string) {
    // We use 'update' to patch specific fields
    await db.profile.update('master', {
      'basics.title': newTitle
    });
  }

  // 3. Adding an Experience Item
  async function addJob(job: ExperienceItem) {
    const profile = await db.profile.get('master');
    if (profile) {
      profile.experience.push(job);
      await db.profile.put(profile); // Full replace/update
    }
  }
  `;

  const customTemplateExample = `
<!-- 
  Your Custom Resume Template
  Language: HTML + Svelte-like Syntax
-->

<div class="p-10 font-sans text-slate-800">
  <!-- Header -->
  <header class="border-b-2 border-slate-900 pb-6 mb-6">
    <h1 class="text-4xl font-black uppercase tracking-tighter">
      {profile.basics.firstName} {profile.basics.lastName}
    </h1>
    <p class="text-xl text-slate-500 mt-2">{profile.basics.title}</p>
    
    <div class="flex gap-4 mt-4 text-sm font-bold text-slate-400">
      <span>{profile.basics.email}</span>
      <span>•</span>
      <span>{profile.basics.city}</span>
    </div>
  </header>

  <!-- Experience Section -->
  <section class="mb-8">
    <h2 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
      Experience
    </h2>
    
    {#each profile.experience as exp}
      <div class="mb-6">
        <div class="flex justify-between items-baseline">
          <h3 class="font-bold text-lg">{exp.role}</h3>
          <span class="text-xs font-bold text-slate-400">
            {exp.startDate} - {exp.endDate}
          </span>
        </div>
        <p class="text-sm font-bold text-blue-600 mb-2">{exp.company}</p>
        <p class="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {exp.raw_context}
        </p>
      </div>
    {/each}
  </section>
</div>

<style>
  /* Custom CSS is fully supported and scoped! */
  h1 { color: #1e293b; }
</style>
  `;

  const scriptExample = `
<script>
  // Filter for only 'Expert' skills
  profile.skills = profile.skills.filter(s => s.level === 'Expert');

  // Sort experience by date (newest first)
  profile.experience.sort((a, b) => 
    new Date(b.startDate) - new Date(a.startDate)
  );

  // Add a computed property
  profile.basics.fullName = \`\${profile.basics.firstName} \${profile.basics.lastName}\`;
<\/script>

<h1>{profile.basics.fullName}</h1>
`;

  function copyAllDocs() {
    const allText = [
      `# ${docsContent.intro.title}\n${docsContent.intro.body}\n`,
      `# ${docsContent.arch.title}\n${docsContent.arch.intro}\n## ${docsContent.arch.dexieTitle}\n${docsContent.arch.dexieBody}\n## ${docsContent.arch.singletonTitle}\n${docsContent.arch.singletonBody}\n`,
      `# ${docsContent.schema.title}\n${docsContent.schema.intro}\n\`\`\`json${fullProfileSchema}\n\`\`\`\n\nFetching Example:\n\`\`\`ts${fetchExample}\n\`\`\`\n`,
      `# ${docsContent.custom.title}\n${docsContent.custom.intro}\n\nStarter Template:\n\`\`\`html${customTemplateExample}\n\`\`\`\n`,
      `# ${docsContent.layout.title}\n${docsContent.layout.intro}\n\n## ${docsContent.layout.magicTitle}\n${docsContent.layout.magicStats}\n${docsContent.layout.magicBody}\n\n## ${docsContent.layout.practicesTitle}\n${docsContent.layout.practicesList.map(l => '- ' + l).join('\n')}\n`,
      `# ${docsContent.scripting.title}\n${docsContent.scripting.intro}\n\n## ${docsContent.scripting.howTitle}\n${docsContent.scripting.howBody}\n\nScripting Example:\n\`\`\`html${scriptExample}\n\`\`\`\n`
    ].join('\n---\n\n');

    navigator.clipboard.writeText(allText);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="flex h-full bg-white">
  <!-- Sidebar -->
  <aside class="w-64 border-r border-slate-200 flex flex-col bg-slate-50/50">
    <div class="p-6 border-b border-slate-100 mb-2">
      <a href="/" class="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 text-xs font-bold uppercase tracking-wider">
        <ArrowLeft size={12} /> Back to Architect
      </a>
      <div class="flex items-center justify-between">
         <h1 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen size={20} class="text-blue-600" />
            Docs
         </h1>
         <button 
            onclick={copyAllDocs}
            class="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
            title="Copy Entire Documentation"
         >
            {#if copied}
              <Check size={14} class="text-green-500" />
            {:else}
              <Copy size={14} />
            {/if}
         </button>
      </div>
    </div>
    
    <nav class="flex-1 p-4 space-y-1">
      {#each sections as section}
        {@const Icon = section.icon}
        <button
          onclick={() => activeSection = section.id}
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
          {activeSection === section.id 
            ? 'bg-blue-50 text-blue-700 shadow-sm' 
            : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'}"
        >
          <Icon size={18} />
          {section.title}
          {#if activeSection === section.id}
            <ChevronRight size={14} class="ml-auto" />
          {/if}
        </button>
      {/each}
    </nav>
  </aside>

  <!-- Content Area -->
  <main class="flex-1 overflow-y-auto bg-white">
    <div class="max-w-4xl mx-auto px-12 py-12">
      
      {#if activeSection === 'intro'}
        <div class="space-y-8 animate-fade-in">
          <div class="space-y-4">
            <h2 class="text-4xl font-black text-slate-900 tracking-tight">{docsContent.intro.title}</h2>
            <p class="text-lg text-slate-500 leading-relaxed">
              {docsContent.intro.body}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <button onclick={() => activeSection = 'schema'} class="p-6 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all group text-left">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{docsContent.schema.title}</h3>
              <p class="text-sm text-slate-500">Understand the `Profile` object and database structure.</p>
            </button>

            <button onclick={() => activeSection = 'custom'} class="p-6 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-50 transition-all group text-left">
              <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Code size={24} />
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{docsContent.custom.title}</h3>
              <p class="text-sm text-slate-500">Learn how to code your own layouts with HTML & CSS.</p>
            </button>
          </div>
        </div>

       {:else if activeSection === 'arch'}
        <div class="space-y-10 animate-fade-in">
          <div class="border-b border-slate-100 pb-8">
            <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.arch.title}</h2>
            <p class="text-slate-500 text-lg">
              {@html docsContent.arch.intro}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
               <div class="flex items-center gap-3">
                 <div class="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><Database size={20} /></div>
                 <h3 class="text-lg font-bold text-slate-900">{docsContent.arch.dexieTitle}</h3>
               </div>
               <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{@html docsContent.arch.dexieBody}</p>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
               <div class="flex items-center gap-3">
                 <div class="p-2 bg-white rounded-lg shadow-sm text-emerald-600"><Server size={20} /></div>
                 <h3 class="text-lg font-bold text-slate-900">{docsContent.arch.singletonTitle}</h3>
               </div>
               <p class="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{@html docsContent.arch.singletonBody}</p>
            </div>
          </div>
        </div>

      {:else if activeSection === 'schema'}
        <div class="space-y-10 animate-fade-in">
          <div class="border-b border-slate-100 pb-8">
            <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.schema.title}</h2>
            <p class="text-slate-500">
              {@html docsContent.schema.intro}
            </p>
          </div>

          <div class="space-y-4">
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-slate-400">
                   <FileJson size={16} />
                   <span class="text-xs font-black uppercase tracking-widest">JSON Structure</span>
                </div>
                <div class="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">Updated for V2</div>
             </div>
             <div class="bg-slate-900 rounded-2xl p-6 overflow-hidden shadow-2xl shadow-slate-200">
               <pre class="font-mono text-sm text-blue-200 overflow-x-auto custom-scrollbar"><code>{fullProfileSchema.trim()}</code></pre>
             </div>
          </div>

          <div class="space-y-4 pt-8">
             <div class="flex items-center gap-2 text-slate-400">
                <Save size={16} />
                <span class="text-xs font-black uppercase tracking-widest">Fetching & Saving (Dexie API)</span>
             </div>
             <div class="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
               <pre class="font-mono text-sm text-slate-700 overflow-x-auto"><code>{fetchExample.trim()}</code></pre>
             </div>
          </div>
        </div>

      {:else if activeSection === 'custom'}
        <div class="space-y-10 animate-fade-in">
          <div class="border-b border-slate-100 pb-8">
            <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.custom.title}</h2>
            <p class="text-slate-500">{@html docsContent.custom.intro}</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
              <div class="space-y-4">
                <h3 class="text-lg font-bold text-slate-900">How it works</h3>
                <ul class="space-y-3">
                  <li class="flex gap-3 text-sm text-slate-600">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">1</div>
                    <span>Go to the <strong>Design</strong> tab in the Architect.</span>
                  </li>
                  <li class="flex gap-3 text-sm text-slate-600">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">2</div>
                    <span>Open the <strong>Code Editor</strong> from the Studio Tools section.</span>
                  </li>
                  <li class="flex gap-3 text-sm text-slate-600">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">3</div>
                    <span>Write your HTML structure using Svelte-like syntax (e.g., <code>&#123;#each&#125;</code> loops).</span>
                  </li>
                   <li class="flex gap-3 text-sm text-slate-600">
                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">4</div>
                    <span>Click <strong>Render Preview</strong> to see your changes live.</span>
                  </li>
                </ul>
              </div>

               <div class="space-y-4">
                 <div class="flex items-center gap-2 text-slate-400">
                    <Layout size={16} />
                    <span class="text-xs font-black uppercase tracking-widest">Starter Template</span>
                 </div>
                 <div class="bg-slate-900 rounded-2xl p-6 overflow-hidden shadow-xl shadow-slate-200">
                   <pre class="font-mono text-xs text-amber-100 overflow-x-auto custom-scrollbar"><code>{customTemplateExample.trim()}</code></pre>
                 </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                <h3 class="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <BookOpen size={18} /> supported Features
                </h3>
                <ul class="space-y-2 text-sm text-amber-800">
                  <li>• Tailwind Utility Classes</li>
                  <li>• Inline Styles</li>
                  <li>• Scoped <code>&lt;style&gt;</code> blocks</li>
                  <li>• Svelte Logic (<code>#if</code>, <code>#each</code>)</li>
                  <li>• Google Fonts (via @import)</li>
                </ul>
              </div>

              <div class="p-6 bg-red-50 rounded-3xl border border-red-100">
                 <h3 class="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <Layout size={18} /> Restrictions
                </h3>
                <p class="text-xs text-red-800 leading-relaxed">
                  For security, <code>&lt;script&gt;</code> tags are disabled and will be stripped from your template. Dynamic interactivity should be handled via CSS hover states.
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-8">
             <button onclick={() => activeSection = 'layout'} class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-blue-300 transition-colors">
               <h4 class="font-bold text-slate-800 mb-1 flex items-center gap-2"><Layout size={16}/> Layout & Dimensions</h4>
               <p class="text-xs text-slate-500">Mastering A4 pixel-perfect design.</p>
             </button>
              <button onclick={() => activeSection = 'scripting'} class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-amber-300 transition-colors">
               <h4 class="font-bold text-slate-800 mb-1 flex items-center gap-2"><Code size={16}/> Scripting & Logic</h4>
               <p class="text-xs text-slate-500">Using JavaScript to transform data.</p>
             </button>
          </div>
        </div>

      {:else if activeSection === 'layout'}
        <div class="space-y-10 animate-fade-in">
          <div class="border-b border-slate-100 pb-8">
             <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.layout.title}</h2>
             <p class="text-slate-500 text-lg">
               {@html docsContent.layout.intro}
             </p>
          </div>

          <div class="grid grid-cols-2 gap-8">
             <div class="space-y-4">
               <h3 class="font-bold text-slate-900">{docsContent.layout.magicTitle}</h3>
               <div class="p-6 bg-slate-900 text-blue-200 rounded-2xl font-mono text-sm space-y-2 shadow-xl">
                 <pre class="whitespace-pre-wrap">{docsContent.layout.magicStats}</pre>
               </div>
               <p class="text-sm text-slate-500">
                 {docsContent.layout.magicBody}
               </p>
             </div>

             <div class="space-y-4">
                <h3 class="font-bold text-slate-900">{docsContent.layout.practicesTitle}</h3>
                <ul class="space-y-3 text-sm text-slate-600">
                  {#each docsContent.layout.practicesList as item}
                    <li class="flex gap-2"><div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div> {@html item}</li>
                  {/each}
                </ul>
             </div>
          </div>
        </div>

      {:else if activeSection === 'scripting'}
         <div class="space-y-10 animate-fade-in">
           <div class="border-b border-slate-100 pb-8">
             <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.scripting.title}</h2>
             <p class="text-slate-500 text-lg">
               <!-- Svelte parsing issues with <script> string in content -->
               {@html docsContent.scripting.intro}
             </p>
          </div>

          <div class="space-y-6">
             <div class="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
               <h3 class="font-bold text-amber-900 mb-2">{docsContent.scripting.howTitle}</h3>
               <p class="text-sm text-amber-800 leading-relaxed whitespace-pre-wrap">
                 {@html docsContent.scripting.howBody}
               </p>
             </div>

             <div class="space-y-2">
                <span class="text-xs font-black uppercase tracking-widest text-slate-400">Example: Filtering & Sorting</span>
                <div class="bg-slate-900 rounded-2xl p-6 shadow-xl">
                  <pre class="font-mono text-sm text-emerald-300 overflow-x-auto"><code>{scriptExample.trim()}</code></pre>
                </div>
             </div>
          </div>
         </div>
      {/if}
    </div>
  </main>
</div>

<style>
  @reference "tailwindcss";

  .animate-fade-in {
    animation: fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .custom-scrollbar::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
</style>
