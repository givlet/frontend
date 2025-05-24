<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';

	let container: HTMLDivElement;

	onMount(() => {
		// Initialize Three.js scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(
			window.matchMedia('(prefers-color-scheme: dark)').matches ? 0x060621 : 0xcccccc
		);

		const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
		camera.position.set(20, 20, 20);
		camera.lookAt(0, 0, 0);

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		window.addEventListener('resize', () => {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		});

		scene.add(new THREE.AmbientLight(0xffffff, 0.6));
		const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
		dirLight.position.set(5, 10, 7.5);
		scene.add(dirLight);

		const controls = new OrbitControls(camera, renderer.domElement);

		// WebSocket setup
		const socket = io('/api/trees', {
			transports: ['websocket', 'polling'],
			reconnectionAttempts: 3
		});

		socket.on('connect', () => console.log('[socket] connected as', socket.id));
		socket.on('disconnect', () => console.log('[socket] disconnected'));

		// Load tree model
		new GLTFLoader()
			.loadAsync('/models/tree.glb')
			.then((gltf) => {
				const treeModel = gltf.scene;
				scene.add(treeModel);
			})
			.catch((err) => console.error('Error loading tree.glb:', err));

		// Render loop
		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}

		animate();

		return () => {
			// Cleanup
			renderer.dispose();
			scene.clear();
		};
	});
</script>

<div bind:this={container} class="w-full h-full"></div>
