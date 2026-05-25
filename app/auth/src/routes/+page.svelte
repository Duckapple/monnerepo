<script lang="ts">
	import { authClient } from '$lib/auth.client.ts';

	const { data } = $props();
	const session = authClient.useSession();

	let manualLogOut = $state(false);
	const user = $derived($session.data?.user ?? (manualLogOut ? undefined : data.user));

	let username = $state('');
	let password = $state('');
	let formError = $state<{
		code?: string | undefined | undefined;
		message?: string | undefined | undefined;
		status: number;
		statusText: string;
	} | null>();

	async function login() {
		const { error } = await authClient.signIn.username({ username, password });
		if (error) {
			formError = error;
		}
	}
	async function register() {
		const { error } = await authClient.signUp.email({
			username,
			password,
			email: `${username}@auth.simon-green.dev`,
			name: username,
		});
		if (error) {
			formError = error;
		}
	}
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
					manualLogOut = true;
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
		<form class="rounded-md border border-black p-4">
			<label>
				<h2>Username</h2>
				<input class="rounded-sm border border-gray-400" bind:value={username} />
			</label>

			<label>
				<h2>Password</h2>
				<input class="rounded-sm border border-gray-400" type="password" bind:value={password} />
			</label>

			<div>
				<button class="rounded-sm bg-blue-100 px-2 py-1" type="button" onclick={register}>
					Register
				</button>
				<button class="rounded-sm bg-blue-100 px-2 py-1" type="button" onclick={login}>
					Login
				</button>
			</div>
		</form>
	{/if}
</div>
