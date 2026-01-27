<script lang="ts">
  import { toasts } from '$lib/toastStore';
  import { fade, fly } from 'svelte/transition';
  import { Info, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-svelte';
  import { flip } from 'svelte/animate';
</script>

<div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none w-80">
  {#each $toasts as toast (toast.id)}
    <div 
      animate:flip={{ duration: 200 }}
      in:fly={{ x: 20, duration: 300 }}
      out:fade={{ duration: 200 }}
      class="pointer-events-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-4 flex items-center gap-3 overflow-hidden"
    >
      <div class="shrink-0">
        {#if toast.type === 'loading'}
          <Loader2 size={18} class="text-blue-500 animate-spin" />
        {:else if toast.type === 'success'}
          <CheckCircle2 size={18} class="text-emerald-500" />
        {:else if toast.type === 'error'}
          <AlertCircle size={18} class="text-rose-500" />
        {:else}
          <Info size={18} class="text-slate-400" />
        {/if}
      </div>

      <p class="text-xs font-bold text-slate-700 flex-1 leading-tight">
        {toast.message}
      </p>

      <button 
        onclick={() => toasts.remove(toast.id)}
        class="p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  {/each}
</div>
