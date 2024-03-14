<script lang="ts">
	import type Coordonnees from '$lib/Coordonnees';
	import { RandomInt } from '$lib/Func';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	export let minPoisson: number;
	export let maxPoisson: number;
	export let vitesse: number;

	export let lacSize = 4000;

	let poissonIntervalAnimation: number;
	let poissons: Coordonnees[] = [];

	const visibleWidth: number = 800;
	const visibleHeight: number = 600;

	let captureAnim: boolean = false;
	let main: HTMLImageElement;

	export function refreshAnimation() {
		poissons = [];
		clearInterval(poissonIntervalAnimation);
		const nbre = ajoutPoissons();
		bougerPoissons();

		return nbre;
	}

	onMount(() => {
		window.addEventListener('resize', onResize);
		onResize();

		refreshAnimation();
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
					direction: getRandomDirection(),
					int: RandomInt(0, 40),
					id: i,
					marked: false
				}
			];
		}

		return nombrePoisson;
	}

	function getRandomDirection(): string {
		return ['Left', 'Right', 'Up', 'Down', 'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight'][
			RandomInt(0, 7)
		];
	}

	export function bougerPoissons() {
		// Fait bouger les poissons aléatoirement
		poissonIntervalAnimation = setInterval(() => {
			poissons = poissons.map((poisson) => {
				const direction =
					poisson.int < 40
						? poisson.direction
						: RandomInt(0, 2) == 0
							? getRandomDirection()
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
					int: poisson.int > 40 ? 0 : poisson.int + RandomInt(0, vitesse),
					id: poisson.id,
					marked: poisson.marked
				};
			});
		}, 100);
	}

	/**
	 * Vérifie si le poisson est visible dans l'enclos
	 * @param poisson Coordonnées du poisson
	 */
	let fishWidth = 100;
	let fishHeight = 100;

	function isFishVisible(poisson: Coordonnees) {
		const fishLeft = poisson.x - lacSize / 2;
		const fishTop = poisson.y - lacSize / 2;

		const fishRight = fishLeft + fishWidth;
		const fishBottom = fishTop + fishHeight;

		const enclosLeft = -visibleWidth / 2;
		const enclosTop = -visibleHeight / 2;
		const enclosRight = visibleWidth / 2;
		const enclosBottom = visibleHeight / 2;

		return (
			fishRight >= enclosLeft &&
			fishLeft <= enclosRight &&
			fishBottom >= enclosTop &&
			fishTop <= enclosBottom
		);
	}

	export async function captureFish(number: number) {
		captureAnim = true;
		clearInterval(poissonIntervalAnimation);

		await delay(200);

		main.classList.remove('scale-0');
		main.classList.add('scale-100');

		await delay(1000);

		main.classList.remove('scale-100');
		main.classList.add('scale-0');

		await delay(500);

		// Capture les <number> poissons les plus proches du centre (0, 0) et les renvoies
		const poissonsProches = poissons
			.sort(
				(a, b) =>
					Math.abs(lacSize / 2 - a.x) +
					Math.abs(lacSize / 2 - a.y) -
					(Math.abs(lacSize / 2 - b.x) + Math.abs(lacSize / 2 - b.y))
			)
			.slice(0, number);

		captureAnim = false;

		return poissonsProches;
	}

	export function markFish(poissonsToMark: Coordonnees[]) {
		poissons = poissons.map((p) => {
			if (poissonsToMark.some((poisson) => poisson.id === p.id)) {
				return { ...p, marked: true };
			}
			return p;
		});

		bougerPoissons();
	}

	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

<div
	id="enclos"
	class={'absolute duration-1000 bg-blue-400 border-4 border-blue-900 rounded-xl overflow-hidden top-5 right-5 origin-top-right'}
	style="width: {visibleWidth}px; height: {visibleHeight}px;"
>
	{#if captureAnim}
		<img
			src="hand.png"
			alt="main"
			bind:this={main}
			class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 scale-0 duration-1000"
		/>
	{/if}

	{#each poissons as poisson}
		{#if isFishVisible(poisson)}
			<img
				transition:fade
				alt="poisson"
				src={poisson.marked ? 'markedfish.png' : 'fish.png'}
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
