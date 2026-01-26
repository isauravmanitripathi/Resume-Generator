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

<div class="flex flex-col h-screen overflow-hidden bg-white font-sans antialiased text-slate-900">
	<!-- Mobile Top Nav -->
	<MobileNav onOpen={() => (isSidebarOpen = true)} />

	<div class="flex flex-1 overflow-hidden">
		<!-- Sidebar (Responsive) -->
		<Sidebar 
			isOpen={isSidebarOpen} 
			onClose={() => (isSidebarOpen = false)} 
		/>

		<!-- Main Content Area -->
		<main class="flex-1 overflow-y-auto bg-slate-50/50 transition-all duration-300">
			{@render children()}
		</main>
	</div>
</div>
