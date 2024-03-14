<script lang="ts">
	import Lac from '$lib/Components/Lac.svelte';

	let minPoisson = 500; // Le nombre minimum de poissons
	let maxPoisson = 3000; // Le nombre maximum de poissons
	let vitesse = 3;

	let lacSize = 4000; // Taille du lac

	let lac: Lac;

	$: if ((lacSize || minPoisson || maxPoisson) && lac) {
		lac.refreshAnimation();
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
				>Commencer la simulation</button
			>
		</div>
	</div>
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
