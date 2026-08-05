<script lang="ts">
	import { timeAgo } from '$lib/timeAgo';
	import { isLoggedIn, jwt, user } from '$lib/main';
	import Background from '$lib/compose/Background.svelte';
	import { cardFromId } from '$common/defaults';
	import Login from '$lib/Login.svelte';
	import Button from '$lib/base/Button.svelte';
	import { getWebSocket } from '$lib/web-socket.svelte';
	import { getRoom, joinRoom, startGame } from '../_queries.remote';
	import { goto } from '$app/navigation';

	const { data } = $props();

	const ws = getWebSocket();
	let subbed = $state(false);
	$effect(() => {
		if ($jwt && ws && !subbed) {
			ws?.subscribe(({ data }) => {
				switch (data.type) {
					case 'game-started':
						goto(`/game/${data.id}`);
						break;
				}
			});
			subbed = true;
		}
	});

	const room = getRoom(data.id);

	$effect(() => {
		if (typeof room.current === 'object' && room.current?.game) {
			window.location.href = `/game/${data.id}`;
		}
	});
</script>

<svelte:head>
	<title>New Splendor room</title>
	<meta name="description" content="You have been invited to a new room. Click to join the fun!" />
	<meta name="og:image" content="/new-game.webp" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Background card={cardFromId(143)} />

<div class="z-30 flex h-screen w-full flex-col items-center justify-center">
	<div class="m-2 flex flex-col rounded-md bg-slate-50 p-2 shadow-sm md:p-4">
		{#if !$isLoggedIn}
			<Login onSuccess={() => {}} />
		{/if}
		{#if room.error}
			{@const err = room.error}
			<span class="text-red-700">{err?.message}</span>
		{:else if room.current === 'NOT_IN_ROOM'}
			<span class="mb-2 text-2xl">You are not in this room!</span>
			<Button loading={!!joinRoom.pending} onClick={() => joinRoom(data.id!)}>Join the room</Button>
			<Button href="/" class="mt-2">Go back</Button>
		{:else if room.current?.lobby != null}
			{@const { players, lobby } = room.current.lobby}
			{@const ownerName = players.find(({ owner }) => owner)?.userName}
			<div class="max-w-md p-2">
				<h1 class="pr-20 pb-4 text-5xl">New game</h1>
				<p class="text-right text-sm">
					Opened {timeAgo(lobby.createdAt)}
					<br />
					by {ownerName}
				</p>
				Players:
				<ul class="list-disc pl-6">
					{#each players as player (player.userId)}
						<li>
							{player.userName}
							{#if player.owner}👑{/if}
						</li>
					{/each}
				</ul>
				{#if players.some(({ owner, userId }) => userId === $user?.id && owner)}
					<Button
						onClick={() => startGame(data.id).then((value) => goto(`/game/${value.id}`))}
						loading={!!startGame.pending}
						class="mt-2 bg-green-100"
					>
						Start the game
					</Button>
				{/if}
				<Button href="/" class="mt-2">Go back</Button>
			</div>
		{:else if room.current}
			Game doesn't exist
			<Button href="/" class="mt-2">Go back</Button>
		{/if}
	</div>
</div>
