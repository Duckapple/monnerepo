<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	type Props = {
		children: Snippet;
		type?: 'button' | 'submit' | 'reset';
		size?: 'sm' | 'md' | 'lg';
		onclick?: () => void;
		class?: ClassValue;
		theme?: 'primary' | 'secondary';
		align?: 'start' | 'center' | 'end';
		disabled?: boolean;
	};
	let {
		children,
		onclick,
		type = 'button',
		size = 'md',
		class: cls,
		theme = 'secondary',
		align = 'center',
		disabled = false,
	}: Props = $props();

	const sizeClass = $derived(
		{
			sm: 'py-1 px-2 text-sm rounded-md border-b-4 active:mt-0.75 gap-1',
			md: 'py-1.5 px-3 rounded-lg border-b-4 active:mt-0.75 gap-2',
			lg: 'py-3 px-6 text-lg rounded-xl border-b-8 active:mt-1.75 gap-3',
		}[size]
	);

	const themeClass = $derived(
		{
			primary: 'border-lime-700 bg-lime-600 text-white hover:bg-lime-500 active:bg-lime-700',
			secondary: 'border-gray-300 bg-gray-200 hover:bg-gray-100',
		}[theme]
	);

	const alignClass = $derived(
		{
			start: 'justify-start',
			center: 'justify-center',
			end: 'justify-end',
		}[align]
	);
</script>

<button
	class={[
		'inline-flex items-center border active:border-b',
		sizeClass,
		cls,
		themeClass,
		alignClass,
	]}
	{type}
	{onclick}
	{disabled}
>
	{@render children()}
</button>
