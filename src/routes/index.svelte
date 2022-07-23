<script lang="ts">
	import { page } from '$app/stores';
	import Clipboard from '$lib/Clipboard.svelte';
	let url: string;
	let isURLGenerated: boolean = false;
	let isInvalidURL: boolean = false;

	function isValidHttpUrl(string) {
		let url;

		try {
			url = new URL(string);
		} catch (_) {
			return false;
		}

		return url.protocol === 'http:' || url.protocol === 'https:';
	}

	async function getURL() {
		if (isValidHttpUrl(url)) {
			const r = (Math.random() + 1).toString(36).substring(7);
			const redirectURL = `${$page.url}${r}`;
			isInvalidURL = false;
			const data = { key: r, url: url };
			await fetch('/', {
				method: 'POST',
				headers: {
					accept: 'application/json'
				},
				body: JSON.stringify(data)
			});
			url = redirectURL;
			isURLGenerated = true;
		} else isInvalidURL = true;
	}
</script>

<svelte:head>
	<title>Shrink | Home</title>
</svelte:head>
<div class="bg-white w-screen h-screen flex flex-col justify-center text-center">
	<h1 class="text-6xl p-4 text-fuchsia-500 font-bold">Shrink Me, Web.</h1>
	<div class="flex justify-center w-full p-10">
		<div class="mb-3 xl:w-2/4">
			{#if isInvalidURL}
				<div
					id="alert-border-2"
					class="flex p-4 mb-4 bg-red-100 border-t-4 border-red-500 dark:bg-red-200"
					role="alert"
				>
					<svg
						class="flex-shrink-0 w-5 h-5 text-red-700"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clip-rule="evenodd"
						/></svg
					>
					<div class="ml-3 text-sm font-medium text-red-700">You have typed wrong URL.</div>
				</div>
			{/if}
			<div class="input-group relative flex items-stretch w-full mb-4">
				<input
					type="text"
					class="form-control relative flex-auto block w-full border-b-2 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding transition ease-in-out m-0 focus:outline-none duration-300 focus:text-gray-700 focus:bg-white {isURLGenerated
						? 'border-emerald-600 focus:border-emerald-600'
						: 'border-fuchsia-600 focus:border-fuchsia-600'}"
					placeholder="Paste or type your URL"
					aria-label="url"
					aria-describedby="url"
					bind:value={url}
				/>
				<Clipboard
					text={url}
					let:copy
					on:copy={() => {
						console.log('Has Copied');
					}}
				>
					{#if isURLGenerated}
						<button
							on:click={copy}
							class="inline-block px-6 py-2 border-2 border-emerald-600 bg-emerald-600 text-white font-medium text-xs leading-tight uppercase hover:bg-white hover:text-emerald-600 transition duration-300 ease-in-out"
							type="button"
							id="button-copy">Copy</button
						>
						<button
							on:click={() => {
								url = '';
								isURLGenerated = false;
							}}
							class="inline-block px-6 py-2 border-2 border-rose-600 bg-rose-600 text-white font-medium text-xs leading-tight uppercase hover:bg-white hover:text-rose-600 transition duration-300 ease-in-out"
							type="button"
							id="button-reset">Reset</button
						>
					{:else}
						<button
							on:click={getURL}
							class="inline-block px-6 py-2 border-2 border-fuchsia-600 bg-fuchsia-600 text-white font-medium text-xs leading-tight uppercase hover:bg-white hover:text-fuchsia-600 transition duration-300 ease-in-out"
							type="button"
							id="button-addon3">Shrink</button
						>
					{/if}
				</Clipboard>
			</div>
			<div class="flex justify-center items-center">
				<div class="spinner-grow inline-block w-8 h-8 bg-fuchsia-600 rounded-full  opacity-0" />
			</div>
		</div>
	</div>
</div>
