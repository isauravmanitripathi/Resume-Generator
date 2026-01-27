<script lang="ts">
  import { page } from '$app/stores';
  import { LayoutTemplate, Database, History, Settings, BookOpen } from 'lucide-svelte';

  const links = [
    { href: '/', label: 'Architect', icon: LayoutTemplate },
    { href: '/vault', label: 'Vault', icon: Database },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/documentation', label: 'Docs', icon: BookOpen } // Added Docs Link
  ];
</script>

<header class="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 print:hidden w-full">
  <div class="flex items-center gap-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-100">
        INR
      </div>
      <span class="font-bold text-lg text-slate-800 tracking-tight hidden sm:inline-block">I Need A Resume</span>
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-1">
      {#each links as link}
        <a
          href={link.href}
          class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
          {$page.url.pathname === link.href
            ? 'bg-blue-50 text-blue-700 shadow-sm'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}"
        >
          <link.icon size={16} />
          {link.label}
        </a>
      {/each}
    </nav>
  </div>

  <!-- Mobile Nav Icons Only -->
  <nav class="flex md:hidden items-center gap-1">
     {#each links as link}
      <a
        href={link.href}
        class="p-2 rounded-lg transition-colors
        {$page.url.pathname === link.href
          ? 'text-blue-600 bg-blue-50'
          : 'text-slate-500 hover:bg-slate-50'}"
        title={link.label}
      >
        <link.icon size={20} />
      </a>
    {/each}
  </nav>

  <div class="hidden lg:block">
     <span class="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Secure & Local</span>
  </div>
</header>
