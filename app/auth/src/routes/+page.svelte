<script lang="ts">
	import { authClient } from '$lib/auth.client.ts';
	import Login from '$lib/components/login.svelte';
	import Dashboard from './dashboard.svelte';

	const { data } = $props();
	const session = authClient.useSession();

	let manualLogOut = $state(false);
	const user = $derived($session.data?.user ?? (manualLogOut ? undefined : data.user));
</script>

<div>
	<p class="text-center text-sm">Welcome to</p>
	<h1 class="text-center text-xl font-medium">Simon Green Inc. Enterprise™©®</h1>
	{#if user}
		<Dashboard bind:manualLogOut {user} />
	{:else}
		<Login />
	{/if}
</div>
