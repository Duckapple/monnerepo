<script lang="ts">
	import { browser } from '$app/environment';
	import { authClient } from '$lib/auth.client.ts';
	import Button from '$lib/components/button.svelte';
	import { PROVIDER_DETAILS } from '$lib/types/providers.ts';

	interface Props {
		manualLogOut: boolean;
		user: NonNullable<App.Locals['user']>;
	}

	let { manualLogOut = $bindable(), user }: Props = $props();

	const listAccounts = () => authClient.listAccounts({ fetchOptions: { throw: true } });
	let accounts = $state(browser ? listAccounts() : null);

	let temporaryPassword = $state('');
	let memeApiOpen = $state(false);
	let memeApiError = $state<string | null>(null);

	async function linkMemeApi() {
		const { error } = await authClient.memeApi.link({ temporaryPassword });
		memeApiError = error?.message ?? null;
		if (error) return;
		temporaryPassword = '';
		memeApiOpen = false;
		accounts = listAccounts();
	}
</script>

<div class="mx-4 flex flex-col gap-4 rounded-md border border-gray-200 bg-gray-50 p-4">
	<p>
		Oh, right, <span class="font-medium">{user.username}</span>. Welcome back!
	</p>

	<p class="font-medium">Login methods</p>

	<ul class="list-disc pl-4">
		{#each Object.keys(PROVIDER_DETAILS) as providerId (providerId)}
			{@const details = PROVIDER_DETAILS[providerId]}
			{#if !details?.hidden}
				{#if details}
					{@const Icon = details.icon}
					<li class="flex justify-between">
						<span class="flex items-center gap-2">
							<svelte:boundary>
								{@const id = (await accounts)?.find((acct) => acct.providerId === providerId)?.id}
								<Icon class={['size-5 flex-none', id ? 'text-green-700' : '']} />
								{#snippet pending()}
									<Icon class="size-5 flex-none" />
								{/snippet}
							</svelte:boundary>
							{details.label}
						</span>
						<svelte:boundary>
							{@const id = (await accounts)?.find((acct) => acct.providerId === providerId)?.id}
							<Button
								onclick={async () => {
									if (id) {
										await authClient.unlinkAccount({ providerId, accountId: id });
										accounts = listAccounts();
									} else if (providerId === 'meme-api') {
										memeApiOpen = !memeApiOpen;
									} else {
										await authClient.signIn.social({ provider: providerId });
									}
								}}>{id ? 'Remove' : 'Connect'}</Button
							>

							{#snippet pending()}
								<Button disabled>Connect</Button>
							{/snippet}
						</svelte:boundary>
					</li>
					{#if providerId === 'meme-api' && memeApiOpen}
						<li class="mt-1 list-none">
							<p class="text-sm text-gray-500">
								Ask the Meme API Discord bot to link this site, then paste its code below. Codes
								expire after a minute.
							</p>
							<div class="mt-1 flex gap-2">
								<input
									class="w-full rounded-md border border-gray-400 px-2 py-1"
									bind:value={temporaryPassword}
									oninput={() => (memeApiError = null)}
									placeholder="Code from Discord"
								/>
								<Button onclick={linkMemeApi} theme="primary">Link</Button>
							</div>
							{#if memeApiError}
								<p class="text-red-500">{memeApiError}</p>
							{/if}
						</li>
					{/if}
				{/if}
			{/if}
		{/each}
	</ul>

	<Button
		onclick={async () => {
			await authClient.signOut();
			manualLogOut = true;
		}}
	>
		Sign Out
	</Button>
</div>
