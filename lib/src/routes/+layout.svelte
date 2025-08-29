<script lang="ts">
	import '../app.css';
	import * as UI from '$ui';

	let { children } = $props();
</script>

<div class="flex items-start bg-lime-50 pl-96 select-none">
	<div
		class="fixed inset-y-0 left-0 w-96 border-r border-r-lime-400 bg-lime-100 px-8 py-6 select-none"
	>
		<span class="text-2xl">Simon Green Common UI</span>
		<details open>
			<summary class="text-xl">Components</summary>

			<ul class="pl-6">
				{#each Object.keys(UI) as component}
					<li>
						<UI.Link href="/components/{component}">
							{'<'}{component}{' />'}
						</UI.Link>
					</li>
				{/each}
			</ul>
		</details>
	</div>
	{@render children()}
</div>
