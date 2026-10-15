<script lang="ts">
	import { onMount } from 'svelte';
	import { useCommandBar } from '../../hooks/command-bar.svelte.ts';

	const commandBar = useCommandBar();

	onMount(() => {
  	function debugMenu(e: KeyboardEvent) {
  		if (e.key !== '`') return;
  		commandBar.open = !commandBar.open;
  	}

  	window.addEventListener('keydown', debugMenu);
  	return () => {
    	window.removeEventListener('keydown', debugMenu);
    }
	});

	const activeOptions = $derived(
	  commandBar.inputText ? commandBar.findOptions(commandBar.inputText) : []
	);
</script>

{#if commandBar.open}
	<div class="fixed inset-0 flex h-screen w-full flex-col items-center justify-center bg-white/40">
		<div
			class="relative rounded-xl border border-lime-600 outline-offset-2 has-focus-visible:outline"
		>
			<input class="p-3 outline-none" bind:value={commandBar.inputText} />
			<div id="overlay" class="pointer-events-none absolute inset-0 p-3">
				{#if commandBar.inputText.startsWith('http')}
					<span
						class="pointer-events-auto -m-1 rounded-sm bg-lime-800 px-0.5 text-white hover:bg-lime-700"
					>
						http
					</span>
				{/if}
			</div>
		</div>
		<ul class="flex flex-col">
			{#each activeOptions as result (result.id)}
			  <li onclick={() => commandBar.choose(result)}>{result.label}</li>
			{/each}
		</ul>
	</div>
{/if}
