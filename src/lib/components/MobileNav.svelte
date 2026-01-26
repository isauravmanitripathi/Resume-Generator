<script lang="ts">
  import { Menu } from 'lucide-svelte';

  let { onOpen } = $props();
</script>

<header class="md:hidden bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30 print:hidden">
  <div class="flex items-center gap-2">
    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
      INR
    </div>
    <span class="font-bold text-lg text-slate-800 tracking-tight">I Need A Resume</span>
  </div>

  <button
    onclick={onOpen}
    class="p-2 text-slate-600 hover:bg-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Open menu"
  >
    <Menu size={24} />
  </button>
</header>
