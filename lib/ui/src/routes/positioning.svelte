<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {}
	let {}: Props = $props();

	let squares = $state<HTMLElement[]>([]);

	let piece = $state<HTMLElement>();

	const moveSequence = [5, 84, 69, 24, 51, 98];
	let index = $state(0);

	// $effect(() => {
	// 	const x = setInterval(() => {
	// 		if (!piece) return;

	// 		const square = squares[moveSequence[index]];

	// 		const { offsetLeft, offsetTop } = square;

	// 		piece.style = `translate: ${offsetLeft}px ${offsetTop}px;`;

	// 		index = (index + 1) % moveSequence.length;
	// 	}, 1000);

	// 	return () => clearInterval(x);
	// });

	// onMount(async () => {
	// 	if (!piece) return;
	// 	while (1) {
	// 		await sequence(
	// 			piece,
	// 			moveSequence.map((i) => ({ el: squares[i], d: 1000 }))
	// 		);
	// 	}
	// });

	function moveToTarget(event: Event) {
		if (!piece) return;
		const square = event.target as HTMLElement;
		const { offsetLeft, offsetTop } = square;
		piece.style = `translate: ${offsetLeft}px ${offsetTop}px;`;
	}

	type MS = number;
	function sequenceSync(target: HTMLElement, list: { el: HTMLElement; d: MS }[], cb?: () => void) {
		const [element, ...rest] = list;
		if (!element) return cb?.();
		const { el, d } = element;
		setTimeout(() => {
			const { offsetLeft, offsetTop } = el;
			target.style = `translate: ${offsetLeft}px ${offsetTop}px;`;
			sequenceSync(target, rest);
		}, d);
	}

	async function sequence(target: HTMLElement, list: { el: HTMLElement; d: MS }[]) {
		return new Promise((res) => {
			sequenceSync(target, list, () => res(console.log('done')));
		});
	}
</script>

<div class="grid grid-cols-10 gap-2">
	{#each Array(100).keys() as i}
		<div
			bind:this={squares[i]}
			onmousedown={moveToTarget}
			class="bg-red-300 p-8 hover:bg-red-400"
		></div>
	{/each}
</div>
<div
	bind:this={piece}
	class="absolute top-0 left-0 translate-0 rounded-full bg-green-500 p-8 transition-transform duration-300"
></div>

<div class="h-96"></div>
<div class="h-96"></div>
<div class="h-96"></div>
