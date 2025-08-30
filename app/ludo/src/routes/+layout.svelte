<script lang="ts">
	import { initStores } from '$lib/hooks/_init.ts';
	import '../app.css';

	let { children } = $props();

	initStores();
</script>

{@render children?.()}
