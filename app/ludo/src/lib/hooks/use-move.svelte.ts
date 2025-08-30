import { useSharedStore } from '@sgk/lib/hooks';
import { on } from 'svelte/events';

const key = Symbol();

class MoveStore {
	initial = $state({ x: 0, y: 0 });
	item = $state<{ x: number; y: number } | null>(null);

	#moveItem(e: MouseEvent | TouchEvent) {
		if (!this.item) return;

		e.preventDefault();

		if (isTouch(e)) {
			this.item.x = (e.touches[0]?.clientX ?? 0) - this.initial.x;
			this.item.y = (e.touches[0]?.clientY ?? 0) - this.initial.y;
		} else {
			this.item.x = e.clientX - this.initial.x;
			this.item.y = e.clientY - this.initial.y;
		}
	}

	#end() {
		this.item = null;
	}

	constructor() {
		if (typeof window === 'undefined') return;

		on(window, 'mousemove', this.#moveItem.bind(this));
		on(window, 'mouseup', this.#end.bind(this));
		on(window, 'touchmove', this.#moveItem.bind(this));
		on(window, 'touchend', this.#end.bind(this));
	}
}

export function initMoveStore() {
	return useSharedStore(key, MoveStore);
}

function isTouch(e: MouseEvent | TouchEvent): e is TouchEvent {
	return e.type === 'touchstart' || e.type === 'touchmove' || e.type === 'touchend';
}

export function useMove() {
	const store = initMoveStore();

	const itemState = $state({ x: 0, y: 0 });

	function start(e: MouseEvent | TouchEvent) {
		store.item = itemState;
		if (isTouch(e)) {
			store.initial.x = (e.touches[0]?.clientX ?? 0) - store.item.x;
			store.initial.y = (e.touches[0]?.clientY ?? 0) - store.item.y;
		} else {
			store.initial.x = e.clientX - store.item.x;
			store.initial.y = e.clientY - store.item.y;
		}
	}

	return {
		onmousedown: start,
		ontouchstart: start,
		get style() {
			return `transform: translate3d(${itemState.x}px, ${itemState.y}px, 0);`;
		}
	};
}
