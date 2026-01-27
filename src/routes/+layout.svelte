<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import ClearCache from '$lib/components/ClearCache.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col h-screen overflow-hidden bg-slate-50/50 font-sans antialiased text-slate-900">
	<!-- Top Navigation -->
	<Navbar />

	<!-- Main Content Area -->
	<main class="flex-1 overflow-y-auto transition-all duration-300 relative">
		{@render children()}
	</main>

	<ClearCache />
	<ToastContainer />
</div>
