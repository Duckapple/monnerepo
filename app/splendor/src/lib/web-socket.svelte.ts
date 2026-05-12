import { getContext, hasContext, setContext } from 'svelte';
import { treaty } from '@elysiajs/eden';
import type { WSApp } from '$backend/wss';
import { SPLENDOR_WS_PORT, SPLENDOR_WS_ORIGIN } from '$env/static/public';
import { browser } from '$app/environment';

const WS_URL = import.meta.env.DEV ? `localhost:${SPLENDOR_WS_PORT}` : SPLENDOR_WS_ORIGIN;

const client = treaty<WSApp>(WS_URL);

export function getWebSocket() {
	if (!browser) return;
	if (hasContext('websocket')) {
		return getContext<ReturnType<typeof client.ws.subscribe>>('websocket');
	}
	const ws = client.ws.subscribe();

	ws.on('close', () => console.error('closed'));

	return setContext('websocket', ws);
}
