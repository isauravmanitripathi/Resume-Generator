<script lang="ts">
  import { onMount } from 'svelte';
  
  interface Props {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    text: string;
    type?: 'text' | 'box' | 'line' | 'circle';
    style?: any;
    isSelected: boolean;
    onUpdate: (id: string, updates: Partial<Props>) => void;
    onSelect: (id: string) => void;
  }

  let { id, x, y, w, h, text, type = 'text', style = {}, isSelected, onUpdate, onSelect } = $props<Props>();

  let isDragging = false;
  let isResizing = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let initialX = 0;
  let initialY = 0;
  let initialW = 0;
  let initialH = 0;

  // Grid Size
  const GRID = 20;

  function handleMouseDown(e: MouseEvent) {
    if (e.target.classList.contains('resize-handle')) return;
    
    e.stopPropagation();
    onSelect(id);
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialX = x;
    initialY = y;
    
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', stopDrag);
  }

  function handleDrag(e: MouseEvent) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    
    // Snap logic
    const rawX = initialX + dx;
    const rawY = initialY + dy;
    
    const snappedX = Math.round(rawX / GRID) * GRID;
    const snappedY = Math.round(rawY / GRID) * GRID;
    
    if (snappedX !== x || snappedY !== y) {
      onUpdate(id, { x: snappedX, y: snappedY });
    }
  }

  function stopDrag() {
    isDragging = false;
    window.removeEventListener('mousemove', handleDrag);
    window.removeEventListener('mouseup', stopDrag);
  }

  // --- Resizing ---

  function handleResizeStart(e: MouseEvent) {
    e.stopPropagation();
    isResizing = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialW = w;
    initialH = h;
    
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResize);
  }

  function handleResize(e: MouseEvent) {
    if (!isResizing) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    
    const rawW = initialW + dx;
    const rawH = initialH + dy;
    
    // Snap width/height
    const snappedW = Math.max(GRID, Math.round(rawW / GRID) * GRID);
    const snappedH = Math.max(GRID, Math.round(rawH / GRID) * GRID); // Min 20px
    
    if (snappedW !== w || snappedH !== h) {
      onUpdate(id, { w: snappedW, h: snappedH });
    }
  }

  function stopResize() {
    isResizing = false;
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResize);
  }

  // Styles
  const computedFontSize = $derived(style.fontSize || Math.max(12, Math.floor(h * 0.6)) + 'px');
  
  const cssStyle = $derived(`
    left: ${x}px; 
    top: ${y}px; 
    width: ${w}px; 
    height: ${h}px;
    font-size: ${type === 'text' ? computedFontSize : 'inherit'};
    font-family: ${style.fontFamily || 'inherit'};
    font-weight: ${style.fontWeight || 'normal'};
    font-style: ${style.fontStyle || 'normal'};
    text-align: ${style.textAlign || 'left'};
    color: ${style.color || 'inherit'};
    background-color: ${style.backgroundColor || (type === 'box' || type === 'circle' ? '#e2e8f0' : type === 'line' ? '#000' : 'transparent')};
    border-radius: ${type === 'circle' ? '50%' : '0'};
    display: flex;
    align-items: center;
  `);

</script>

<div 
  class="canvas-item {type}"
  class:selected={isSelected}
  style={cssStyle}
  onmousedown={handleMouseDown}
  role="button"
  tabindex="0"
>
  {#if type === 'text'}
    <div class="content">{text}</div>
  {/if}
  
  {#if isSelected}
    <div 
      class="resize-handle" 
      onmousedown={handleResizeStart}
      role="button"
      tabindex="-1"
      aria-label="Resize handle"
    ></div>
  {/if}
</div>

<style>
  .canvas-item {
    position: absolute;
    background: rgba(255, 255, 255, 0.5); /* Transparent to show grid slightly? Or white. */
    border: 1px solid transparent;
    cursor: grab;
    user-select: none;
    display: flex;
    align-items: center; /* Vertical Center */
    justify-content: flex-start;
    padding: 0 4px;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1;
  }
  
  .canvas-item.selected {
    border: 1px solid #3b82f6; /* Blue selection */
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    cursor: grabbing;
  }
  
  .content {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Resize Handle (Bottom Right) */
  .resize-handle {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 12px;
    height: 12px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: nwse-resize;
    z-index: 20;
  }

  /* Print Styles - Remove UI */
  @media print {
    .canvas-item {
      border: none !important;
      background: transparent !important;
    }
    .resize-handle {
      display: none !important;
    }
  }
</style>
