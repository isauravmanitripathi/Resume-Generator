<script lang="ts">
  import { onMount } from 'svelte';
  import { activityDb, type ActivityLog } from '$lib/activityDb';
  import { Database, Clock, ChevronRight, Terminal, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

  let logs = $state<ActivityLog[]>([]);
  let selectedId = $state<number | null>(null);
  let loading = $state(true);

  onMount(async () => {
    await loadLogs();
  });

  async function loadLogs() {
    loading = true;
    logs = await activityDb.logs.orderBy('timestamp').reverse().toArray();
    loading = false;
  }

  async function clearLogs() {
    if (confirm('Are you sure you want to clear all activity logs?')) {
      await activityDb.logs.clear();
      await loadLogs();
      selectedId = null;
    }
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
</script>

<div class="w-full flex flex-col lg:flex-row gap-8 min-h-[600px] h-[70vh]">
  <!-- Log List -->
  <aside class="w-full lg:w-[400px] shrink-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
    <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
       <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution History</span>
       <div class="flex items-center gap-2">
         <button onclick={loadLogs} class="p-1 px-2 hover:bg-slate-100 rounded text-[10px] font-bold text-slate-500 transition-colors flex items-center gap-1">
           <RefreshCw size={10} class={loading ? 'animate-spin' : ''} /> Refresh
         </button>
         <button onclick={clearLogs} class="p-1 px-2 hover:bg-rose-50 rounded text-[10px] font-bold text-rose-500 transition-colors flex items-center gap-1">
           <Trash2 size={10} /> Clear
         </button>
       </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      {#if logs.length === 0}
        <div class="h-full flex flex-col items-center justify-center p-8 text-center opacity-30">
          <Database size={32} class="mb-2" />
          <p class="text-xs font-bold">No activity recorded yet</p>
        </div>
      {:else}
        {#each logs as log (log.id)}
          <button 
            onclick={() => selectedId = log.id!}
            class="w-full p-4 border-b border-slate-50 text-left transition-all hover:bg-slate-50 group flex items-start gap-3
            {selectedId === log.id ? 'bg-emerald-50/50 border-emerald-100' : ''}"
          >
            <div class="shrink-0 mt-0.5">
               {#if log.status === 'success'}
                 <CheckCircle2 size={16} class="text-emerald-500" />
               {:else}
                 <AlertCircle size={16} class="text-rose-500" />
               {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 mb-1">
                <p class="text-[9px] font-black uppercase text-slate-500 tracking-wider truncate">
                  {log.provider} • {log.model.split('/')[0]}
                </p>
                <span class="text-[9px] font-medium text-slate-400 shrink-0">
                  {formatTime(log.timestamp)}
                </span>
              </div>
              <p class="text-xs font-bold text-slate-700 line-clamp-2 leading-snug">
                {log.request.messages?.[log.request.messages.length - 1]?.content || 'API Command'}
              </p>
              <p class="text-[9px] text-slate-400 mt-1">{formatDate(log.timestamp)}</p>
            </div>
            <ChevronRight size={14} class="text-slate-300 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
          </button>
        {/each}
      {/if}
    </div>
  </aside>

  <!-- Detail View -->
  <main class="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden h-full">
    {#if selectedId !== null && logs.find(l => l.id === selectedId)}
      {@const log = logs.find(l => l.id === selectedId)!}
      <div class="flex-1 flex flex-col overflow-hidden" in:fade={{ duration: 200 }}>
        <header class="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
             <div class="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
               <Terminal size={18} />
             </div>
             <div>
               <h3 class="text-sm font-bold text-slate-800">Call #{log.id}</h3>
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                 {log.provider} ({log.model})
               </p>
             </div>
          </div>
          
          <div class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest 
            {log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
            {log.status}
          </div>
        </header>

        <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/10">
          <section class="space-y-3">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock size={12} /> Request Payload
            </h4>
            <div class="relative group">
              <pre class="w-full p-5 bg-slate-900 text-emerald-400 rounded-2xl text-[11px] overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed shadow-lg">
{JSON.stringify(log.request, null, 2)}
              </pre>
            </div>
          </section>

          <section class="space-y-3">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Database size={12} /> API Response
            </h4>
            <div class="relative group">
              <pre class="w-full p-5 bg-slate-900 text-blue-400 rounded-2xl text-[11px] overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed shadow-lg">
{JSON.stringify(log.response, null, 2)}
              </pre>
            </div>
          </section>
        </div>
      </div>
    {:else}
      <div class="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-40">
        <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Terminal size={32} class="text-slate-300" />
        </div>
        <p class="text-sm font-bold text-slate-400 max-w-[200px]">Select an execution from the history to inspect payload details.</p>
      </div>
    {/if}
  </main>
</div>
