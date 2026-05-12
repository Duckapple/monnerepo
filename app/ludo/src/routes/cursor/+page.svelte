<script lang="ts">
	import { browser } from '$app/environment';
	import { getWsStore } from '$lib/hooks/ws.svelte.ts';
	import { on } from 'svelte/events';
	import debounce from 'lodash.debounce';

	const ws = getWsStore();
	let cursors = $state<({ x: number; y: number; id: number } | null)[]>([]);

	const handler = debounce(
		(e: MouseEvent) => ws.send('mousemove', { x: e.pageX, y: e.pageY }),
		50,
		{ maxWait: 50 }
	);

	if (browser && ws) {
		ws.on('mouse', (data) => {
			cursors[data.id] = data;
		});
		on(window, 'mousemove', handler);
	}

	function color(i: number) {
		return ['bg-green-500', 'bg-amber-500', 'bg-sky-500', 'bg-ruby-500', 'bg-purple-500'][i % 5];
	}
</script>

{#each cursors as cursor, i (cursor?.id ?? i)}
	{#if cursor}
		<div
			class="absolute -top-8 -left-8 size-2 transition-transform duration-50 {color(cursor.id)}"
			style="transform: translate({cursor.x}px,{cursor.y}px)"
		></div>
	{/if}
{/each}
