<script lang="ts">
	import { generateRandomUser, saveUserToCookie, getUserFromCookie } from '$lib/user';
	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	// GET USER COOKIES
	let user = getUserFromCookie(document.cookie);

	// If no user exists, create and save one
	if (!user) {
		user = generateRandomUser();
		saveUserToCookie(user, (cookieString) => {
			document.cookie = cookieString;
		});
	}

	console.log('UUID:', user.id);
	console.log('Name:', user.name);
	console.log('Avatar URL:', user.profilePicture);

	onMount(() => {
		// Create an iframe and set its source to localhost:3000
		const iframe = document.createElement('iframe');
		iframe.src = 'http://localhost:5173';
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.style.border = 'none';

		// Append the iframe to the container
		container.appendChild(iframe);

		return () => {
			// Cleanup
			iframe.remove();
		};
	});
</script>

<div bind:this={container} class="w-full h-full"></div>
