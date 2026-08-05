<script lang="ts">
	import { run } from 'svelte/legacy';

	import { iconOf, textColorOf } from '$lib/color';
	import { Spring } from 'svelte/motion';
	import type { Color } from '$common/model';
	import { useRuneContext } from '$lib/state/context-rune.svelte';
	import Icon from '$lib/base/Icon.svelte';

	interface Props {
		color: Color;
		min?: number;
		value?: number;
		max?: number;
		invalid?: boolean;
		noButtons?: boolean;
		decrement?: any;
		increment?: any;
	}

	const {
		color,
		min = 0,
		value = 0,
		max = 5,
		invalid = false,
		noButtons = false,
		decrement = (_: Color) => {},
		increment = (_: Color) => {},
	}: Props = $props();

	const colorblind = useRuneContext('colorblind');

	const displayed_count = Spring.of(() => value);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
	run(() => {
		displayed_count.set(value);
	});
	const offset = $derived(modulo(displayed_count.current, 1));
</script>

<div
	class="my-4 flex flex-col rounded-t-md rounded-b-md md:rounded-t-xl md:rounded-b-xl"
	class:shadow={!noButtons}
>
	{#if !noButtons}
		<button
			class={[
				'flex touch-manipulation flex-col items-center justify-center gap-1 rounded-t-md border-0 bg-transparent p-0 md:rounded-t-xl md:p-1',
				value >= max && 'cursor-not-allowed',
				value < max && 'hover:bg-slate-200',
			]}
			onclick={() => value < max && increment(color)}
			aria-label="Increase the counter by one"
		>
			{#if colorblind.value}
				<Icon icon={iconOf[color]} class={['mx-auto size-6 rotate-12', textColorOf[color]]} />
			{/if}
			<svg aria-hidden="true" viewBox="0 0 1 1" class="size-4 flex-none">
				<path
					class={[
						'stroke-2 [vector-effect:non-scaling-stroke]',
						value < max && 'stroke-zinc-700',
						value >= max && 'stroke-zinc-300',
					]}
					d="M0,0.5 L1,0.5 M0.5,0 L0.5,1"
				/>
			</svg>
		</button>
	{:else}
		<div class="h-6 md:h-8"></div>
	{/if}

	<div
		class={[
			'relative h-12 w-8 cursor-default overflow-hidden border-red-500 text-center md:h-16 md:w-14 ',
			textColorOf[color],
			value === 0 && 'text-opacity-60',
			invalid && 'border-b-2',
		]}
	>
		<div
			class="absolute inset-0 text-5xl font-normal md:text-7xl"
			style="transform: translate(0, {100 * offset}%)"
		>
			<span
				class="absolute -top-full flex h-full w-full items-center justify-center select-none"
				aria-hidden="true">{Math.floor(displayed_count.current + 1)}</span
			>
			<span class="absolute flex h-full w-full items-center justify-center"
				>{Math.floor(displayed_count.current)}</span
			>
		</div>
	</div>

	{#if !noButtons}
		<button
			class={[
				'flex h-6 touch-manipulation items-center justify-center rounded-b-md border-0 bg-transparent p-0 md:h-8 md:rounded-b-xl',
				value <= min && 'cursor-not-allowed',
				value !== min && 'hover:bg-slate-200',
			]}
			onclick={() => value > min && decrement(color)}
			aria-label="Decrease the counter by one"
		>
			<svg aria-hidden="true" viewBox="0 0 1 1" class="size-1/2">
				<path
					class={[
						'stroke-2 [vector-effect:non-scaling-stroke]',
						value !== min && 'stroke-zinc-700',
						value <= min && 'stroke-zinc-300',
					]}
					d="M0,0.5 L1,0.5"
				/>
			</svg>
		</button>
	{:else}
		<div class="h-6 md:h-8"></div>
	{/if}
</div>
