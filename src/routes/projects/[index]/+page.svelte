<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { projectStore } from '$lib/stores/projectStore';
	import { addToInventory, saveUserToCookie, getUserFromCookie } from '$lib/user';
	import Popup3D from '$lib/components/Popup3D.svelte';

	export let data;

	// Extract project from the data prop and set it in the store
	const { project } = data;
	projectStore.set(project);

	// Subscribe to the store to get the current project
	let currentProject;
	projectStore.subscribe((value) => {
		currentProject = value;
	});

	let user = null;
	onMount(() => {
		const cookieString = document.cookie;
		user = getUserFromCookie(cookieString);
	});

	type Component = {
		name: string;
		image: string;
		needed: number;
		available: number;
		cartCount: number;
	};

	function increaseCartCount(component: Component): void {
		if (component.cartCount + component.available < component.needed) {
			component.cartCount += 1;
			projectStore.set({ ...currentProject });
			console.log(`Increased cartCount for ${component.name}:`, component.cartCount);
		}
	}

	function decreaseCartCount(component: Component): void {
		if (component.cartCount > 0) {
			component.cartCount -= 1;
			projectStore.set({ ...currentProject });
			console.log(`Decreased cartCount for ${component.name}:`, component.cartCount);
		}
	}

	async function applyChangesToProject(): Promise<void> {
		currentProject.components.forEach((component) => {
			const donatedCount = component.cartCount;
			const donationAmount = donatedCount * component.price;

			component.available += donatedCount;

			if (user) {
				addToInventory(user, component.name, donatedCount, (cookie) => {
					document.cookie = cookie;
				});

				const existingDonor = currentProject.leaderboard.find((donor) => donor.name === user.name);
				if (existingDonor) {
					existingDonor.amount += donationAmount;
				} else {
					currentProject.leaderboard.push({
						name: user.name,
						amount: donationAmount,
						profilePicture: user.profilePicture
					});
				}

				currentProject.leaderboard.sort((a, b) => b.amount - a.amount);
			}

			component.cartCount = 0;
		});

		completionPercentage = calculateCompletion();

		await updateProjectsFile();

		console.log('Updated project:', currentProject);
		alert('Changes applied successfully!');
	}

	function calculateCompletion(): number {
		const totalNeeded = currentProject.components.reduce(
			(sum: number, c: Component) => sum + c.needed,
			0
		);
		const totalAvailable = currentProject.components.reduce(
			(sum: number, c: Component) => sum + c.available,
			0
		);
		return Math.round((totalAvailable / totalNeeded) * 100);
	}

	let completionPercentage: number = calculateCompletion();
	let isPopupOpen = false;

	function togglePopup() {
		isPopupOpen = !isPopupOpen;
	}

	// Carbon Offset Calculator
	let numberOfTrees = 0;
	let carbonOffset = 0;

	function calculateCarbonOffset() {
		// Assume each tree offsets 21 kg of CO2 per year
		carbonOffset = numberOfTrees * 21;
	}

	async function updateProjectsFile(): Promise<void> {
		const response = await fetch('/api/update-projects', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(currentProject)
		});

		if (!response.ok) {
			console.error('Failed to update projects.js');
			alert('Failed to update projects.js');
		}
	}
</script>

<div class="flex flex-col items-center gap-6">
	{#if currentProject && currentProject.components}
		<div
			class="flex flex-row justify-between w-full text-white rounded-2xl px-6 py-16 md:px-18 md:py-32"
			style="
			background: linear-gradient(180deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.40) 100%), url({currentProject.image}) black 80% / cover no-repeat;
			-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
			mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
			-webkit-mask-size: cover;
			mask-size: cover;
		"
		>
			<div class="flex flex-col justify-center gap-6">
				<h2 class="text-xl md:text-2xl font-semibold">{currentProject.name}</h2>
				<p class="max-w-full md:max-w-72 text-sm md:text-base">{currentProject.description}</p>
			</div>
			<button
				class="flex flex-col gap-2 py-6 font-bold px-9 h-max dark:bg-black bg-white dark:text-white text-black rounded-lg text-sm md:text-base hover:bg-white hover:text-black hover:border dark:hover:bg-black dark:hover:text-white transition"
				on:click={togglePopup}
			>
				<span class="material-symbols-outlined"> view_in_ar </span>
				See 3D Progress
			</button>
		</div>
		<div class="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-4 mt-4">
			<div class="bg-green-500 h-4 rounded-full" style="width: {completionPercentage}%"></div>
		</div>
		<p class="text-sm mt-2">Project Completion: {completionPercentage}%</p>
		<h2 class="text-xl md:text-2xl font-semibold">Components Needed</h2>
		<div class="flex flex-col md:flex-row w-full gap-4">
			{#each currentProject.components as component, index (index)}
				<div
					class="flex flex-col justify-center items-center gap-4 p-4 flex-1"
					style="border-right: {index !== currentProject.components.length - 1 &&
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
						class="w-12 md:w-16 unique-class-{index}"
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
							on:click={() => decreaseCartCount(component)}
							disabled={component.cartCount === 0}
						>
							-
						</button>
						<span class="text-base md:text-lg font-semibold">{component.cartCount}</span>
						<button
							class="py-1 px-2 md:py-1 md:px-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg font-semibold text-sm md:text-base"
							on:click={() => increaseCartCount(component)}
							disabled={component.cartCount + component.available >= component.needed}
						>
							+
						</button>
					</div>
				</div>
			{/each}
		</div>
		<button
			class="py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm md:text-base hover:bg-white hover:text-black hover:border dark:hover:bg-black dark:hover:text-white transition"
			on:click={applyChangesToProject}
		>
			Confirm Changes
		</button>
		{#if isPopupOpen && currentProject}
			<Popup3D projectName={currentProject.name} onClose={togglePopup} />
		{/if}

		<h2 class="text-xl md:text-2xl font-semibold">Leaderboard</h2>
		<div class="flex flex-col gap-4 w-full">
			{#if currentProject.leaderboard.length > 0}
				{#each currentProject.leaderboard as donor, index (index)}
					<div
						class="flex items-center justify-between p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg"
					>
						<div class="flex items-center gap-4">
							<img
								src={donor.profilePicture}
								alt="{donor.name}'s profile picture"
								class="w-10 h-10 rounded-full border border-gray-300"
							/>
							<p class="text-lg font-semibold">{donor.name}</p>
						</div>
						<p class="text-lg font-semibold text-green-500">${donor.amount.toFixed(2)}</p>
					</div>
				{/each}
			{:else}
				<p class="text-gray-500">No donations yet. Be the first to contribute!</p>
			{/if}
		</div>

		<!-- Carbon Offset Calculator UI -->
		{#if currentProject.name.toLowerCase().includes('trees')}
			<div class="flex flex-col gap-2">
				<h2 class="text-xl md:text-2xl font-semibold mt-6">Carbon Offset Calculator</h2>
				<div class="flex flex-col items-center gap-4 w-full">
					<div class="flex items-center gap-2">
						<label for="numberOfTrees" class="text-sm md:text-base font-semibold"
							>Number of Trees:</label
						>
						<input
							id="numberOfTrees"
							type="number"
							class="py-1 px-2 md:py-1 md:px-3 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-lg text-sm md:text-base"
							bind:value={numberOfTrees}
							min="0"
						/>
					</div>
					<button
						class="py-2 px-4 bg-green-500 text-white rounded-lg text-sm md:text-base hover:bg-green-600 transition"
						on:click={calculateCarbonOffset}
					>
						Calculate Carbon Offset
					</button>
					<p class="text-sm md:text-base font-semibold">
						Carbon Offset: {carbonOffset} kg CO<sub>2</sub>/year
					</p>
				</div>
			</div>
		{/if}
	{:else}
		<p class="text-red-500">Project not found or data is invalid.</p>
	{/if}
</div>
