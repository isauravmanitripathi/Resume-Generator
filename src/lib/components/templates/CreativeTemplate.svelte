<script lang="ts">
  import type { Profile } from '$lib/db';
  
  interface Props {
    profile: Profile;
  }
  
  let { profile } = $props<Props>();
</script>

<div class="creative-grid-inner">
  <div class="dot-grid">
    <div class="content">
      <!-- Grid content will be added here -->
    </div>
  </div>
</div>

<style>
  .creative-grid-inner {
    width: 100%;
    height: 100%;
    background-color: white;
    position: relative;
    overflow: hidden;
  }

  .dot-grid {
    width: 100%;
    height: 100%;
    /* Math notebook style dot grid */
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: 10px 10px;
  }

  .content {
    /* To be used for dynamic rendering if needed */
  }

  @media print {
    .creative-grid-container {
      box-shadow: none;
      margin: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
