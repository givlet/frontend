<script lang="ts">
	import * as THREE from 'three';
	import { projects } from '../projects';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	export let onClose: () => void;
	export let onContinue: () => void;

	let canvas: HTMLCanvasElement;
	let project = { name: '', components: [] }; // Default fallback

	// Extract project index from the URL and fetch the corresponding project
	const pageStore = get(page);
	const index = parseInt(pageStore.url.searchParams.get('index') || '0', 10);
	project = projects[index] || { name: 'Unnamed Project', components: [] };

	function closePopup() {
		onClose(); // Invoke the onClose function passed from the parent
	}

	// Initialize Three.js scene
	function setupThreeJS() {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({ canvas });

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		camera.position.z = 5;

		// Add a simple cube
		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Default color
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		// Animation loop
		function animate() {
			requestAnimationFrame(animate);
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		}

		animate();
	}

	// Run setupThreeJS when the component is mounted
	$: if (canvas) {
		setupThreeJS();
	}
</script>

<div class="fixed inset-0 bg-black/50 backdrop-blur-2xl flex items-center justify-center z-50">
	<div class="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-11/12 md:w-3/4 lg:w-1/2">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-xl font-semibold">{project.name} - 3D Progress</h2>
			<button
				class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
				on:click={closePopup}
			>
				&times;
			</button>
		</div>
		<div class="h-64 bg-gray-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center">
			<canvas bind:this={canvas} class="w-full h-full"></canvas>
		</div>
		<button
			class="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg text-sm md:text-base hover:bg-blue-600 transition"
			on:click={onContinue}
		>
			Apply Changes
		</button>
	</div>
</div>
