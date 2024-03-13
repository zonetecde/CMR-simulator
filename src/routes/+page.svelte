<script lang="ts">
	import type Coordonnees from '$lib/Coordonnees';
	import { RandomInt } from '$lib/Func';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let minPoisson = 1000;
	let maxPoisson = 1000;
	let poissons: Coordonnees[] = [];

	let VITESSE = 3;
	const espaceWidth = 4000;
	const espaceHeight = 4000;

	let visibleWidth: number = 800;
	let visibleHeight: number = 600;

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
					x: RandomInt(0 - espaceWidth / 2, espaceWidth + espaceWidth / 2),
					y: RandomInt(0 - espaceHeight / 2, espaceHeight + espaceHeight / 2),
					direction: [
						'Left',
						'Right',
						'Up',
						'Down',
						'TopLeft',
						'TopRight',
						'BottomLeft',
						'BottomRight'
					][RandomInt(0, 7)],
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
				let x = poisson.x;
				let y = poisson.y;

				if (direction === 'Left' || direction === 'TopLeft' || direction === 'BottomLeft') {
					x -= VITESSE;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (x < 0 - espaceWidth / 2) {
						x = espaceWidth + espaceWidth / 2;
					}
				} else if (
					direction === 'Right' ||
					direction === 'TopRight' ||
					direction === 'BottomRight'
				) {
					x += VITESSE;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (x > espaceWidth + espaceWidth / 2) {
						x = 0 - espaceWidth / 2;
					}
				}

				if (direction === 'Up' || direction === 'TopLeft' || direction === 'TopRight') {
					y -= VITESSE;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (y < 0 - espaceHeight / 2) {
						y = espaceHeight + espaceHeight / 2;
					}
				} else if (
					direction === 'Down' ||
					direction === 'BottomLeft' ||
					direction === 'BottomRight'
				) {
					y += VITESSE;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (y > espaceHeight + espaceHeight / 2) {
						y = 0 - espaceHeight / 2;
					}
				}

				return {
					...poisson,
					x: x,
					y: y,
					direction,
					int: poisson.int > 40 ? 0 : poisson.int + RandomInt(0, VITESSE)
				};
			});
		}, 100);
	});

	function onResize() {
		const enclos = document.getElementById('enclos');
		const enclos_scale = Math.min(
			window.innerWidth / visibleWidth / 2,
			window.innerHeight / visibleHeight / 2
		);
		if (enclos) {
			enclos.style.transform = `scale(${enclos_scale})`;
		}
	}

	/**
	 * Vérifie si le poisson est visible dans l'enclos
	 * @param poisson Coordonnées du poisson
	 */
	function isFishVisible(poisson: Coordonnees) {
		const fishWidth = 100;
		const fishHeight = 100;

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
			fishTop - fishHeight <= enclosBottom
		);
	}
</script>

<div class="w-screen h-screen bg-red-500" id="main">
	<div
		id="enclos"
		class="absolute top-5 right-5 origin-top-right bg-blue-400 border-4 border-blue-900 rounded-xl overflow-hidden"
		style="width: {visibleWidth}px; height: {visibleHeight}px;"
	>
		{#each poissons as poisson}
			{#if isFishVisible(poisson)}
				<img
					transition:fade
					alt="poisson"
					src="fish.png"
					class={`w-20 object-cover h-10 absolute duration-500 ${
						poisson.direction === 'Right' ? 'flip' : ''
					} ${poisson.direction === 'Up' ? 'rotate-90' : ''} ${
						poisson.direction === 'Down' ? '-rotate-90' : ''
					} ${poisson.direction === 'TopLeft' ? 'rotate-45' : ''} ${
						poisson.direction === 'TopRight' ? 'rotate-[140deg]' : ''
					} ${poisson.direction === 'BottomLeft' ? 'rotate-[-40deg]' : ''} ${
						poisson.direction === 'BottomRight' ? 'rotate-[-120deg]' : ''
					}`}
					style="left: {visibleWidth / 2 + poisson.x - espaceWidth / 2}px; top: {visibleHeight / 2 +
						poisson.y -
						espaceHeight / 2}px; "
				/>
			{/if}
		{/each}
	</div>

	<div class="h-screen pt-5 pl-5 xl:w-[60%] lg:w-[50%] w-[40%]">
		<h1 class="text-5xl font-bold">CMR Simulator</h1>

		<p class="text-2xl mt-5">
			Bienvenue dans le simulateur de <b>C</b>apture, <b>M</b>arquage et <b>R</b>ecapture. Vous
			pouvez grâce à ce simulateur visualiser le comportement des poissons dans leur espace naturel
			afin de comprendre la technique CMR. Vous pourrez ainsi tenter d'estimer la population de
			poissons dans ce lac.
		</p>

		<div>
			<h2 class="text-3xl mt-5">Paramètres</h2>

			<div class="flex flex-col space-y-5 mt-5">
				<div class="flex flex-col space-y-2">
					<label for="minPoisson" class="text-xl">Nombre minimum de poissons</label>
					<input
						type="number"
						id="minPoisson"
						class="w-20 p-2 border-2 border-blue-900 rounded-md"
						bind:value={minPoisson}
					/>
				</div>

				<div class="flex flex-col space-y-2">
					<label for="maxPoisson" class="text-xl">Nombre maximum de poissons</label>
					<input
						type="number"
						id="maxPoisson"
						class="w-20 p-2 border-2 border-blue-900 rounded-md"
						bind:value={maxPoisson}
					/>
				</div>

				<div class="flex flex-col space-y-2">
					<label for="vitesse" class="text-xl">Vitesse des poissons</label>
					<input
						type="number"
						id="vitesse"
						min="1"
						class="w-20 p-2 border-2 border-blue-900 rounded-md"
						bind:value={VITESSE}
					/>
				</div>
			</div>
		</div>
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
		background-image: radial-gradient(#9093bb 1px, #c2c2fc 1px);
		background-size: 10px 10px;

		color: rgb(0, 0, 0);
	}

	.flip {
		transform: rotateY(180deg);
	}
</style>
