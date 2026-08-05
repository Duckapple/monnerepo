<script lang="ts">
	import { type Card } from '$common/model';
	import { bgColorOf, fadeTextBgColorOf, gradientOf, iconOf } from '$lib/color';
	import type { KeyboardEventHandler, MouseEventHandler } from 'svelte/elements';
	import Icon from '$lib/base/Icon.svelte';
	import { onMount } from 'svelte';
	import { useRuneContext } from '$lib/state/context-rune.svelte';

	interface Props {
		stacked?: boolean;
		card: Card;
		hideCost?: boolean;
		small?: boolean;
		rotated?: boolean;
		onclick?: MouseEventHandler<HTMLButtonElement> | null;
		onkeypress?: KeyboardEventHandler<HTMLButtonElement> | null;
		style?: string;
		autofocus?: boolean;
	}

	const {
		stacked = false,
		card,
		hideCost = false,
		small = false,
		rotated = false,
		onclick,
		onkeypress,
		style,
		autofocus,
	}: Props = $props();

	const colorBlind = useRuneContext('colorblind');

	const filteredLength = $derived(card.cost.filter(Boolean).length);
	const cols = [
		' grid-cols-1',
		' grid-cols-1',
		' grid-cols-2' + (!small ? ' md:grid-cols-1' : ''),
		' grid-cols-2',
	];
	const secondPos = $derived(
		(() => {
			let x = -1;
			for (let i = 0; i < card.cost.length; i++) {
				if (card.cost[i]) {
					if (x !== -1) {
						x = i;
						break;
					}
					x = i;
				}
			}
			return x;
		})()
	);
	const cardStyle = $derived(!small ? 'md:w-32 md:h-48 md:text-3xl' : '');
	const pointStyle = $derived(!small ? 'md:py-0.5 md:px-2 md:text-6xl' : '');
	const costStyle = $derived(!small ? 'md:text-2xl md:leading-5 md:pl-2 md:pb-2 md:w-20' : '');

	const fadeText = $derived(card.p === 0);

	let ref = $state<HTMLButtonElement>();
	onMount(() => {
		if (autofocus) {
			ref?.focus();
		}
	});
</script>

<button
	bind:this={ref}
	class={[
		'flex aspect-square h-[5.5rem] w-14 flex-col justify-between rounded-lg border border-black bg-linear-to-bl shadow-lg outline-offset-4 outline-blue-500 transition-[transform,scale,opacity] select-none first:mt-0 focus:outline',
		cardStyle,
		gradientOf[card.c],
		{
			'md:-mt-32': stacked && !small,
			'-mt-16 cursor-default': stacked,
			'hover:z-10 hover:scale-110': !stacked,
			'-rotate-90': rotated,
		},
	]}
	disabled={stacked}
	data-card-id={card.id}
	{onclick}
	{onkeypress}
	{style}
>
	<div
		class="flex w-full items-center justify-between rounded-t-lg px-1 text-left text-3xl {pointStyle} {fadeText
			? fadeTextBgColorOf[card.c]
			: bgColorOf[card.c]}"
	>
		<span>{card.p}</span>
		<Icon
			icon={iconOf[card.c]}
			class="{bgColorOf[card.c]} {small ? 'size-6' : 'size-6 md:size-10'} rotate-12"
		/>
	</div>
	<div
		class={[
			'grid w-12 gap-1 pb-1 pl-1 text-sm leading-none',
			costStyle,
			cols[filteredLength - 1],
			colorBlind.value && 'md:gap-x-6 md:gap-y-2',
		]}
	>
		{#each card.cost as cost, i (i)}
			{#if filteredLength === 3 && secondPos === i}
				<div class={[!small && 'md:-order-1 md:hidden']}></div>
			{/if}
			{#if !hideCost && cost}
				{@const bg = bgColorOf[i]}
				<span
					class={[
						'relative z-0 flex aspect-square w-5 items-center justify-center rounded-full p-0.5',
						bg,
						!small && 'md:w-8 md:p-1',
					]}
				>
					{cost}
					{#if colorBlind.value}
						<div
							class={[
								'absolute top-0 -right-1 -z-10 flex w-5 items-center justify-end rounded-full',
								bg,
								!small && 'md:-right-3 md:h-6 md:w-10 md:pr-px',
							]}
						>
							<Icon icon={iconOf[i]} class={['size-3 rotate-12', !small && 'md:size-5']} />
						</div>
					{/if}
				</span>
			{/if}
		{/each}
	</div>
</button>
