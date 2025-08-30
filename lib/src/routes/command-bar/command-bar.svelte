<script module lang="ts">
	export interface Command {
		getOptions: (input: string) => MenuItem[];
		prefix?: string;
		initialOptions?: MenuItem[];
		handle: (
			item: MenuItem
		) => MaybePromise<{ keepOpen?: boolean; newTextValue?: string } | undefined>;
	}
</script>

<script lang="ts">
	// import Dialog from '$libs/components/dialog/dialog.svelte';
	// import Dropdown from '$libs/components/dropdown/dropdown.svelte';
	// import Input from '$libs/components/input/input.svelte';
	// import type { MenuItem } from '$libs/components/menu/menu-item';
	import type { MaybePromise } from '$lib/utils/_.ts';
	// import { useKeyShortcut } from '$libs/utils/use-key-shortcut';
	// import { tick } from 'svelte';

	function useKeyShortcut() {}

	interface Props {
		open?: boolean;
		textValue?: string;
		commands: Command[];
	}
	let { open = $bindable(false), textValue = $bindable('') }: Props = $props();

	let input = $state<HTMLInputElement>();

	useKeyShortcut(['ctrl+`', 'command+`'], (e) => {
		e.preventDefault();
		open = !open;
	});

	// const menu = $derived.by(() => {
	// 	const menu: MenuItem[] = [];

	// 	const prefixed = commands.filter(({ prefix }) => prefix && textValue.startsWith(prefix));

	// 	for (const command of prefixed) {
	// 		menu.push(...command.getOptions(textValue));
	// 	}

	// 	if (!prefixed.length) {
	// 		for (const command of commands) {
	// 			if (!command.initialOptions?.length) continue;
	// 			menu.push(...command.initialOptions);
	// 		}
	// 	}

	// 	return menu;
	// });

	// async function onmenuclick(item: MenuItem) {
	// 	for (const command of commands) {
	// 		if (command.prefix && !item.id?.startsWith(command.prefix)) continue;
	// 		const result = await command.handle(item);
	// 		if (result) {
	// 			if (result.newTextValue) {
	// 				textValue = result.newTextValue;
	// 				await tick();
	// 				input?.focus();
	// 			}
	// 			if (!result.keepOpen) open = false;
	// 			return;
	// 		}
	// 	}
	// 	if (item.id?.startsWith('go-')) {
	// 		switch (item.id) {
	// 			case 'go-breadcrumb':
	// 				textValue = 'go ';
	// 				await tick();
	// 				input?.focus();
	// 				break;
	// 			case 'go-search':
	// 				// goto('/s/');
	// 				break;
	// 		}
	// 	}
	// }
</script>

<div class="flex h-screen w-full items-center justify-center">
	<div
		class="relative rounded-xl border border-lime-600 outline-offset-2 has-focus-visible:outline"
	>
		<input class="p-3 outline-none" bind:value={textValue} bind:this={input} />
		<div id="overlay" class="pointer-events-none absolute inset-0 p-3">
			{#if textValue.startsWith('http')}
				<span
					class="pointer-events-auto -m-1 rounded-sm bg-lime-800 px-0.5 text-white hover:bg-lime-700"
				>
					http
				</span>
			{/if}
		</div>
	</div>
</div>

<!-- <Dialog bind:open noCross>
	<Dropdown {menu} show={!!menu.length} portal matchWidth {onmenuclick} preventCloseOnDone>
		<Input
			name="command-bar"
			noMarginBottom
			autofocus
			size="md"
			class="w-full"
			bind:value={textValue}
			bind:ref={input}
		/>
	</Dropdown>
</Dialog> -->
