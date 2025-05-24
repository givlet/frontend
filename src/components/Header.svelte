<script lang="ts">
	import { onMount } from 'svelte';
	import { generateRandomUser, getUserFromCookie, saveUserToCookie } from '$lib/user';

	let user: { name: string; streak: number; profilePicture: string; lastLogin: string } | null = null;

	onMount(() => {
		const cookieString = document.cookie;

		// Fetch user from cookies
		const cookieUser = getUserFromCookie(cookieString);

		if (
			cookieUser &&
			typeof cookieUser === 'object' &&
			'name' in cookieUser &&
			'streak' in cookieUser &&
			'profilePicture' in cookieUser &&
			'lastLogin' in cookieUser &&
			typeof cookieUser.name === 'string' &&
			typeof cookieUser.streak === 'number' &&
			typeof cookieUser.profilePicture === 'string' &&
			typeof cookieUser.lastLogin === 'string'
		) {
			user = cookieUser as { name: string; streak: number; profilePicture: string; lastLogin: string };

			// Check if the user logged in on a new day
			const today = new Date().toISOString().split('T')[0];
			if (user.lastLogin !== today) {
				user.streak += 1; // Increment streak
				user.lastLogin = today; // Update last login date
				saveUserToCookie(user, (cookie) => {
					document.cookie = cookie;
				});
			}
		} else {
			// Generate a new user if no valid user exists in cookies
			user = generateRandomUser();
			user.lastLogin = new Date().toISOString().split('T')[0]; // Set today's date as last login
			saveUserToCookie(user, (cookie) => {
				document.cookie = cookie;
			});
		}
	});

	let isDropdownOpen = false;

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}
</script>

<div class="flex flex-row justify-between pb-8 items-center self-stretch">
	<div class="flex items-center justify-center gap-9">
		<a href="/" class="text-xl font-semibold">Givlet</a>
		<div class="relative">
			<button class="font-medium" on:click={toggleDropdown}> Information </button>
			{#if isDropdownOpen}
				<div
					class="absolute mt-2 w-max bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-lg z-50"
				>
					{#each [{ href: '/about', text: 'About Us' }, { href: '/mission', text: 'Our Mission' }, { href: '/contact', text: 'Contact Us' }] as link, index (index)}
						<a
							href={link.href}
							class="block px-4 py-2 text-gray-700 dark:text-zinc-100 hover:bg-gray-100 hover:dark:bg-zinc-700"
						>
							{link.text}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
	{#if user}
		<div class="flex items-center gap-4">
			<div class="text-right">
				<p class="text-lg font-semibold">{user.name}</p>
				<p class="text-sm text-gray-500">🔥 Streak: {user.streak} days</p>
			</div>
			<img
				src={user.profilePicture}
				alt="{user.name}'s profile picture"
				class="w-10 h-10 rounded-full border border-gray-300"
			/>
		</div>
	{/if}
</div>
