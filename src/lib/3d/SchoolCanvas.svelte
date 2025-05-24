<script lang="ts">
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
		const dirLight2 = new THREE.DirectionalLight(0xffffff, 3);
		dirLight.position.set(5, 10, 7.5);
		scene.add(dirLight);

		const controls = new OrbitControls(camera, renderer.domElement);

		const loader = new GLTFLoader();
		loader.load(
			'/models/school.glb',
			(gltf) => {
				scene.add(gltf.scene);
				animate();
			},
			(xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total * 100).toFixed(1)}%`),
			(err) => console.error('Error loading GLTF:', err)
		);

		// Render loop
		function animate() {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}

		return () => {
			// Cleanup
			renderer.dispose();
			scene.clear();
		};
	});
</script>

<div bind:this={container} class="w-full h-full"></div>
