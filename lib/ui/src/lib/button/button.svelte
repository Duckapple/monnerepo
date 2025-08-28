<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet | string; // string:Text label
		size?: 'sm' | 'md' | 'lg'; // string:md
		theme?: 'sazz' | 'base'; // string:base
		round?: boolean; // boolean:false
	}
	let { children, size = 'md', theme = 'base', round }: Props = $props();

	const sizeClass = $derived.by(() => {
		switch (size) {
			case 'sm':
				return 'h-8 px-2 text-sm rounded-md';
			case 'md':
				return 'h-10 px-3 rounded-lg';
			case 'lg':
				return 'h-14 px-6 text-lg rounded-xl';
		}
	});

	const themeClass = $derived.by(() => {
		switch (theme) {
			case 'sazz':
				return 'border-4 border-[url(#sazzGradient)]';
			case 'base':
				return 'border border-amber-700 bg-amber-600 px-2 py-1 text-white hover:bg-amber-500 active:bg-amber-700';
		}
	});
</script>

<button class={['cursor-pointer', themeClass, sizeClass, round && 'rounded-full!']}>
	{#if typeof children === 'string'}
		{children}
	{:else}
		{@render children?.()}
	{/if}
</button>

<svg class="fixed -top-[999rem]">
	<defs>
		<linearGradient id="sazzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" style="stop-color:oklch(87.9% 0.169 91.605);stop-opacity:1.00" />
			<stop offset="50%" style="stop-color:oklch(66.6% 0.179 58.318);stop-opacity:1.00" />
			<stop offset="100%" style="stop-color:oklch(55.5% 0.163 48.998);stop-opacity:1.00" />
		</linearGradient>
	</defs>
</svg>
