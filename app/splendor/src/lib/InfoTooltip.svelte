<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { PointerEventHandler } from 'svelte/elements';
	interface Props {
		size: 'xl' | 'md';
		children?: Snippet;
		onpointerenter?: PointerEventHandler<HTMLButtonElement> | null;
		onpointerleave?: PointerEventHandler<HTMLButtonElement> | null;
	}

	let { size, children, onpointerenter, onpointerleave }: Props = $props();

	const sizeClass = size === 'xl' ? 'text-xl size-7' : '';

	let clicked = $state(false);
	function onclick() {
		clicked = !clicked;
	}
</script>

<button
	{onpointerenter}
	{onpointerleave}
	{onclick}
	class="group relative z-20 cursor-default rounded-full border-2 border-slate-700 text-center font-bold {sizeClass}"
>
	<span>i</span>
	{#if clicked}
		<div class="fixed inset-0 cursor-pointer" title="Dismiss tooltip"></div>
	{/if}
	<div
		class="absolute top-full right-0 max-h-96 min-w-72 overflow-y-auto rounded-md border bg-white p-2 text-left text-base font-normal group-hover:block md:left-0 md:max-h-none {clicked
			? 'block'
			: 'hidden'}"
	>
		{@render children?.()}
	</div>
</button>
