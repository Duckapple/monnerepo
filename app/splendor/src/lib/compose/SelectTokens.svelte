<script lang="ts">
	import Coin from '$lib/game/Coin.svelte';
	import { slide } from 'svelte/transition';
	import type { Color } from '$common/model';
	import { range } from '$common/utils';

	interface Props {
		initialCoinColor: Color | null;
		holdTokens?: number[];
		tokens: number[];
		error?: string;
		tryTake: (color: Color) => void;
		tryReturn: (color: Color) => void;
		center?: HTMLDivElement;
	}
	let {
		tokens = $bindable(),
		center = $bindable(),
		error = $bindable(),
		holdTokens,
		initialCoinColor,
		tryTake,
		tryReturn,
	}: Props = $props();

	const takenOfEach = $derived(
		range(6).map((color) => tokens.filter((token) => token === color).length)
	);
	const leftOverOfEach = $derived((holdTokens ?? []).map((count, i) => count - takenOfEach[i]));
</script>

<div class="flex flex-col-reverse gap-4 pt-4 pb-2 md:gap-8 md:pt-2">
	{#if error}
		<span transition:slide={{ axis: 'y', duration: 150 }} class="text-sm text-red-700 md:text-base"
			>{error}</span
		>
	{/if}
	<div class="relative flex gap-1.5 md:gap-4">
		<div
			class="absolute flex size-10 items-center justify-center md:size-24"
			style="left: calc({initialCoinColor ?? 0} * var(--coin-with-gap))"
		>
			<div bind:this={center}></div>
		</div>
		{#each leftOverOfEach ?? [] as stackSize, color (color)}
			<Coin {color} {stackSize} onclick={() => stackSize > 0 && tryTake(color)} />
		{/each}
	</div>
	<div class="relative flex gap-1.5 md:gap-4">
		{#each takenOfEach as stackSize, color (color)}
			<Coin {color} {stackSize} onclick={() => tryReturn(color)} />
		{/each}
	</div>
</div>
