<script lang="ts">
	import Lac from '$lib/Components/Lac.svelte';
	import type Coordonnees from '$lib/Coordonnees';

	let minPoisson = 500; // Le nombre minimum de poissons
	let maxPoisson = 3000; // Le nombre maximum de poissons
	let vitesse = 3;

	let lacSize = 4000; // Taille du lac

	let lac: Lac;
	let hasSimulationStarted: boolean = false;
	let toCapture: number = 60; // Nombre de poisson à capturer
	let didCapture: boolean = false;
	let didMark: boolean = false;
	let poissonsCaptures: Coordonnees[];

	$: if ((lacSize || minPoisson || maxPoisson) && lac) {
		lac.refreshAnimation();
	}

	async function handleCaptureButtonClicked() {
		didCapture = true;

		poissonsCaptures = await lac.captureFish(toCapture);
	}

	function handleMarquageButtonClicked() {
		didMark = true;

		// Marque tout les poissons en leur donnant une couleur
		lac.markFish(poissonsCaptures);

		poissonsCaptures = [];
	}

	function handleStartSimulationButtonClicked() {
		hasSimulationStarted = true;
		didMark = false;
		didCapture = false;
	}
</script>

<div class="w-screen h-screen bg-red-500" id="main">
	<div class="h-screen pt-5 pl-5 xl:w-[60%] lg:w-[50%] w-[40%]">
		<Lac bind:this={lac} {minPoisson} {maxPoisson} {vitesse} {lacSize} />

		<h1 class="text-5xl font-bold">CMR Simulator</h1>

		<p class="text-2xl mt-5">
			Bienvenue dans le simulateur de <b>C</b>apture, <b>M</b>arquage et <b>R</b>ecapture. Vous
			pouvez grâce à ce simulateur visualiser le comportement des poissons dans leur espace naturel
			afin de comprendre la technique CMR. Vous pourrez ainsi tenter d'estimer la population de
			poissons dans ce lac.
		</p>

		{#if hasSimulationStarted}
			<div>
				<h2 class="text-3xl mt-5 font-bold">Paramètres</h2>

				<div class="flex flex-col space-y-5 mt-5">
					<div class="flex flex-col space-y-2">
						<label for="minPoisson" class="text-xl"
							><span class="underline">Nombre de poissons :</span>
							<small class="text-gray-600"><i>à adapter selon la taille du lac</i></small></label
						>
						<div class="flex items-center gap-x-3 text-lg">
							<p>Entre</p>
							<input
								type="number"
								id="minPoisson"
								class="w-20 px-2 pt-1 border-2 border-blue-900 rounded-md"
								bind:value={minPoisson}
							/>
							<p>et</p>
							<input
								type="number"
								id="maxPoisson"
								class="w-20 px-2 pt-1 border-2 border-blue-900 rounded-md"
								bind:value={maxPoisson}
							/>
						</div>
					</div>

					<div class="flex flex-col space-y-2">
						<div class="flex items-center gap-x-4">
							<label for="maxPoisson" class="text-xl underline">Taille du lac :</label>

							<input
								type="range"
								id="maxPoisson"
								min="500"
								max="30000"
								class="w-48"
								bind:value={lacSize}
							/>

							<p class="px-3 pt-1.5 pb-1 bg-white rounded-xl border-2 border-gray-400">{lacSize}</p>
						</div>
					</div>
				</div>

				<button
					class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 mt-10 duration-150 hover:bg-[#84c3a6]"
					on:click={handleStartSimulationButtonClicked}>Commencer la simulation</button
				>
			</div>
		{:else}
			<div class="flex flex-col mt-8 text-xl">
				<h2 class="text-3xl mt-5 font-bold">Simulation</h2>

				<label
					>Nombre de poissons à capturer : <input
						type="number"
						min="1"
						max={maxPoisson}
						class="text-center pt-1 bg-opacity-80 outline-none bg-white rounded-lg mt-3"
						bind:value={toCapture}
					/></label
				>

				<div class="grid grid-cols-2 grid-rows-2 gap-x-8 w-full">
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 mt-10 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						on:click={handleCaptureButtonClicked}
						disabled={didCapture}
						>Capture
					</button>
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 mt-10 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						disabled={(!didCapture && !didMark) || didMark}
						on:click={handleMarquageButtonClicked}
						>Marquage
					</button>
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 mt-10 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						disabled={!didMark}
						>Recapture
					</button>
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 mt-10 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						disabled={!didMark}
						>Terminer et estimer
					</button>
				</div>
			</div>
		{/if}
	</div>

	{#if poissonsCaptures}
		<div
			class="absolute top-[60%] overflow-auto max-h-[30%] right-5 flex flex-wrap xl:w-[30%] lg:w-[40%] w-[50%]"
		>
			{#each poissonsCaptures as poisson}
				<img src="fish.png" class="w-10 object-contain h-10" alt="poisson" />
			{/each}
		</div>
	{/if}
</div>

<style>
	#main {
		background-color: #e5e5f7;
		opacity: 0.8;
		background-image: radial-gradient(#9093bb 1px, #c2c2fc 1px);
		background-size: 10px 10px;

		color: rgb(0, 0, 0);
	}
</style>
