<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}
	let { children }: Props = $props();
</script>

<button
	class="cursor-pointer rounded-md border border-amber-700 bg-amber-600 px-2 py-1 text-amber-50 hover:bg-amber-500 active:bg-amber-700"
>
	{@render children?.()}
</button>
