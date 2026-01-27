<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { 
    Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
    Type, Minus, Square, Circle, Trash2, X, ChevronLeft, Plus
  } from 'lucide-svelte';

  // We receive the selected item (if any) and callbacks
  interface Props {
    selectedItem: any | null; 
    onUpdate: (updates: any) => void;
    onAddShape: (type: 'line' | 'box' | 'circle') => void;
    onDelete: () => void;
    onClose: () => void;
  }

  let { selectedItem, onUpdate, onAddShape, onDelete, onClose } = $props<Props>();

  // Style helpers
  function updateStyle(key: string, value: any) {
    if (!selectedItem) return;
    const currentStyle = selectedItem.style || {};
    onUpdate({ style: { ...currentStyle, [key]: value } });
  }

  const fonts = ['sans-serif', 'serif', 'monospace', 'Inter', 'Georgia', 'Courier New'];
  const colors = ['#000000', '#475569', '#2563eb', '#dc2626', '#16a34a', '#d97706'];
</script>

{#if selectedItem}
  <div class="fixed inset-0 z-[100] flex justify-end pointer-events-none" transition:fade>
    <!-- Background Dimmer (Interactive) -->
    <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto" onclick={onClose}></div>
    
    <!-- Slide-over Panel: Full Screenish -->
    <aside 
      class="relative w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full overflow-y-auto pointer-events-auto"
      transition:fly={{ x: 800, duration: 500, opacity: 1 }}
    >
      <!-- Header -->
      <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <div class="flex items-center gap-4">
          <button onclick={onClose} class="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h3 class="text-lg font-black uppercase tracking-widest text-slate-800">Advanced Editor</h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded uppercase">{selectedItem.type}</span>
              <span class="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Editing properties</span>
            </div>
          </div>
        </div>
        <button onclick={onClose} class="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
          <X size={24} />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto bg-slate-50/30">
        <div class="max-w-2xl mx-auto p-12 space-y-16">
          
          <!-- Typography Section -->
          {#if selectedItem.type === 'text'}
            <section class="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Type size={20} />
                </div>
                <div>
                  <h4 class="text-sm font-black uppercase tracking-widest text-slate-800">Typography</h4>
                  <p class="text-xs text-slate-400 font-medium mt-0.5">Customize font, size, and style</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <!-- Font Family -->
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Font Family</label>
                  <select 
                    class="w-full text-base p-4 border-2 border-slate-50 rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold"
                    value={selectedItem.style?.fontFamily || 'sans-serif'}
                    onchange={(e) => updateStyle('fontFamily', e.currentTarget.value)}
                  >
                    {#each fonts as font}
                      <option value={font}>{font}</option>
                    {/each}
                  </select>
                </div>

                <!-- Text Size -->
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Text Size (PX)</label>
                  <input 
                    type="number" 
                    class="w-full text-base p-4 border-2 border-slate-50 rounded-2xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold" 
                    value={parseInt(selectedItem.style?.fontSize) || 16}
                    oninput={(e) => updateStyle('fontSize', e.currentTarget.value + 'px')}
                  />
                </div>

                <!-- Emphasis -->
                <div class="space-y-3">
                   <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Emphasis</label>
                   <div class="flex gap-4">
                    <button 
                      class="flex-1 p-4 rounded-2xl border-2 transition-all {selectedItem.style?.fontWeight === 'bold' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-slate-100'}"
                      onclick={() => updateStyle('fontWeight', selectedItem.style?.fontWeight === 'bold' ? 'normal' : 'bold')}
                    >
                      <Bold size={20} class="mx-auto" />
                    </button>
                    <button 
                      class="flex-1 p-4 rounded-2xl border-2 transition-all {selectedItem.style?.fontStyle === 'italic' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-slate-100'}"
                      onclick={() => updateStyle('fontStyle', selectedItem.style?.fontStyle === 'italic' ? 'normal' : 'italic')}
                    >
                      <Italic size={20} class="mx-auto" />
                    </button>
                  </div>
                </div>

                <!-- Alignment -->
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Alignment</label>
                  <div class="flex gap-2">
                    <button 
                      class="flex-1 p-4 rounded-2xl border-2 transition-all {selectedItem.style?.textAlign === 'left' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-50 text-slate-400'}"
                      onclick={() => updateStyle('textAlign', 'left')}
                    ><AlignLeft size={20} class="mx-auto" /></button>
                    <button 
                      class="flex-1 p-4 rounded-2xl border-2 transition-all {selectedItem.style?.textAlign === 'center' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-50 text-slate-400'}"
                      onclick={() => updateStyle('textAlign', 'center')}
                    ><AlignCenter size={20} class="mx-auto" /></button>
                    <button 
                      class="flex-1 p-4 rounded-2xl border-2 transition-all {selectedItem.style?.textAlign === 'right' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-50 text-slate-400'}"
                      onclick={() => updateStyle('textAlign', 'right')}
                    ><AlignRight size={20} class="mx-auto" /></button>
                  </div>
                </div>
              </div>

              <!-- Colors -->
              <div class="space-y-4">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Text Color</label>
                <div class="flex flex-wrap gap-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  {#each colors as c}
                    <button 
                      class="w-12 h-12 rounded-2xl border-4 {selectedItem.style?.color === c ? 'border-blue-500 scale-110 shadow-lg' : 'border-slate-100'} transition-all hover:scale-110"
                      style="background-color: {c}"
                      onclick={() => updateStyle('color', c)}
                    ></button>
                  {/each}
                  <div class="w-12 h-12 relative group">
                    <input 
                      type="color" 
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      value={selectedItem.style?.color || '#000000'}
                      oninput={(e) => updateStyle('color', e.currentTarget.value)}
                    />
                    <div class="w-full h-full rounded-2xl border-4 border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-all">
                      <Plus size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          {/if}

          <!-- Appearance for shapes -->
          {#if selectedItem.type !== 'text'}
             <section class="space-y-8 animate-in fade-in slide-in-from-bottom-4">
               <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                   <Square size={20} />
                 </div>
                 <div>
                   <h4 class="text-sm font-black uppercase tracking-widest text-slate-800">Appearance</h4>
                   <p class="text-xs text-slate-400 font-medium mt-0.5">Colors and visibility</p>
                 </div>
               </div>
               <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                 <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Background Color</div>
                 <input 
                  type="color" 
                  class="w-full h-20 rounded-2xl border-4 border-slate-100 p-2 bg-slate-50 cursor-pointer hover:bg-white transition-all outline-none"
                  value={selectedItem.style?.backgroundColor || '#e2e8f0'}
                  oninput={(e) => updateStyle('backgroundColor', e.currentTarget.value)}
                />
               </div>
             </section>
          {/if}

          <!-- Danger Zone -->
          <footer class="pt-10 space-y-6">
            <button 
              class="w-full py-6 bg-red-50 text-red-600 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-sm"
              onclick={onDelete}
            >
              <Trash2 size={20} /> Remove Element
            </button>
            <p class="text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">RESUME ARCHITECT DESIGN ENGINE V1.0</p>
          </footer>

        </div>
      </div>
    </aside>
  </div>
{:else}
  <!-- Library Sidebar (Always visible contextually) -->
  <aside 
    class="w-80 bg-white border-l border-slate-100 flex flex-col h-full shrink-0 print:hidden z-20 shadow-sm overflow-y-auto"
  >
    <div class="p-6 border-b border-slate-50">
      <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Element Library</h3>
    </div>

    <div class="p-6 space-y-8">
      <div class="space-y-3">
        <label class="text-[10px] font-black text-slate-300 uppercase tracking-widest block px-1">Drag and Drop</label>
        
        <button 
          class="flex items-center gap-4 w-full p-4 bg-slate-50/50 border-2 border-slate-50 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all text-slate-600 text-xs font-black uppercase tracking-widest group"
          onclick={() => onAddShape('line')}
        >
          <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
            <Minus size={18} />
          </div>
          Horizontal Divider
        </button>
        
        <button 
          class="flex items-center gap-4 w-full p-4 bg-slate-50/50 border-2 border-slate-50 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all text-slate-600 text-xs font-black uppercase tracking-widest group"
          onclick={() => onAddShape('box')}
        >
          <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
            <Square size={18} />
          </div>
          Layout Container
        </button>

         <button 
          class="flex items-center gap-4 w-full p-4 bg-slate-50/50 border-2 border-slate-50 rounded-2xl hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all text-slate-600 text-xs font-black uppercase tracking-widest group"
          onclick={() => onAddShape('circle')}
        >
          <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
            <Circle size={18} />
          </div>
          Badge / Accent
        </button>
      </div>

      <div class="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
        <p class="text-[10px] font-black uppercase tracking-widest relative z-10 opacity-80">Pro Editor</p>
        <p class="text-xs font-bold leading-relaxed mt-2 relative z-10">Select any item on the grid to open the full design studio.</p>
      </div>
    </div>
  </aside>
{/if}
