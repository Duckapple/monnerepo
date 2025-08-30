<script lang="ts">
	import { Button } from '$lib/ui/_.ts';
	import Positioning from './positioning.svelte';
</script>

<div class="flex flex-col items-center gap-2 p-8">
	<h1 class="text-6xl">Hello world!</h1>

	<Button>Click me</Button>

	<Positioning />
</div>
