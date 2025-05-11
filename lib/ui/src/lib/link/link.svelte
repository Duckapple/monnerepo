<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props {
		children: Snippet;
		href: string;
		class?: string;
		target?: HTMLAnchorAttributes['target'];
	}
	let { children, href, target, class: c }: Props = $props();
</script>

<a {href} {target} class={['text-lime-800 underline hover:text-lime-700 active:text-lime-600', c]}
	>{@render children?.()}</a
>
