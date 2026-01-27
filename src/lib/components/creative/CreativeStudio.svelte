<script lang="ts">
  import CanvasItem from './CanvasItem.svelte';
  import EditPanel from './EditPanel.svelte';
  import { db, type Profile } from '$lib/db';
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    profile: Profile;
  }

  let { profile } = $props<Props>();

  interface Item {
    id: string;
    type: 'text' | 'image' | 'box' | 'line' | 'circle';
    x: number;
    y: number;
    w: number;
    h: number;
    data: string;
    style?: any;
  }

  // State
  let items = $state<Item[]>([]);
  let selectedId = $state<string | null>(null);

  // Derived
  let selectedItem = $derived(items.find(i => i.id === selectedId) || null);

  // Persistence
  async function loadDesign() {
    const saved = await db.creativeDesigns.get('draft-latest');
    if (saved && saved.items) {
      items = saved.items as Item[];
    } else {
      // Default / Starter
      items = [
        { id: '1', type: 'text', x: 40, y: 40, w: 400, h: 60, data: `${profile.basics.firstName} ${profile.basics.lastName}` },
        { id: '2', type: 'text', x: 40, y: 120, w: 600, h: 40, data: profile.basics.title || 'Professional Title' },
      ];
    }
  }

  async function saveDesign() {
    await db.creativeDesigns.put({
      id: 'draft-latest',
      name: 'Auto Save',
      updated: Date.now(),
      items
    });
  }

  // Handlers
  function handleUpdate(id: string, updates: Partial<Item>) {
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      saveDesign(); 
    }
  }

  function handleAddShape(type: 'line' | 'box' | 'circle') {
    const newItem: Item = {
      id: crypto.randomUUID(),
      type,
      x: 100, 
      y: 100,
      w: type === 'line' ? 200 : 100,
      h: type === 'line' ? 2 : 100,
      data: '',
      style: type === 'line' ? { backgroundColor: '#000000' } : { backgroundColor: '#e2e8f0' }
    };
    items.push(newItem);
    selectedId = newItem.id;
    saveDesign();
  }

  // --- Keyboard & Drag ---

  function handleKeyDown(e: KeyboardEvent) {
    if (!selectedId) return;
    // Don't delete if typing in an input (future proofing)
    if (document.activeElement?.tagName === 'INPUT') return; 

    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteSelected();
    }
  }

  onMount(() => {
    loadDesign();
    window.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  function handleSelect(id: string) {
    selectedId = id;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (!e.dataTransfer) return;
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    
    const payload = JSON.parse(raw);
    
    const page = document.getElementById('creative-canvas');
    if (!page) return;
    
    const rect = page.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    
    const x = Math.max(0, Math.round(rawX / 20) * 20);
    const y = Math.max(0, Math.round(rawY / 20) * 20);

    const newItem: Item = {
      id: crypto.randomUUID(),
      type: 'text',
      x, 
      y,
      w: 300,
      h: 40,
      data: payload.data,
      style: { fontSize: '14px' }
    };
    items.push(newItem);
    selectedId = newItem.id;
    saveDesign();
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }
  
  function deleteSelected() {
    if (selectedId) {
       items = items.filter(i => i.id !== selectedId);
       selectedId = null;
       saveDesign();
    }
  }

  function handleBgClick(e: MouseEvent) {
    if (e.target === e.currentTarget || (e.target as HTMLElement).id === 'creative-canvas') {
      selectedId = null;
    }
  }
</script>

<div class="studio-layout flex flex-row bg-slate-100 overflow-hidden h-full">
  
  <!-- Main Canvas Area -->
  <div 
    class="flex-1 overflow-auto p-12 relative h-full flex justify-center items-start outline-none"
    ondrop={handleDrop}
    ondragover={handleDragOver}
    onclick={handleBgClick}
    onkeydown={(e) => { if (e.key === 'Escape') selectedId = null; }}
    role="button"
    tabindex="-1"
    aria-label="Canvas Background"
  >
    <div 
      id="creative-canvas"
      class="creative-page shadow-2xl scale-[0.95] origin-top my-8"
    >
      <div class="grid-pattern"></div>
      
      {#each items as item (item.id)}
        <CanvasItem 
          id={item.id}
          x={item.x}
          y={item.y}
          w={item.w}
          h={item.h}
          text={item.data}
          type={item.type}
          style={item.style}
          isSelected={selectedId === item.id}
          onUpdate={handleUpdate}
          onSelect={handleSelect}
        />
      {/each}
    </div>
  </div>

  <!-- Right Side: Library (Sidebar) or Editor (Slide-over) -->
  <EditPanel 
    selectedItem={selectedItem}
    onUpdate={(updates) => handleUpdate(selectedId!, updates)}
    onAddShape={handleAddShape}
    onDelete={deleteSelected}
    onClose={() => selectedId = null}
  />
</div>

<style>
  .studio-layout {
    height: 100%;
    width: 100%;
    position: relative;
  }

  /* The actual A4 Page */
  .creative-page {
    width: 210mm;
    height: 297mm;
    background: white;
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
  }

  .grid-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 10px 10px;
    pointer-events: none;
  }

  @media print {
    .studio-layout {
      display: block;
      height: auto;
      overflow: visible;
      background: white;
    }
    .creative-page {
      box-shadow: none;
      margin: 0;
      position: absolute;
      top: 0;
      left: 0;
      scale: 1 !important;
    }
  }
</style>
