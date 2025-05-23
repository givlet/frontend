<script context="module">
	import { projects } from '$lib/projects';
</script>

<div class="flex flex-col gap-5 mt-8">
	<h2 class="text-3xl font-semibold">Projects</h2>
	<div class="flex flex-col gap-8 items-center justify-center w-full mt-8">
		{#each projects as project, index (index)}
			<div
				class="flex flex-col justify-center gap-6 w-full text-white rounded-2xl p-18"
				style="background: linear-gradient(180deg, rgba(0, 0, 0, 0.30) 79.29%, rgba(0, 0, 0, 0.90) 100%), url({project.image}) lightgray 50% / cover no-repeat;"
			>
				<h2 class="text-2xl font-semibold">{project.name}</h2>
				<p class="max-w-72">{project.description}</p>
				<div class="flex flex-row gap-2">
					<a
						href="/projects/{index}"
						class="flex items-center justify-center py-1 rounded-full px-8 bg-white text-black text-lg font-semibold"
						>Donate</a
					>
					<button
						class="flex items-center justify-center py-1 rounded-full px-8 border border-white text-white text-lg font-semibold cursor-pointer"
						on:click={() => navigator.clipboard.writeText(`/projects/${index}`)}
					>
						Share
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
