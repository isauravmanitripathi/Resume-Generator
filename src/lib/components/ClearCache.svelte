<script lang="ts">
  import { Trash2, CheckCircle2, X } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  let showToast = $state(false);
  let isCleaning = $state(false);

  function clearCache() {
    isCleaning = true;
    
    // Clear LocalStorage
    localStorage.clear();
    
    // Clear SessionStorage
    sessionStorage.clear();
    
    // Clear Cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Simulate a small delay for user feedback
    setTimeout(() => {
      isCleaning = false;
      showToast = true;
      
      // Reload after showing success message
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }, 800);
  }
</script>

<!-- Floating Action Button -->
<div class="fixed bottom-6 right-6 z-50 print:hidden">
  <button
    onclick={clearCache}
    class="w-12 h-12 bg-white border border-slate-200 shadow-lg shadow-slate-200/50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all group"
    title="Clear App Cache & Cookies"
  >
    <Trash2 size={20} class={isCleaning ? 'animate-bounce' : ''} />
    <span class="absolute right-full mr-3 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      Clear Cache
    </span>
  </button>
</div>

<!-- Toast Notification -->
{#if showToast}
  <div 
    transition:fly={{ y: 20, duration: 300 }}
    class="fixed bottom-24 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3"
  >
    <CheckCircle2 size={18} class="text-emerald-400" />
    <div>
      <p class="text-xs font-bold">Cache Cleared</p>
      <p class="text-[10px] text-slate-400">Reloading application...</p>
    </div>
  </div>
{/if}
