<script lang="ts">
	import ForestCanvas from '$lib/3d/ForestCanvas.svelte';

	export let projectName: string | null = null; // Allow projectName to be null
	export let onClose: () => void;

	let CanvasComponent: typeof ForestCanvas | null = null;

	// Ensure projectName is a valid string before calling .toLowerCase()
	if (projectName && projectName.toLowerCase().includes('trees')) {
		CanvasComponent = ForestCanvas;
	} else {
		CanvasComponent = null;
	}
</script>

<div>
	<!-- Popup -->
	<div class="fixed inset-0 bg-black/50 backdrop-blur-2xl flex items-center justify-center z-50">
		<div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 w-full md:w-4/5 lg:w-2/3">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-xl font-semibold">{projectName || 'Project'} - 3D Progress</h2>
				<button
					class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
					on:click={onClose}
				>
					&times;
				</button>
			</div>
			<div class="h-80 bg-gray-200 dark:bg-zinc-700 rounded-lg">
				{#if CanvasComponent}
					<CanvasComponent />
				{:else}
					<p class="text-center text-gray-500">No 3D view available for this project.</p>
				{/if}
			</div>
		</div>
	</div>
</div>
>
