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
	let nbrePoisson = 0;
	let isCapturing = false;

	let nbrePoissonMarque: number = 0;
	let nbrePoissonRecuperes: {
		id: number;
		nbrePoissonDansEchantillon: number;
		nbreMarque: number;
		estimation: number;
	}[] = [];
	let moyenne = 0;

	$: if (nbrePoissonRecuperes && nbrePoissonRecuperes.length > 0) {
		moyenne =
			nbrePoissonRecuperes.reduce((acc, curr) => acc + curr.estimation, 0) /
			nbrePoissonRecuperes.length;
	}

	$: if (lacSize) {
		// Trouve un minimum et un maximum pour le nombre de poissons adapté à la taille du lac
		// pour une taille de 4000, minPoisson = 500 et maxPoisson = 3000
		minPoisson = Math.floor((lacSize * 500) / 4000);
		maxPoisson = Math.floor((lacSize * 3000) / 4000);
	}

	$: if ((lacSize || minPoisson || maxPoisson) && lac) {
		nbrePoisson = lac.refreshAnimation();
	}

	async function handleCaptureButtonClicked() {
		didCapture = true;

		poissonsCaptures = await lac.captureFish(toCapture);
	}

	async function handleRecaptureButtonClicked() {
		isCapturing = true;
		poissonsCaptures = await lac.captureFish(toCapture);
		isCapturing = false;
	}

	function handleMarquageButtonClicked() {
		didMark = true;

		// Marque tout les poissons en leur donnant une couleur
		lac.markFish(poissonsCaptures);

		nbrePoissonMarque = poissonsCaptures.length;

		poissonsCaptures = [];

		if (vitesse === 3) vitesse = 300; // Pour avoir comme une vrai simulation
	}

	function handleStartSimulationButtonClicked() {
		hasSimulationStarted = true;
		didMark = false;
		didCapture = false;
	}

	function handleCompterButtonClicked() {
		let compteur = 0;
		poissonsCaptures.forEach((poisson) => {
			if (poisson.marked) {
				compteur++;
			}
		});

		nbrePoissonRecuperes = [
			...nbrePoissonRecuperes,
			{
				id: nbrePoissonRecuperes.length + 1,
				nbrePoissonDansEchantillon: poissonsCaptures.length,
				nbreMarque: compteur,
				estimation:
					compteur === 0
						? // la moyenne jusqu'à maintenant
							moyenne
						: (nbrePoissonMarque * poissonsCaptures.length) / compteur
			}
		];

		poissonsCaptures = [];
		lac.bougerPoissons();
	}
</script>

<div class="w-screen h-screen" id="main">
	<div class="h-screen pt-5 pl-5 xl:w-[60%] lg:w-[50%] w-full md:w-[40%] md:mt-0 mt-36">
		<Lac bind:this={lac} {minPoisson} {maxPoisson} {vitesse} {lacSize} />

		<h1 class="text-5xl font-bold">CMR Simulator</h1>

		<p class="text-2xl mt-5">
			Bienvenue dans le simulateur de <b>C</b>apture, <b>M</b>arquage et <b>R</b>ecapture. Vous
			pouvez grâce à ce simulateur visualiser le comportement des poissons dans leur espace naturel
			afin de comprendre la technique CMR. Vous pourrez ainsi tenter d'estimer la population de
			poissons dans ce lac. De
			<a href="https://www.rayanestaszewski.fr" class="text-blue-800 underline" target="_blank"
				>Rayane STASZEWSKI</a
			>.
		</p>

		{#if !hasSimulationStarted}
			<div>
				<h2 class="text-3xl mt-5 font-bold">Paramètres</h2>

				<div class="flex flex-col space-y-5 mt-5">
					<div class="flex flex-col space-y-2">
						<label for="minPoisson" class="text-xl"
							><span class="underline">Nombre de poissons :</span>
						</label>
						<div class="flex items-center gap-x-3 text-lg">
							<p>Entre</p>
							<input
								type="number"
								id="minPoisson"
								min="1"
								max={maxPoisson}
								class="w-20 px-2 pt-1 border-2 border-blue-900 rounded-md"
								bind:value={minPoisson}
							/>
							<p>et</p>
							<input
								type="number"
								min={minPoisson}
								max="10000"
								id="maxPoisson"
								class="w-20 px-2 pt-1 border-2 border-blue-900 rounded-md"
								bind:value={maxPoisson}
							/>
						</div>
					</div>

					<div class="flex flex-col space-y-2">
						<div class="flex items-center gap-x-4">
							<label for="tailleLac" class="text-xl underline">Taille du lac :</label>

							<input
								type="range"
								id="tailleLac"
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

				<p class="text-xl mt-4 cursor-pointer group">
					Nombre de poissons dans le lac : <sm class="text-lg">(maintenez pour révéler)</sm>
					<span class="group-active:block hidden font-bold">
						Il y a {nbrePoisson} poissons.
					</span>
				</p>

				<label
					>Nombre de poissons à capturer : <input
						type="number"
						min="1"
						max={maxPoisson}
						class="text-center pt-1 bg-opacity-80 outline-none bg-white rounded-lg mt-3"
						bind:value={toCapture}
					/></label
				>

				<label>
					Vitesse de déplacement des poissons :
					<input type="range" min="1" max="600" class="w-full" bind:value={vitesse} />
				</label>

				<div class="grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-3 w-full">
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						on:click={handleCaptureButtonClicked}
						disabled={didCapture}
						>Capture
					</button>
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						disabled={(!didCapture && !didMark) || didMark || !poissonsCaptures}
						on:click={handleMarquageButtonClicked}
						>Marquage
					</button>
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						on:click={handleRecaptureButtonClicked}
						disabled={!didMark || (poissonsCaptures && poissonsCaptures.length > 0) || isCapturing}
						>Recapture
					</button>
					<button
						class="px-4 pt-2 pb-1.5 text-xl bg-[#a1e3c4] border-[#6ca472] shadow-xl rounded-xl border-4 duration-150 hover:bg-[#84c3a6] disabled:bg-gray-300 disabled:border-gray-400"
						disabled={!(poissonsCaptures && poissonsCaptures.length > 0) || !didMark}
						on:click={handleCompterButtonClicked}
						>Compter
					</button>
				</div>

				<!-- Tableau -->
				<div
					class="mt-4 bg-green-300 border-4 border-green-500 rounded-xl justify-center flex flex-wrap overflow-auto max-h-[800px] overflow-y-scroll"
				>
					{#if nbrePoissonRecuperes.length > 0}
						{#each nbrePoissonRecuperes as donnee}
							<div class="p-4">
								<p class="text-2xl font-bold text-center underline mb-4">
									Capture numéro {donnee.id}
								</p>
								<table class="w-[40%] text-left">
									<tr>
										<th></th>
										<th>Lac</th>
										<th>Echantillon</th>
									</tr>
									<tr>
										<td>Marqués</td>
										<td>{nbrePoissonMarque}</td>
										<td>{donnee.nbreMarque}</td>
									</tr>
									<tr>
										<td>Total</td>
										<td>{donnee.estimation.toFixed(2)}</td>
										<td>{donnee.nbrePoissonDansEchantillon}</td>
									</tr>
								</table>
							</div>
						{/each}
					{:else}
						<p class="text-2xl font-bold text-center py-5">Aucune capture pour le moment</p>
					{/if}
				</div>

				<button
					class="w-80 px-4 pt-2 pb-1.5 text-xl bg-[#d5e3a1] border-[#9aa46c] shadow-xl rounded-xl mt-3 border-4 duration-150 hover:bg-[#b0c384]"
					on:click={() => {
						location.reload();
					}}
					>Recommencer la simulation
				</button>

				<p class="text-3xl mt-8 md:mt-0 block md:absolute right-8 bottom-4">
					Moyenne des estimations :
					{#if nbrePoissonRecuperes && nbrePoissonRecuperes.length > 0}
						<span class="font-bold">
							{moyenne.toFixed(2)}
						</span>
					{:else}
						<br /><span class="font-bold text-lg">lancez d'abord des recapatures</span>
					{/if}
				</p>
			</div>
		{/if}
	</div>

	{#if poissonsCaptures && poissonsCaptures.length > 0}
		<div
			class="absolute p-5 bg-blue-800 top-[60%] rounded-xl overflow-auto max-h-[30%] right-5 xl:w-[30%] lg:w-[40%] w-[50%]"
		>
			<p class="text-white text-lg underline">Poissons capturés :</p>
			<div class="flex flex-wrap">
				{#each poissonsCaptures as poisson}
					<img
						src={poisson.marked ? 'markedfish.png' : 'fish.png'}
						class="w-10 object-contain h-10"
						alt="poisson"
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	table,
	th,
	td {
		border: 1px solid black;
		border-collapse: collapse;
		padding: 5px;
	}
</style>
