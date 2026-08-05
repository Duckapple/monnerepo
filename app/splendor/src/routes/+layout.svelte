<script lang="ts">
	import '../app.css';
	import '$lib/main';

	import { browser } from '$app/environment';

	import { useRuneContext } from '$lib/state/context-rune.svelte';
	import { useLocalStoreRune } from '$lib/state/local-store-rune.svelte';
	import { TOKEN } from '$lib/main';
	import { getWebSocket } from '$lib/web-socket.svelte';

	const { children } = $props();

	const colorblind = useRuneContext(
		'colorblind',
		browser && localStorage.getItem('colorblind') === 'true'
	);
	$effect(() => {
		if (browser) {
			localStorage.setItem('colorblind', colorblind.value.toString());
		}
	});

	const ws = getWebSocket();
	const jwt = useLocalStoreRune<string>(TOKEN);

	$effect(() => {
		const token = jwt.value;
		if (token && ws) {
			setTimeout(() => ws.send({ type: 'register', token }), 200);
		}
	});
</script>

<main class="mx-auto box-border flex min-h-screen w-full flex-1 flex-col">
	{@render children?.()}
</main>
