import { browser } from '$app/environment';
import { LUDO_WS_PORT } from '$env/static/public';
import { useSharedStore } from '@sgk/lib/hooks';
import type { LudoInProtocol, LudoOutProtocol } from '../../hooks.server.ts';

type Protocol = Record<string, Record<string, unknown>>;

export class WS<InProto extends Protocol, OutProto extends Protocol> {
	#ws: WebSocket | null = null;

	#subscriptions: Partial<{ [K in keyof InProto]: Array<(data: InProto[K]) => void> }> = {};

	constructor() {
		if (!browser) {
			return { initialize() {}, on() {}, off() {}, send() {} } as unknown as WS<InProto, OutProto>;
		}
	}

	initialize() {
		this.#ws = new WebSocket(`http://localhost:${LUDO_WS_PORT}/ws`);
		this.#ws.onmessage = (msg) => {
			const data = JSON.parse(msg.data) as {
				type?: keyof InProto;
				payload: InProto[keyof InProto];
			};
			const subs = data.type && this.#subscriptions[data.type];
			if (subs) {
				subs.forEach((cb) => cb(data.payload));
			}
		};
	}

	on<K extends keyof InProto>(key: K, cb: (data: InProto[K]) => void) {
		if (!this.#subscriptions[key]) {
			this.#subscriptions[key] = [];
		}
		this.#subscriptions[key].push(cb);
	}
	off<K extends keyof InProto>(key: K, cb: (data: InProto[K]) => void) {
		if (!this.#subscriptions[key]) return;
		this.#subscriptions[key] = this.#subscriptions[key]!.filter((c) => c !== cb);
	}

	send(key: keyof OutProto, data: OutProto[keyof OutProto]) {
		if (this.#ws?.readyState !== WebSocket.OPEN) return;
		this.#ws.send(JSON.stringify({ type: key, payload: data }));
	}
}

const key = Symbol();

export function getWsStore() {
	return useSharedStore<WS<LudoOutProtocol, LudoInProtocol>>(key, WS);
}
