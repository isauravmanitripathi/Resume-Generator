<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MobileNav from '$lib/components/MobileNav.svelte';

	let { children } = $props();
	let isSidebarOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col md:flex-row min-h-screen bg-white font-sans antialiased text-slate-900">
	<!-- Mobile Top Nav -->
	<MobileNav onOpen={() => (isSidebarOpen = true)} />

	<!-- Sidebar (Responsive) -->
	<Sidebar 
		isOpen={isSidebarOpen} 
		onClose={() => (isSidebarOpen = false)} 
	/>

	<!-- Main Content -->
	<main class="flex-1 min-h-[calc(100vh-4rem)] md:min-h-screen transition-all duration-300">
		{@render children()}
	</main>
</div>
