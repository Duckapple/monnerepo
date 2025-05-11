<script lang="ts">
	import * as UI from '$ui';
	import type { Component } from 'svelte';
	let { data } = $props();
</script>

{#if data.component in UI}
	{@const Component = UI[data.component as keyof typeof UI] as Component}
	<Component />
{:else}
	Component not found
{/if}
