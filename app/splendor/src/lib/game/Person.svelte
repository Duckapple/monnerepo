<script lang="ts">
	import type { Card } from '$common/model';
	import Icon from '$lib/base/Icon.svelte';
	import { bgColorOf, iconOf } from '$lib/color';
	import { useRuneContext } from '$lib/state/context-rune.svelte';
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';
	interface Props {
		card: Card;
		small?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement> | null;
		onkeypress?: KeyboardEventHandler<HTMLButtonElement> | null;
	}

	let { card, small = false, onclick, onkeypress }: Props = $props();
	const { cost, id, p } = card;
	const persons = ['👨🏼‍🌾', '👩🏽‍🔧', '👩🏿‍💻', '🧑🏻‍💼', '👨🏽‍🎨', '👩🏿‍🚒', '🕵🏼', '👸🏾', '🤵🏻‍♂️', '🧙🏽‍♂️'];

	let buttonMd = $derived(small ? '' : 'md:w-32 md:h-32 md:text-4xl');
	let pointsMd = $derived(small ? '' : 'md:text-6xl md:left-2 md:top-1');
	let costsMd = $derived(small ? '' : 'md:gap-1 md:leading-7 md:left-2 md:bottom-2');
	let costMd = $derived(small ? '' : 'md:p-1 md:rounded-sm');
	let personMd = $derived(small ? '' : 'md:text-6xl md:right-2 md:top-2');
</script>

<button
	class="relative aspect-square h-14 w-14 rounded-lg border border-black bg-linear-to-br from-slate-50 to-slate-200 transition-transform select-none hover:scale-110 {buttonMd}"
	data-card-id={id}
	{onclick}
	{onkeypress}
>
	<span class="absolute top-0 left-1 text-3xl leading-none {pointsMd}">{p}</span>
	<div class="absolute bottom-1 left-1 flex gap-0.5 leading-none {costsMd}">
		{#each cost as co, i}
			{#if co}
				{@const bg = bgColorOf[i]}
				<span class={['relative rounded-xs border border-black p-[1pt] text-center', costMd, bg]}>
					{co}
				</span>
			{/if}
		{/each}
	</div>
	<span class="absolute top-0 right-0 text-xl {personMd}">
		{persons[id - 0xc0] ?? ''}
	</span>
</button>
