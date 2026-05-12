import { initMoveStore } from './use-move.svelte.ts';
import { getWsStore } from './ws.svelte.ts';

export function initStores() {
	initMoveStore();
	getWsStore();
}
