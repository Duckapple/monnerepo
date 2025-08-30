import { useSharedStore } from '@sgk/lib/hooks';

const key = Symbol();

class MoveStore {
	initial = $state({ x: 0, y: 0 });
}

export function initMoveStore() {
	useSharedStore(key, MoveStore);
}

export function useMove() {
	const store = initMoveStore();
}
