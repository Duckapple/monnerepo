<script lang="ts">
	import { userNames } from '$lib/main';
	import Coin from '$lib/game/Coin.svelte';
	import Card from '$lib/game/Card.svelte';
	import { cardFromId } from '$common/defaults';
	import { moveTo } from '$lib/move';
	import { getActions } from './_queries.remote';

	interface Props {
		gameId: string;
	}

	const { gameId }: Props = $props();
	let target: HTMLElement | undefined = $state();
	function setCurrent(newVal: HTMLElement | undefined) {
		if (target) {
			target.setAttribute('style', '');
		}
		target = newVal;
	}

	const actions = getActions(gameId);

	const orderedActions = $derived((actions.current ?? []).toReversed());

	const cardClick = $derived((card: EventTarget | null) => {
		if (!(card instanceof HTMLElement)) return;
		if (target === card) {
			setCurrent(undefined);
			return;
		}
		setCurrent(card);
		moveTo(card, card);
	});
</script>

<div class="absolute top-0 left-0 z-10 flex items-center justify-center">
	<div
		class="grid max-h-[calc(100svh-5rem)] min-w-72 grid-cols-3 divide-y overflow-y-auto bg-white p-2 text-sm"
	>
		{#if actions.error}
			{JSON.stringify(actions.error)}
		{/if}
		{#each orderedActions as action, i (i)}
			<div class="col-span-3 grid min-h-16 grid-cols-subgrid items-center gap-x-2">
				{#if action.type === 'TAKE_TOKENS'}
					<span>{$userNames[action.userId]}</span>
					<span class="justify-self-end">took</span>
					<div class="flex scale-50 gap-2 justify-self-center">
						{#each action.data.tokens as color, i (i)}
							<Coin {color} small hideNumber />
						{/each}
					</div>
					{#if action.data.returned}
						<span>returning</span>
						<span></span>
						<div class="flex scale-50 gap-2 justify-self-center">
							{#each action.data.returned as color, i (i)}
								<Coin {color} small hideNumber />
							{/each}
						</div>
					{/if}
				{:else if action.type === 'BUY_CARD'}
					<span>{$userNames[action.userId]}</span>
					<span class="justify-self-end">bought</span>
					<div class="scale-75 justify-self-center">
						<Card
							card={cardFromId(action.data.card)}
							small
							onclick={(e) => cardClick(e.currentTarget)}
						/>
					</div>
				{:else}
					<span>{$userNames[action.userId]}</span>
					<span class="justify-self-end">reserved</span>
					<div class="scale-75 justify-self-center">
						<Card
							card={cardFromId(action.data.card)}
							rotated
							small
							onclick={(e) => cardClick(e.currentTarget)}
						/>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
