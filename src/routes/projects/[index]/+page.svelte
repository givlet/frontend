<script context="module">
	import { projects } from '$lib/projects';
</script>

<script>
	import { error } from '@sveltejs/kit';

	export let data;

	const index = parseInt(data?.index || 0, 10);
	const project = projects[index];

	if (!project) {
		throw error(404, 'Project not found');
	}

	function increaseAvailability(component) {
		if (component.available < component.needed) {
			component.available += 1;
			component.userCount = (component.userCount || 0) + 1;
			component = { ...component };
		}
	}

	function decreaseAvailability(component) {
		if (component.available > 0 && (component.userCount || 0) > 0) {
			component.available -= 1;
			component.userCount -= 1;
			component = { ...component };
		}
	}

	function calculateCompletion() {
		const totalNeeded = project.components.reduce((sum, c) => sum + c.needed, 0);
		const totalAvailable = project.components.reduce((sum, c) => sum + c.available, 0);
		return Math.round((totalAvailable / totalNeeded) * 100);
	}

	let completionPercentage = calculateCompletion();
</script>

<div class="flex flex-col items-center gap-6">
	<div
		class="flex flex-col justify-center gap-6 w-full text-white rounded-2xl px-6 py-16 md:px-18 md:py-32"
		style="
		background: linear-gradient(180deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), url({project.image}) black 80% / cover no-repeat;
		-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
		-webkit-mask-size: cover;
		mask-size: cover;
	"
	>
		<h2 class="text-xl md:text-2xl font-semibold">{project.name}</h2>
		<p class="max-w-full md:max-w-72 text-sm md:text-base">{project.description}</p>
	</div>
	<div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-4 mt-4">
		<div class="bg-green-500 h-4 rounded-full" style="width: {completionPercentage}%"></div>
	</div>
	<p class="text-sm mt-2">Project Completion: {completionPercentage}%</p>
	<h2 class="text-xl md:text-2xl font-semibold">Components Needed</h2>
	<div class="flex flex-col md:flex-row w-full gap-4">
		{#each project.components as component, index (index)}
			<div
				class="flex flex-col justify-center items-center gap-4 p-4 flex-1"
				style="border-right: {index !== project.components.length - 1 &&
				typeof window !== 'undefined' &&
				window.innerWidth >= 768
					? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
						? '1px solid rgba(255, 255, 255, 0.1)'
						: '1px solid rgba(0, 0, 0, 0.1)'
					: 'none'};"
			>
				<img
					src={component.image}
					alt={component.name}
					class="size-12 md:size-16 unique-class-{index}"
				/>
				<div class="flex-1 text-center">
					<h2 class="text-lg md:text-xl font-semibold">{component.name}</h2>
					<p class="text-xs md:text-sm font-bold">
						{component.available}/<span class="text-[8px] md:text-[10px] opacity-60"
							>{component.needed}</span
						>
					</p>
				</div>
				<!-- Counter -->
				<div class="flex items-center gap-2">
					<button
						class="py-1 px-2 md:py-1 md:px-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg font-semibold text-sm md:text-base"
						on:click={() => decreaseAvailability(component)}
						disabled={(component.userCount || 0) === 0}
					>
						-
					</button>
					<span class="text-base md:text-lg font-semibold">{component.userCount || 0}</span>
					<button
						class="py-1 px-2 md:py-1 md:px-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg font-semibold text-sm md:text-base"
						on:click={() => increaseAvailability(component)}
						disabled={component.available === component.needed}
					>
						+
					</button>
				</div>
			</div>
		{/each}
	</div>
	<a
		href="/donate"
		class="py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm md:text-base"
		>Continue -></a
	>
</div>
