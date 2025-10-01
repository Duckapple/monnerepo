<script lang="ts">
	let { data } = $props();

	let rightFlap = $state<HTMLDivElement>();
	const bounds = $derived(
		rightFlap?.getBoundingClientRect() ?? {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: 0,
			height: 0,
		}
	);
	let body = $state<HTMLBodyElement>();
	let d = $state({ x: 50, y: 50 });
	const theta = $derived(isNaN(Math.atan(d.x / d.y)) ? 0 : Math.atan(d.x / d.y));
	const twoH = $derived(Math.sqrt(d.x * d.x + d.y * d.y));
	const a = $derived(clamp(0, bounds.right * 2)(twoH / 2 / Math.cos(Math.PI / 2 - theta)));
	const b = $derived(clamp(0, bounds.bottom * 2)(twoH / 2 / Math.cos(theta)));

	function clamp(min: number, max: number) {
		return (x: number) => (isNaN(x) ? min : Math.min(max, Math.max(min, x)));
	}
	const clampWide = $derived(clamp(bounds.left, bounds.right * 2));
	const clampHigh = $derived(clamp(bounds.top, bounds.bottom * 2));
</script>

<svelte:body bind:this={body} />
<svelte:window
	onpointermove={(event) => {
		d.x = clampWide(event.clientX) - bounds.left;
		d.y = clampHigh(event.clientY) - bounds.top;
	}}
/>

{#snippet dot(x: number, y: number)}
	<div
		class="absolute -top-2 -left-2 size-4 rounded-full bg-blue-500"
		style="transform: translate({isNaN(x) ? 0 : x}px, {isNaN(y) ? 0 : y}px)"
	></div>
{/snippet}

<div class="bg-blue-100 p-8">
	<div class="relative h-96 w-64">
		<div
			class="absolute top-0 bottom-0 left-0 w-32 bg-red-500"
			style="clip-path: polygon(100% 100%, 0 100%, 0 0, {bounds.width - a}px 0, 100% {b}px)"
		></div>
		<div
			bind:this={rightFlap}
			class="absolute top-0 right-0 bottom-0 w-32 bg-amber-500"
			style="clip-path: polygon(100% 100%, 0 100%, 0 {b}px, {a}px 0, 100% 0)"
		></div>
		<div
			class="absolute top-0 right-0 bottom-0 w-32 bg-green-500"
			style="clip-path: polygon(0 {b}px, {a}px 0, {d.x}px {d.y}px);"
		></div>
		<div
			class="absolute top-0 bottom-0 left-0 w-32 bg-green-500"
			style="clip-path: polygon(100% {b}px, {bounds.width - a}px 0, {bounds.width -
				d.x}px {d.y}px);"
		></div>
		{@render dot(128 + d.x, d.y)}
		{@render dot(128 - a, 0)}
		{@render dot(128 + a, 0)}
		{@render dot(128, b)}
	</div>
</div>

<div>d: {JSON.stringify(d)}</div>
<div>theta: {(theta * 180) / Math.PI}</div>
<div>twoH: {twoH}</div>
<div>a: {a}</div>
<div>b: {b}</div>
<div>{((Math.PI / 2 - theta) * 180) / Math.PI}</div>
