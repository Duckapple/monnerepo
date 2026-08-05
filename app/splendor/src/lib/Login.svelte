<script lang="ts">
	import { loginRegister } from '$lib/main';
	import Spinner from '$lib/Spinner.svelte';

	interface Props {
		onSuccess: () => void;
	}

	let { onSuccess }: Props = $props();

	let userName = $state('');

	let password = $state('');

	let register = $state(false);

	const pw = 'password';
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		// $loginMutation.mutate();
	}}
	class="flex flex-col"
>
	<label for="userName">User name</label>
	<input
		class="rounded-sm border border-slate-500 p-1"
		type="text"
		name="userName"
		id="userName"
		bind:value={userName}
		autocomplete="username"
	/>
	<label for="password">Password</label>
	<input
		class="rounded-sm border border-slate-500 p-1"
		type="password"
		name={pw}
		id={pw}
		bind:value={password}
		autocomplete="current-password"
	/>
	<!-- {#if $loginMutation.error}
		<span class="text-red-700">{$loginMutation.error?.message}</span>
	{/if} -->
	<div class="flex gap-2">
		<button
			class="mt-2 grow rounded-sm border border-slate-500 p-1"
			onclick={() => (register = true)}
			type="submit"
		>
			<!-- {#if $loginMutation.isPending && register}
				<Spinner />
			{/if} -->
			Register
		</button>
		<button
			class="mt-2 grow rounded-sm border border-slate-500 p-1"
			onclick={() => (register = false)}
			type="submit"
		>
			<!-- {#if $loginMutation.isPending && !register}
				<Spinner />
			{/if} -->
			Log in
		</button>
	</div>
</form>
