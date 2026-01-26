<script lang="ts">
  import { page } from '$app/stores';
  import { FileText, LayoutTemplate, Database, History, Settings, X } from 'lucide-svelte';

  let { isOpen = false, onClose } = $props();

  const links = [
    { href: '/', label: 'Architect', icon: LayoutTemplate },
    { href: '/vault', label: 'Vault', icon: Database },
    { href: '/history', label: 'History', icon: History },
    { href: '/settings', label: 'Settings', icon: Settings }
  ];
</script>

<!-- Mobile Overlay Backdrop -->
{#if isOpen}
  <button
    class="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in"
    onclick={onClose}
    aria-label="Close menu"
  ></button>
{/if}

<!-- Sidebar Container -->
<aside class="
  bg-slate-50 border-r border-slate-200 h-screen flex flex-col p-4
  fixed top-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out
  print:hidden
  {isOpen ? 'translate-x-0' : '-translate-x-full'}
  md:translate-x-0 md:static md:h-screen
">
  <div class="flex items-center justify-between mb-8 px-2">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
        INR
      </div>
      <span class="font-bold text-lg text-slate-800 tracking-tight">I Need A Resume</span>
    </div>
    <!-- Close button for mobile -->
    <button onclick={onClose} class="md:hidden text-slate-500 hover:text-slate-800">
      <X size={24} />
    </button>
  </div>

  <nav class="flex-1 space-y-1">
    {#each links as link}
      <a
        href={link.href}
        onclick={onClose} 
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
        {$page.url.pathname === link.href
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
      >
        <link.icon size={18} />
        {link.label}
      </a>
    {/each}
  </nav>

  <div class="mt-auto px-2">
    <div class="text-xs text-slate-400 font-medium">
      Local-First & Secure
    </div>
  </div>
</aside>

