<script lang="ts">
	interface Props {
		tier: 'low' | 'middle' | 'high';
		count?: number;
	}

	const { tier, count = 0 }: Props = $props();

	const stackSize = $derived(Math.min(3, count));
</script>

<div class="group h-[5.5rem] w-14 select-none md:h-48 md:w-32">
	{#each Array(stackSize) as _, i (i)}
		<div
			class="-mb-[5.75rem] h-[5.5rem] w-14 rounded-lg border border-black bg-white p-1 transition-transform last:mb-0 group-hover:last:-translate-y-2 md:-mb-[12.5rem] md:h-48 md:w-32 md:p-2"
		>
			<div
				class="card-pattern flex h-full w-full items-end justify-end px-1 text-2xl text-white md:px-2 md:py-1 md:text-4xl"
				class:bg-cyan-800={tier === 'high'}
				class:bg-amber-800={tier === 'middle'}
				class:bg-green-800={tier === 'low'}
			>
				{#if i + 1 === stackSize}
					{count}
				{/if}
			</div>
		</div>
	{/each}
</div>
