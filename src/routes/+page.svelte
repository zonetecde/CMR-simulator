<script lang="ts">
	import Lac from '$lib/Components/Lac.svelte';

	let minPoisson = 500; // Le nombre minimum de poissons
	let maxPoisson = 1000; // Le nombre maximum de poissons
	let vitesse = 3;

	let lacSize = 4000; // Taille du lac
</script>

<div class="w-screen h-screen bg-red-500" id="main">
	<div class="h-screen pt-5 pl-5 xl:w-[60%] lg:w-[50%] w-[40%]">
		<Lac {minPoisson} {maxPoisson} {vitesse} {lacSize} />

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
						bind:value={vitesse}
					/>
				</div>
			</div>
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
