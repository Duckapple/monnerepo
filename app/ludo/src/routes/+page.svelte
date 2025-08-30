<script lang="ts">
	import Piece from '$lib/components/piece.svelte';
	import { useMove } from '$lib/hooks/use-move.svelte.ts';
</script>

{#each ['text-green-600', 'text-red-600', 'text-blue-600', 'text-yellow-600'] as color}
	{#each Array(4).keys()}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute size-24 select-none" {...useMove()}>
			<Piece class="size-24 {color}" />
		</div>
	{/each}
{/each}

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
