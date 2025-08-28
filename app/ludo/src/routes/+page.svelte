<script lang="ts">
	import { Button } from '@sgk/ui';
	import { getFs } from './test.remote.ts';
</script>

<Button>click me</Button>
<div class="rounded-xl bg-red-400 p-4">yooo</div>

<svelte:boundary>
	{#snippet pending()}
		<p>Loading...</p>
	{/snippet}
	{#each await getFs() as file}
		<p>{file}</p>
	{/each}
</svelte:boundary>
