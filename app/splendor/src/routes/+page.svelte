<script lang="ts">
	import { getClient, isLoggedIn, logout, user } from '$lib/main';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { timeAgo } from '$lib/timeAgo';
	import Spinner from '$lib/Spinner.svelte';
	import Background from '$lib/compose/Background.svelte';
	import Login from '$lib/Login.svelte';
	import Button from '$lib/base/Button.svelte';
	import { roomsQuery } from './_queries';
	import type { LobbyValue, GameValue } from '$backend/routes/room';

	const rooms = createQuery(roomsQuery(fetch));

	const createRoom = createMutation({
		mutationKey: ['rooms'],
		mutationFn: async () => {
			const data = await getClient(fetch).api.room.index.post();
			if (!data.data?.code) throw { message: 'Failed to create room' };

			window.location.href = `/new?id=${data.data.code}`;
		},
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Background />

{#snippet card(details: GameValue | LobbyValue, status?: 'started' | 'ended')}
	{@const title =
		'game' in details && details.game.updatedAt
			? `Updated ${timeAgo(details.game.updatedAt)} (${details.game.updatedAt.toString()})`
			: undefined}
	{@const createdAt = 'game' in details ? details.game.createdAt : details.lobby.createdAt}
	<a
		class="relative block rounded-sm border border-slate-300 p-2 text-slate-600 shadow-sm transition-transform hover:scale-105 hover:no-underline"
		href={`/${status ? 'game' : 'new'}?id=${'game' in details ? details.game.id : details.lobby.code}`}
	>
		{#if status}
			<span class="absolute right-2 bottom-2 text-sm"
				>{status === 'ended' ? 'game over' : 'in progress'}</span
			>
		{/if}
		<p {title}>
			Created by
			<span class="text-slate-900">
				{details.players.find((p) =>
					'owner' in p ? p.owner : 'ownerId' in details && details.ownerId === p.userId
				)?.userName}
			</span>
			{timeAgo(createdAt)}
		</p>
		Players:
		<ul class="list-disc pl-6">
			{#each details.players as player}
				<li>{player.userName}</li>
			{/each}
		</ul>
	</a>
{/snippet}

<section class="z-50 flex flex-[0.6] flex-col items-center justify-center">
	<div class="m-2 rounded-md bg-slate-50 p-4 shadow-md md:px-10 md:py-8">
		<h1 class="pb-6 text-7xl md:text-8xl">Splendor</h1>
		{#if $isLoggedIn && $rooms.isLoading}
			<div class="flex justify-center p-8">
				<Spinner />
			</div>
		{/if}
		{#if $isLoggedIn && $rooms.isSuccess}
			<div class="flex grid-cols-2 flex-col gap-4 pb-2 md:grid lg:grid-cols-3">
				{#each $rooms.data?.data?.lobby ?? [] as lobby}
					{@render card(lobby)}
				{:else}
					<p class="py-8 text-center">No rooms found</p>
				{/each}
				{#each $rooms.data?.data?.game ?? [] as room}
					{@render card(room, room.game.phase === 2 ? 'ended' : 'started')}
				{:else}
					<p class="py-8 text-center">No rooms found</p>
				{/each}
			</div>
		{:else if $rooms.isError && $rooms.error.message !== 'Unauthorized'}
			<span class="text-red-700">{$rooms.error.message}</span>
		{/if}
		{#if !$isLoggedIn}
			<Login onSuccess={() => void $rooms.refetch()} />
		{:else}
			<div class="mt-2 flex justify-stretch gap-4">
				<Button onClick={() => $createRoom.mutate()} loading={$createRoom.isPending}>
					Create new room
				</Button>
				<Button onClick={() => logout()}>Log out of {$user?.userName}</Button>
			</div>
		{/if}
	</div>
</section>
