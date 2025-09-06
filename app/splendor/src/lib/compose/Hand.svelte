<script lang="ts">
	import { Color, GamePhase, type Card as CardType } from '$common/model';
	import Card from '$lib/game/Card.svelte';
	import Coin from '$lib/game/Coin.svelte';
	import { user } from '$lib/main';
	import { cardFromId } from '$common/defaults';
	import type { SplendorGamePlayer } from '$lib/db/schema';
	import Person from '$lib/game/Person.svelte';

	interface Props {
		player: SplendorGamePlayer & { userName: string };
		turn: number | undefined;
		buyReserved: (e: MouseEvent | KeyboardEvent) => void;
		targetCardId: number;
		phase: GamePhase | undefined;
	}

	let { player, turn, buyReserved, targetCardId, phase }: Props = $props();

	let isUser = $derived($user?.id === player.userId);

	let currentPlayer = $derived(isUser ? " - It's your turn!" : ' - Current player');
	let handleBuyReserved = $derived(isUser ? buyReserved : () => {});

	let sorted = $derived(
		(() => {
			const sorted: CardType[][] = [[], [], [], [], [], []];
			for (const cardId of player.cards) {
				const card = cardFromId(cardId);
				sorted[card.c].push(card);
			}
			return sorted;
		})()
	);
	let shownCards = $derived(sorted.slice(0, 5));
	let persons = $derived(sorted[Color.Y]);

	let points = $derived(
		sorted.reduce((acc, cards) => acc + cards.reduce((acc, card) => acc + card.p, 0), 0)
	);
</script>

<div class="min-w-96 space-y-1 rounded-sm border border-slate-200 p-2">
	<h1 title="User ID: {player.userId}">
		'<span class:underline={isUser}>{player.userName}</span>'{turn === player.position &&
		phase !== GamePhase.FINISHED
			? currentPlayer
			: ''}
		<span class="text-sm text-nowrap">({points} points)</span>
		{#if phase === GamePhase.ENDING && turn === player.position}
			<span class="text-sm text-nowrap text-red-700 uppercase">final turn</span>
		{/if}
	</h1>
	{#if persons.length}
		<h2 class="text-sm">Nobles</h2>
		<div class="flex gap-2">
			{#each persons as person}
				<Person card={person} small />
			{/each}
		</div>
	{/if}
	<h2 class="text-sm">Cards</h2>
	{#if player.cards.length === 0}
		<div
			class="flex min-h-24 items-center justify-center rounded-md border-2 border-dashed border-slate-400 text-slate-500"
		>
			No cards
		</div>
	{/if}
	<div class="flex gap-2">
		{#each shownCards as cardStack}
			{#if cardStack.length > 0}
				<div class="flex flex-col">
					{#each cardStack as card}
						<Card {card} hideCost stacked small />
					{/each}
				</div>
			{/if}
		{/each}
	</div>
	<h2 class="text-sm">Coins</h2>
	<div class="flex min-h-12 gap-2">
		{#each player.tokens as stackSize, color}
			<Coin small {stackSize} {color} />
		{/each}
	</div>
	<h2 class="text-sm">Reserved</h2>
	{#if player.reserved.length === 0}
		<div
			class="flex min-h-14 items-center justify-center rounded-md border-2 border-dashed border-slate-400 text-slate-500"
		>
			No reserved cards
		</div>
	{/if}
	<div class="relative" class:min-h-14={player.reserved.length !== 0}>
		<div class="-mt-4 flex space-x-10 pl-4">
			{#each player.reserved as cardId}
				<Card
					card={cardFromId(cardId)}
					small={cardId !== targetCardId}
					rotated
					onclick={(e) => handleBuyReserved(e)}
					onkeypress={(e) => handleBuyReserved(e)}
				/>
			{/each}
		</div>
	</div>
</div>
