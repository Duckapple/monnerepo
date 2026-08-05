<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { iconSvgs } from './icons';

	interface Props {
		icon: keyof typeof iconSvgs;
		class?: ClassValue;
	}
	const { icon, class: className = 'size-5' }: Props = $props();
</script>

<svg
	viewBox={iconSvgs[icon].viewBox}
	class={[
		'inline-block shrink-0 bg-transparent! stroke-current [stroke-linecap:round] [stroke-linejoin:round]',
		className,
		className.includes('fill-') ? '' : 'fill-transparent',
	]}
>
	{@html iconSvgs[icon].children}
</svg>
