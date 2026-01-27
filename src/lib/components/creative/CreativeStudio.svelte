<script lang="ts">
  import CanvasItem from './CanvasItem.svelte';
  import type { Profile } from '$lib/db';
  import { Plus, Type, Trash2 } from 'lucide-svelte';

  interface Props {
    profile: Profile;
  }

  let { profile } = $props<Props>();

  interface Item {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    w: number;
    h: number;
    data: string;
  }

  // Initial State: Populate with some basics if empty
  let items = $state<Item[]>([
    { id: '1', type: 'text', x: 40, y: 40, w: 400, h: 60, data: `${profile.basics.firstName} ${profile.basics.lastName}` },
    { id: '2', type: 'text', x: 40, y: 120, w: 600, h: 40, data: profile.basics.title || 'Professional Title' },
  ]);

  let selectedId = $state<string | null>(null);

  // Available Data Tokens for Sidebar
  const tokens = $derived([
    { label: 'Full Name', value: `${profile.basics.firstName} ${profile.basics.lastName}` },
    { label: 'Job Title', value: profile.basics.title },
    { label: 'Email', value: profile.basics.email },
    { label: 'Phone', value: profile.basics.phone },
    { label: 'Summary', value: profile.basics.summary?.slice(0, 50) + '...' }, // Preview
    // Add more as needed
  ]);

  function handleUpdate(id: string, updates: Partial<Item>) {
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
    }
  }

  function handleSelect(id: string) {
    selectedId = id;
  }

  function handleAddText(text: string) {
    const newItem: Item = {
      id: crypto.randomUUID(),
      type: 'text',
      x: 100,
      y: 100,
      w: 200,
      h: 40,
      data: text || 'New Text'
    };
    items.push(newItem);
    selectedId = newItem.id;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (!e.dataTransfer) return;
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    
    const payload = JSON.parse(raw);
    
    // Calculate position relative to the A4 page
    const page = document.getElementById('creative-canvas');
    if (!page) return;
    
    const rect = page.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    
    // Allow placing anywhere, clamp to positive to avoid loss
    const x = Math.max(0, Math.round(rawX / 20) * 20);
    const y = Math.max(0, Math.round(rawY / 20) * 20);

    const newItem: Item = {
      id: crypto.randomUUID(),
      type: 'text',
      x, 
      y,
      w: 300,
      h: 40,
      data: payload.data
    };
    items.push(newItem);
    selectedId = newItem.id;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
  }
  
  function deleteSelected() {
    if (selectedId) {
       items = items.filter(i => i.id !== selectedId);
       selectedId = null;
    }
  }

  function handleBgClick(e: MouseEvent) {
    // Only deselect if clicking background (wrapper or page), not item
    if (e.target === e.currentTarget || (e.target as HTMLElement).id === 'creative-canvas') {
      selectedId = null;
    }
  }
</script>

<div class="studio-layout">
  <!-- Toolbar -->
  <div class="toolbar print:hidden">
    <button class="tool-btn" onclick={(e) => { e.stopPropagation(); handleAddText('New Text'); }}>
      <Type size={14} /> <span>Add Text</span>
    </button>
    {#if selectedId}
      <div class="divider"></div>
      <button class="tool-btn danger" onclick={(e) => { e.stopPropagation(); deleteSelected(); }}>
        <Trash2 size={14} /> <span>Delete</span>
      </button>
    {/if}
  </div>

  <!-- Canvas: A4 Drop Zone -->
  <main 
    class="canvas-wrapper"
    ondrop={handleDrop}
    ondragover={handleDragOver}
    onclick={handleBgClick}
    role="application"
  >
    <div 
      id="creative-canvas"
      class="creative-page"
    >
      <!-- Background Grid -->
      <div class="grid-pattern"></div>
      
      <!-- Placed Items -->
      {#each items as item (item.id)}
        <CanvasItem 
          id={item.id}
          x={item.x}
          y={item.y}
          w={item.w}
          h={item.h}
          text={item.data}
          isSelected={selectedId === item.id}
          onUpdate={handleUpdate}
          onSelect={handleSelect}
        />
      {/each}
    </div>
  </main>
</div>

<style>
  .studio-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #e2e8f0;
  }

  .toolbar {
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 0.5rem;
    border-radius: 9999px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 0.5rem;
    align-items: center;
    z-index: 50;
  }

  .tool-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #475569;
    background: #f1f5f9;
    transition: all 0.2s;
  }
  .tool-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
  .tool-btn.danger {
    background: #fef2f2;
    color: #ef4444;
  }
  .tool-btn.danger:hover {
    background: #fee2e2;
  }

  .divider {
    width: 1px;
    height: 1.5rem;
    background: #e2e8f0;
  }

  .canvas-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    overflow: auto;
    padding: 2rem;
    padding-top: 4rem; /* Space for toolbar */
  }

  /* The actual A4 Page */
  .creative-page {
    width: 210mm;
    height: 297mm;
    background: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
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
    .toolbar, .canvas-wrapper {
      display: none;
    }
    .creative-page {
      box-shadow: none;
      margin: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
