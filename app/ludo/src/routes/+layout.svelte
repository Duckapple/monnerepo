<script lang="ts">
	import { initStores } from '$lib/hooks/_init.ts';
	import '../app.css';

	let { children } = $props();

	initStores();
</script>

<div class="p-8">
	<div class="relative">
		{@render children?.()}
	</div>
</div>
