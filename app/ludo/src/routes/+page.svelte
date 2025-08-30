<script lang="ts">
	import { Button } from '@sgk/lib/ui';
	import Piece from '$lib/components/piece.svelte';

	let itemState = $state({ x: 0, y: 0, item: null as HTMLElement | null });
	let mouseState = $state({ dragging: false, xInitial: 0, yInitial: 0 });

	function isTouch(e: MouseEvent | TouchEvent): e is TouchEvent {
		return e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend';
	}
	function start(e: MouseEvent | TouchEvent) {
		if (isTouch(e)) {
			mouseState.xInitial = (e.touches[0]?.clientX ?? 0) - itemState.x;
			mouseState.yInitial = (e.touches[0]?.clientY ?? 0) - itemState.y;
		} else {
			mouseState.xInitial = e.clientX - itemState.x;
			mouseState.yInitial = e.clientY - itemState.y;
		}

		mouseState.dragging = true;
	}
	function move(e: MouseEvent | TouchEvent) {
		if (!mouseState.dragging) return;

		e.preventDefault();

		if (isTouch(e)) {
			itemState.x = (e.touches[0]?.clientX ?? 0) - mouseState.xInitial;
			itemState.y = (e.touches[0]?.clientY ?? 0) - mouseState.yInitial;
		} else {
			itemState.x = e.clientX - mouseState.xInitial;
			itemState.y = e.clientY - mouseState.yInitial;
		}
	}
	function end(_: MouseEvent | TouchEvent) {
		mouseState.dragging = false;
	}
</script>

<svelte:window onmousemove={move} ontouchmove={move} onmouseup={end} ontouchend={end} />

<Button>click me</Button>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={itemState.item}
	class="size-24 select-none"
	style="transform: translate3d({itemState.x}px, {itemState.y}px, 0);"
	onmousedown={start}
	ontouchstart={start}
>
	<Piece class="size-24 text-green-600" />
</div>

<div class="grid w-196 grid-cols-11 gap-2">
	<div class="col-span-4 row-span-4 flex rounded-4xl bg-red-500">
		<div class="m-8 w-full rounded-2xl bg-red-400"></div>
	</div>
	{#each Array(3).keys()}
		<div class="size-16 rounded-full border border-slate-400"></div>
	{/each}
	<div class="col-span-4 row-span-4 flex rounded-4xl bg-green-500">
		<div class="m-8 w-full rounded-2xl bg-green-400"></div>
	</div>
	{#each Array(9).keys()}
		<div class="size-16 rounded-full border border-slate-400"></div>
	{/each}
	{#each Array(16).keys()}
		<div class="size-16 rounded-full border border-slate-400"></div>
	{/each}
	<div class="size-16 rounded-full"></div>
	{#each Array(16).keys()}
		<div class="size-16 rounded-full border border-slate-400"></div>
	{/each}
	<div class="col-span-4 row-span-4 flex rounded-4xl bg-sky-500">
		<div class="m-8 w-full rounded-2xl bg-sky-400"></div>
	</div>
	{#each Array(3).keys()}
		<div class="size-16 rounded-full border border-slate-400"></div>
	{/each}
	<div class="col-span-4 row-span-4 flex rounded-4xl bg-yellow-500">
		<div class="m-8 w-full rounded-2xl bg-yellow-400"></div>
	</div>
	{#each Array(9).keys()}
		<div class="size-16 rounded-full border border-slate-400"></div>
	{/each}
</div>
