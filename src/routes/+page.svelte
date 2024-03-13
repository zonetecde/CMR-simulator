<script lang="ts">
	import type Coordonnees from '$lib/Coordonnees';
	import { RandomInt } from '$lib/Func';
	import { onMount } from 'svelte';

	let minPoisson = 100;
	let maxPoisson = 100;
	let poissons: Coordonnees[] = [];

	let VITESSE = 3;
	let WIDTH = 1000;
	let HEIGHT = 563;

	onMount(() => {
		window.addEventListener('resize', onResize);
		onResize();

		// Prend un nombre aléatoire de poisson
		const nombrePoisson = RandomInt(minPoisson, maxPoisson);

		// Crée les poissons
		for (let i = 0; i < nombrePoisson; i++) {
			poissons = [
				...poissons,
				{
					x: Math.random() * WIDTH * 2 - WIDTH / 2,
					y: Math.random() * HEIGHT * 2 - HEIGHT / 2,
					direction: ['Left', 'Right', 'Up', 'Down'][RandomInt(0, 3)],
					int: 0
				}
			];
		}

		// Fait bouger les poissons aléatoirement
		setInterval(() => {
			poissons = poissons.map((poisson) => {
				const direction =
					poisson.int < 40
						? poisson.direction
						: RandomInt(0, 2) == 0
							? ['Left', 'Right', 'Up', 'Down'][RandomInt(0, 3)]
							: poisson.direction;
				const x =
					poisson.x + (direction === 'Left' ? -VITESSE : direction === 'Right' ? VITESSE : 0);
				const y = poisson.y + (direction === 'Up' ? -VITESSE : direction === 'Down' ? VITESSE : 0);

				return {
					...poisson,
					x: x,
					y: y,
					direction,
					int: poisson.int > 40 ? 0 : poisson.int + RandomInt(0, 3)
				};
			});
		}, 100);
	});

	function onResize() {
		const enclos = document.getElementById('enclos');
		const enclos_width = window.window.innerWidth * 0.6;
		const enclos_height = enclos_width * (HEIGHT / WIDTH);
		WIDTH = enclos_width;
		HEIGHT = enclos_height;

		if (enclos) {
			enclos.style.width = `${enclos_width}px`;
			enclos.style.height = `${enclos_height}px`;

			// centre l'enclos
			enclos.style.left = `${window.innerWidth / 2 - enclos_width / 2}px`;
			enclos.style.top = `${window.innerHeight / 2 - enclos_height / 2}px`;
		}
	}
</script>

<div class="w-screen h-screen" id="main">
	<div id="enclos" class="absolute bg-blue-400 border-4 border-blue-900 rounded-xl overflow-hidden">
		{#each poissons as poisson}
			<img
				alt="poisson"
				src="fish.png"
				class={`w-20 object-cover h-10 absolute duration-200 ${
					poisson.direction === 'Right' ? 'flip' : ''
				} ${poisson.direction === 'Up' ? 'rotate-90' : ''} ${
					poisson.direction === 'Down' ? '-rotate-90' : ''
				}`}
				style="left: {poisson.x}px; top: {poisson.y}px;"
			/>
		{/each}
	</div>
</div>

<style>
	#enclos {
		background-image: url('/water.png');
		background-size: cover;
		background-position: center;
	}

	#main {
		background-color: #e5e5f7;
		opacity: 0.8;
		background-image: radial-gradient(#444cf7 0.5px, #e5e5f7 0.5px);
		background-size: 10px 10px;
	}

	.flip {
		transform: rotateY(180deg);
	}
</style>
