<script lang="ts">
	import { authClient } from '$lib/auth.client.ts';
	const { data } = $props();
	const session = authClient.useSession();

	const user = $derived($session.data?.user ?? data.user);
</script>

<div>
	{#if user}
		<div>
			<p>
				{user.username}
			</p>
			<button
				onclick={async () => {
					await authClient.signOut();
				}}
			>
				Sign Out
			</button>
		</div>
	{:else}
		<button
			onclick={async () => {
				await authClient.signIn.social({
					provider: 'discord',
				});
			}}
		>
			Continue with Discord
		</button>
	{/if}
</div>
