<script lang="ts">
	import type Coordonnees from '$lib/Coordonnees';
	import { RandomInt } from '$lib/Func';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let minPoisson: number;
	export let maxPoisson: number;
	export let vitesse: number;

	export let lacSize = 4000;

	let poissonIntervalAnimation: number;
	let poissons: Coordonnees[] = [];

	const visibleWidth: number = 800;
	const visibleHeight: number = 600;

	onMount(() => {
		window.addEventListener('resize', onResize);
		onResize();

		ajoutPoissons();
		bougerPoissons();
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

	function ajoutPoissons() {
		// Prend un nombre aléatoire de poisson
		const nombrePoisson = RandomInt(minPoisson, maxPoisson);

		// Crée les poissons
		for (let i = 0; i < nombrePoisson; i++) {
			poissons = [
				...poissons,
				{
					x: RandomInt(0 - lacSize / 2, lacSize + lacSize / 2),
					y: RandomInt(0 - lacSize / 2, lacSize + lacSize / 2),
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
	}

	function bougerPoissons() {
		// Fait bouger les poissons aléatoirement
		poissonIntervalAnimation = setInterval(() => {
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
					x -= vitesse;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (x < 0 - lacSize / 2) {
						x = lacSize + lacSize / 2;
					}
				} else if (
					direction === 'Right' ||
					direction === 'TopRight' ||
					direction === 'BottomRight'
				) {
					x += vitesse;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (x > lacSize + lacSize / 2) {
						x = 0 - lacSize / 2;
					}
				}

				if (direction === 'Up' || direction === 'TopLeft' || direction === 'TopRight') {
					y -= vitesse;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (y < 0 - lacSize / 2) {
						y = lacSize + lacSize / 2;
					}
				} else if (
					direction === 'Down' ||
					direction === 'BottomLeft' ||
					direction === 'BottomRight'
				) {
					y += vitesse;
					// Si le poisson sort de l'enclos, on le replace de l'autre côté
					if (y > lacSize + lacSize / 2) {
						y = 0 - lacSize / 2;
					}
				}

				return {
					...poisson,
					x: x,
					y: y,
					direction,
					int: poisson.int > 40 ? 0 : poisson.int + RandomInt(0, vitesse)
				};
			});
		}, 100);
	}

	/**
	 * Vérifie si le poisson est visible dans l'enclos
	 * @param poisson Coordonnées du poisson
	 */
	function isFishVisible(poisson: Coordonnees) {
		const fishWidth = 100;
		const fishHeight = 100;

		const fishLeft = visibleWidth / 2 + poisson.x - lacSize / 2;
		const fishTop = visibleHeight / 2 + poisson.y - lacSize / 2;

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
				style="left: {visibleWidth / 2 + poisson.x - lacSize / 2}px; top: {visibleHeight / 2 +
					poisson.y -
					lacSize / 2}px; "
			/>
		{/if}
	{/each}
</div>

<style>
	#enclos {
		background-image: url('/water.png');
		background-size: cover;
		background-position: center;
	}
	.flip {
		transform: rotateY(180deg);
	}
</style>
