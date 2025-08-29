<script lang="ts">
	import CommandBar from './command-bar.svelte';
</script>

<CommandBar
	commands={[
		{
			getOptions() {
				return [
					{
						title: 'Go to Search Page',
						id: 'go-search'
					}
				];
			},
			prefix: 'go',
			initialOptions: [{ title: 'Go to...', id: 'go-breadcrumb' }],
			async handle(item) {
				switch (item.id) {
					case 'go-breadcrumb':
						return { keepOpen: true, newTextValue: 'go ' };
					case 'go-search':
						// goto('/s/');
						return {};
				}
			}
		}
		// eqCommand
	]}
/>
