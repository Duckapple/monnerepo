import { LUDO_WS_PORT } from '$env/static/public';
import '$lib/db/db.server.ts';
import * as v from 'valibot';
import { serve } from 'bun';

interface Cursor {
	x: number;
	y: number;
	id: number;
}

const cursors: Cursor[] = [];

serve({
	port: Number(LUDO_WS_PORT),
	fetch() {
		return new Response('Not found', { status: 404 });
	},
	routes: {
		'/ws'(req, server) {
			const cursor = { x: 0, y: 0, id: cursors.length };
			if (server.upgrade(req, { data: cursor })) {
				return; // do not return a Response
			}
			return new Response('Upgrade failed', { status: 500 });
		},
	},
	websocket: {
		data: {} as Cursor,
		open(ws) {
			console.log('WebSocket opened');
			ws.subscribe('cursors');
			const id = cursors.push(ws.data);
			ws.data.id = id - 1;
			setTimeout(() => ws.send(JSON.stringify(cursors)), 1000);
		},
		message(ws, message) {
			const data = JSON.parse(message.toString()) as Cursor;
			const validated = v.parse(ludoInProtocol, data);
			if (!validated) {
				ws.send(JSON.stringify({ error: 'Invalid data' }));
				return;
			}
			ws.data.x = validated.payload.x;
			ws.data.y = validated.payload.y;
			ws.publish('cursors', JSON.stringify({ type: 'mouse', payload: ws.data }));
			ws.send(JSON.stringify({ type: 'mouse', payload: ws.data }));
		},
		close(ws) {
			console.log('WebSocket closed!');
		},
	},
}).unref();

export type LudoOutProtocol = {
	mouse: {
		x: number;
		y: number;
		id: number;
	};
};

const ludoInProtocol = v.union([
	v.object({
		type: v.literal('mousemove'),
		payload: v.object({
			x: v.number(),
			y: v.number(),
		}),
	}),
]);
type InRaw = v.InferOutput<typeof ludoInProtocol>;

type TranslateInProtocol<T extends { type: string; payload: unknown }> = {
	[K in T['type']]: Extract<T, { type: K }>['payload'];
};

export type LudoInProtocol = TranslateInProtocol<InRaw>;
