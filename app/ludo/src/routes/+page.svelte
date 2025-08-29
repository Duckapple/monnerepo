<script lang="ts">
	import { Button } from '@sgk/lib';
	import Piece from '$lib/components/piece.svelte';

	let pos = $state({ x: 0, y: 0 });
	let dragItem = $state<HTMLElement | null>(null);
	let mouseState = $state({ dragging: false, xOffset: 0, yOffset: 0, xInitial: 0, yInitial: 0 });

	function isTouch(e: MouseEvent | TouchEvent): e is TouchEvent {
		return e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend';
	}
	function start(e: MouseEvent | TouchEvent) {
		if (isTouch(e)) {
			mouseState.xInitial = (e.touches[0]?.clientX ?? 0) - mouseState.xOffset;
			mouseState.yInitial = (e.touches[0]?.clientY ?? 0) - mouseState.yOffset;
		} else {
			mouseState.xInitial = e.clientX - mouseState.xOffset;
			mouseState.yInitial = e.clientY - mouseState.yOffset;
		}

		mouseState.dragging = true;
	}
	function move(e: MouseEvent | TouchEvent) {
		if (!mouseState.dragging) return;

		e.preventDefault();

		if (isTouch(e)) {
			pos.x = (e.touches[0]?.clientX ?? 0) - mouseState.xInitial;
			pos.y = (e.touches[0]?.clientY ?? 0) - mouseState.yInitial;
		} else {
			pos.x = e.clientX - mouseState.xInitial;
			pos.y = e.clientY - mouseState.yInitial;
		}

		mouseState.xOffset = pos.x;
		mouseState.yOffset = pos.y;
	}
	function end(_: MouseEvent | TouchEvent) {
		mouseState.xInitial = pos.x;
		mouseState.yInitial = pos.y;

		mouseState.dragging = false;
	}
</script>

<svelte:window onmousemove={move} ontouchmove={move} onmouseup={end} ontouchend={end} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={dragItem}
	class="size-24 select-none"
	style="transform: translate3d({pos.x}px, {pos.y}px, 0);"
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
