<script lang="ts">
	import { authClient } from '$lib/auth.client.ts';
	import Button from './button.svelte';
	import IconDiscord from '~icons/ic/baseline-discord';

	let username = $state('');
	let password = $state('');
	let formError = $state<{
		code?: string | undefined | undefined;
		message?: string | undefined | undefined;
		status: number;
		statusText: string;
	} | null>();

	function onchange() {
		formError = null;
	}

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

<form class="mx-4 flex flex-col rounded-md border border-gray-200 bg-gray-50 p-4">
	<label>
		<h2 class="mt-1 text-sm">Username</h2>
		<input
			class="w-full rounded-md border border-gray-400 px-2 py-1"
			{onchange}
			bind:value={username}
		/>
	</label>

	<label>
		<h2 class="mt-1 text-sm">Password</h2>
		<input
			class="w-full rounded-md border border-gray-400 px-2 py-1"
			{onchange}
			bind:value={password}
			type="password"
		/>
	</label>

	<p class="text-red-500">
		{formError?.message}&nbsp;
	</p>

	<div class="flex w-full items-end gap-2">
		<Button class="w-full" onclick={register}>Register</Button>
		<Button class="w-full" onclick={login} theme="primary">Login</Button>
	</div>

	<div class="flex items-center gap-3 py-2">
		<span class="h-px grow bg-gray-400"></span>
		<span class="text-sm text-gray-500">or</span>
		<span class="h-px grow bg-gray-400"></span>
	</div>

	<Button
		onclick={async () => {
			await authClient.signIn.social({
				provider: 'discord',
			});
		}}
	>
		<IconDiscord class="size-5" />
		Continue with Discord
	</Button>
</form>
