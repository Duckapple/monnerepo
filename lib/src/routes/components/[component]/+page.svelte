<script lang="ts">
	import * as UI from '$lib/ui/_.ts';
	import type { Component } from 'svelte';

	let { data } = $props();

	let params = $state(
		Object.fromEntries(data.params.map(({ key, defaultValue }) => [key, defaultValue]))
	);
</script>

<div class="flex h-screen w-full flex-col justify-stretch">
	<div class="flex flex-1 items-center justify-center p-8 md:p-16">
		{#if data.component in UI}
			{@const Component = UI[data.component as keyof typeof UI] as Component}
			<Component {...params} />
		{:else}
			Component not found
		{/if}
	</div>
	<div class="flex flex-1 flex-col border-t border-lime-400 bg-lime-200 p-4 md:p-12">
		<div class="mx-auto grid grid-cols-2 gap-2">
			<span class="min-w-sm">Property</span>
			<span>Value</span>
			{#each data.params as { key, options, defaultValue }}
				<span class="py-1 font-mono font-semibold">{key}</span>
				<div>
					{#if options?.length}
						<select
							class="min-w-32 rounded-lg border border-lime-900 px-2 py-1"
							name="{key}-options"
							id="{key}-options"
							bind:value={params[key]}
						>
							{#each options as option}
								<option value={option} selected={defaultValue === option ? true : undefined}>
									{option}
								</option>
							{/each}
						</select>
					{:else if typeof defaultValue === 'string'}
						<input
							name="{key}-input"
							id="{key}-input"
							class="rounded-lg border bg-lime-50 px-2 py-1"
							bind:value={params[key]}
						/>
					{:else if typeof defaultValue === 'boolean'}
						<input type="checkbox" bind:checked={params[key]} />
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
