<script lang="ts">
	import Spinner from '$lib/Spinner.svelte';

	interface BaseProps {
		loading?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	type Props = BaseProps &
		(
			| {
					onClick: (evt: MouseEvent) => void;
					href?: undefined;
			  }
			| {
					onClick?: never;
					href: string;
			  }
		);

	const {
		loading = false,
		onClick: onclick,
		href,
		class: className = '',
		children,
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={href ? 'a' : 'button'}
	class="rounded-sm border border-slate-300 p-1 shadow-xs transition-all hover:scale-105 hover:text-slate-600 disabled:grayscale-0 md:px-2 {className}"
	{onclick}
	{href}
>
	{#if loading}
		<Spinner />
	{/if}
	{@render children?.()}
</svelte:element>
