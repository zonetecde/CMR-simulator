<script lang="ts">
	import type Coordonnees from '$lib/Coordonnees';
	import { RandomInt } from '$lib/Func';
	import { onMount } from 'svelte';

	let minPoisson = 4000;
	let maxPoisson = 4000;
	let poissons: Coordonnees[] = [];

	let VITESSE = 3;
	const espaceWidth = 6000;
	const espaceHeight = 6000;

	let visibleWidth: number, visibleHeight : number 

	onMount(() => {
		window.addEventListener('resize', onResize);
		onResize();

		visibleWidth = document.getElementById('enclos')!.offsetWidth;
		visibleHeight = document.getElementById('enclos')!.offsetHeight;


		// Prend un nombre aléatoire de poisson
		const nombrePoisson = RandomInt(minPoisson, maxPoisson);

		// Crée les poissons
		for (let i = 0; i < nombrePoisson; i++) {
			poissons = [
				...poissons,
				{
					x: RandomInt(0 - espaceWidth / 2, espaceWidth + espaceWidth / 2),
					y: RandomInt(0 - espaceHeight / 2, espaceHeight + espaceHeight / 2),
					direction: ['Left', 'Right', 'Up', 'Down', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'][
						RandomInt(0, 7)
					],
					int: RandomInt(0, 40)
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
						? ['Left', 'Right', 'Up', 'Down', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'][
							RandomInt(0, 7)
						]
						: poisson.direction;
			const x =
				poisson.x +
				(direction === 'Left' ? -VITESSE : direction === 'Right' ? VITESSE : direction === 'TopLeft' ? -VITESSE : direction === 'TopRight' ? VITESSE : direction === 'BottomLeft' ? -VITESSE : direction === 'BottomRight' ? VITESSE : 0);
			const y =
				poisson.y +
				(direction === 'Up' ? -VITESSE : direction === 'Down' ? VITESSE : direction === 'TopLeft' ? -VITESSE : direction === 'TopRight' ? -VITESSE : direction === 'BottomLeft' ? VITESSE : direction === 'BottomRight' ? VITESSE : 0);

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
		const enclos_height = enclos_width * (500 / 1000);


		if (enclos) {
			enclos.style.width = `${enclos_width}px`;
			enclos.style.height = `${enclos_height}px`;

			// centre l'enclos
			enclos.style.left = `${window.innerWidth / 2 - enclos_width / 2}px`;
			enclos.style.top = `${window.innerHeight / 2 - enclos_height / 2}px`;
		}
	}


	function isFishVisible(poisson: Coordonnees) {
		const fishWidth = 70;
		const fishHeight = 70;

		const fishLeft = visibleWidth / 2 + poisson.x - espaceWidth / 2;
		const fishTop = visibleHeight / 2 + poisson.y - espaceHeight / 2;

		const fishRight = fishLeft + fishWidth;
		const fishBottom = fishTop + fishHeight;

		const enclosLeft = 0;
		const enclosTop = 0;
		const enclosRight = visibleWidth;
		const enclosBottom = visibleHeight;

		return (
			fishRight >= enclosLeft &&
			fishLeft <= enclosRight &&
			fishBottom >= enclosTop &&
			fishTop <= enclosBottom
		);
	}
</script>

<div class="w-screen h-screen" id="main">
	<div id="enclos" class="absolute bg-blue-400 border-4 border-blue-900 rounded-xl overflow-hidden flex">
		{#each poissons as poisson}
			{#if isFishVisible(poisson)}
				<img
					alt="poisson"
					src="fish.png"
					class={`w-20 object-cover h-10 absolute duration-500 ${
						poisson.direction === 'Right' ? 'flip' : ''
					} ${poisson.direction === 'Up' ? 'rotate-90' : ''} ${
						poisson.direction === 'Down' ? '-rotate-90' : ''
					} ${poisson.direction === 'TopLeft' ? 'rotate-45' : ''} ${
						poisson.direction === 'TopRight' ? 'rotate-[140deg]' : ''} ${
						poisson.direction === 'BottomLeft' ? 'rotate-[-40deg]' : ''} ${
						poisson.direction === 'BottomRight' ? 'rotate-[-120deg]' : ''}`}
					style="left: {visibleWidth / 2 + poisson.x - espaceWidth / 2}px; top: {visibleHeight / 2 + poisson.y - espaceHeight / 2}px;"
				/>
			{/if}
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
