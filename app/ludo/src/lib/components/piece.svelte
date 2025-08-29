<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	let { class: className, ...rest }: SvelteHTMLElements['div'] = $props();
</script>

<div class={['relative', className]} {...rest}>
	<div class="trapeze-1/4 absolute top-2/3 left-1/2 size-1/2 -translate-1/2 bg-current"></div>
	<div
		class="absolute -bottom-1/6 left-1/2 size-1/2 -translate-x-1/2 scale-y-25 rounded-full bg-current"
	></div>
	<div
		class="absolute top-1/4 left-1/2 size-1/2 -translate-1/2 rounded-full bg-current shadow-lg"
	></div>
</div>
