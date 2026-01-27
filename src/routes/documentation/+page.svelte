<script lang="ts">
  import { Database, Code, BookOpen, ChevronRight, Layout, FileJson, ArrowLeft, Server, Save, Copy, Check, Smartphone } from 'lucide-svelte';

  let activeSection = $state('intro');
  let copied = $state(false);

  const sections = [
    { id: 'intro', title: 'Introduction', icon: BookOpen },
    { id: 'custom', title: 'Pure Mode Guide', icon: Code },
    { id: 'schema', title: 'Data Schema', icon: Database },
    { id: 'tokens', title: 'Pro Styling', icon: FileJson },
  ];

  /* Documentation Content Config - Centralized for easy copying */
  const docsContent = {
    intro: {
      title: "Architect Developer Portal",
      body: "Welcome to the Developer Documentation. The Resume Architect now supports **Pure Mode**, allowing you to build resumes using standard HTML, CSS, and JavaScript, just like a real website."
    },
    custom: {
      title: "Pure Mode (HTML/JS)",
      intro: "Build your resume exactly like a Single Page Application.",
      body: "We use a sandboxed `<iframe>` to render your code. This gives you a blank canvas with **zero restrictions**.\n\n**How it works:**\n1. Write standard HTML/CSS.\n2. Use `fetch('/api/profile')` to get your data.\n3. Use vanilla JS to render the content.\n\n### Available Endpoints\n\n- **GET** `/api/profile`\n  Returns the full JSON profile object (see Data Schema).\n  *Usage:* `await fetch('/api/profile').then(res => res.json())`\n\nNo proprietary syntax. No regex. Just the web platform."
    },
    schema: {
      title: "Data Schema",
      intro: "The JSON structure returned by `/api/profile`.",
      // Schema details handled by the renderer below
    },
    tokens: {
      title: "Pro Styling & Design",
      intro: "Tips for making your resume look professional in an Iframe.",
      variablesTitle: "Recommended Practices",
      variablesBody: "Since you are in a standard browser environment:\n\n• **Fonts:** Use `<link>` tags to load Google Fonts.\n• **Sizing:** Use `cm`, `mm`, or `pt` for print-perfect dimensions (e.g. `21cm` width).\n• **Printing:** Use `@media print` to hide buttons or interactive elements.",
      fontsTitle: "System Fonts",
      fontsBody: "We inject system-ui fonts by default, but you have full control to override `body { font-family: ... }`."
    },
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


  const vanillaTemplateExample = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 40px; color: #333; }
    h1 { margin-bottom: 0.5rem; }
    .job { margin-bottom: 24px; border-left: 4px solid #3b82f6; padding-left: 20px; }
    .date { color: #64748b; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div id="app">Loading...</div>

  <script>
    async function render() {
      // 1. Fetch your data
      const res = await fetch('/api/profile');
      const profile = await res.json();

      // 2. Build your HTML using standard Template Literals
      const html = \`
        <h1>\${profile.basics.firstName} \${profile.basics.lastName}</h1>
        <p class="lead">\${profile.basics.title}</p>
        <p>\${profile.basics.summary}</p>
        <hr style="margin: 2rem 0; border:none; border-top:1px solid #eee;" />
        
        <h2>Experience</h2>
        \${profile.experience.map(exp => \`
          <div class="job">
            <h3>\${exp.role} <span>at \${exp.company}</span></h3>
            <p class="date">\${exp.startDate} - \${exp.current ? 'Present' : exp.endDate}</p>
            <p>\${exp.raw_context || ''}</p>
          </div>
        \`).join('')}
      \`;

      // 3. Inject it into the page
      document.getElementById('app').innerHTML = html;
    }

    render();
  <\/script>
</body>
</html>
`;

  function copyAllDocs() {
    const allText = [
      `# ${docsContent.intro.title}\n${docsContent.intro.body}\n`,
      `# ${docsContent.custom.title}\n${docsContent.custom.intro}\n${docsContent.custom.body}\n\nStarter Template:\n\`\`\`html${vanillaTemplateExample}\n\`\`\`\n`,
      `# ${docsContent.schema.title}\n${docsContent.schema.intro}\n\`\`\`json${fullProfileSchema}\n\`\`\`\n`,
      `# ${docsContent.tokens.title}\n${docsContent.tokens.intro}\n## ${docsContent.tokens.variablesTitle}\n${docsContent.tokens.variablesBody}\n`
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
            <button onclick={() => activeSection = 'custom'} class="p-6 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-50 transition-all group text-left">
              <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Code size={24} />
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{docsContent.custom.title}</h3>
              <p class="text-sm text-slate-500">Learn how to code your own layouts with HTML & CSS.</p>
            </button>

            <button onclick={() => activeSection = 'schema'} class="p-6 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all group text-left">
              <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Database size={24} />
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{docsContent.schema.title}</h3>
              <p class="text-sm text-slate-500">Understand the `Profile` object structure.</p>
            </button>

            <button onclick={() => activeSection = 'tokens'} class="p-6 rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all group text-left">
              <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <FileJson size={24} />
              </div>
              <h3 class="text-lg font-bold text-slate-900 mb-1">{docsContent.tokens.title}</h3>
              <p class="text-sm text-slate-500">Master typography and design tokens.</p>
            </button>
          </div>
        </div>

       {:else if activeSection === 'custom'}
         <div class="space-y-10 animate-fade-in">
           <div class="border-b border-slate-100 pb-8">
             <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.custom.title}</h2>
             <p class="text-slate-500">{@html docsContent.custom.intro}</p>
           </div>
           
           <div class="p-8 bg-slate-50 rounded-3xl border border-slate-200">
             <p class="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">{@html docsContent.custom.body}</p>
           </div>
           
           <div class="space-y-4">
              <div class="flex items-center gap-2 text-slate-400">
                 <Code size={16} />
                 <span class="text-xs font-black uppercase tracking-widest">Vanilla JS Starter Template</span>
              </div>
              <div class="bg-slate-900 rounded-2xl p-6 overflow-hidden shadow-xl">
                <pre class="font-mono text-[10px] text-blue-300 overflow-x-auto custom-scrollbar"><code>{vanillaTemplateExample.trim()}</code></pre>
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
         </div>

       {:else if activeSection === 'tokens'}
        <div class="space-y-10 animate-fade-in">
          <div class="border-b border-slate-100 pb-8">
            <h2 class="text-3xl font-black text-slate-900 tracking-tight mb-4">{docsContent.tokens.title}</h2>
            <p class="text-slate-500 text-lg">
              {docsContent.tokens.intro}
            </p>
          </div>

          <div class="space-y-6">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
               <h3 class="text-lg font-bold text-slate-900">{docsContent.tokens.variablesTitle}</h3>
               <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{@html docsContent.tokens.variablesBody}</p>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
               <h3 class="text-lg font-bold text-slate-900">{docsContent.tokens.fontsTitle}</h3>
               <p class="text-slate-600 text-sm leading-relaxed">{docsContent.tokens.fontsBody}</p>
               <div class="bg-slate-900 rounded-xl p-4">
                 <pre class="text-xs text-amber-300 font-mono"><code>{`<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">`}</code></pre>
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
