import { query, getRequestEvent, command } from '$app/server';
import { getById, put } from '$backend/routes/room';
import { post } from '$backend/routes/game';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';

export const getRoom = query(v.string(), async (roomId) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username) error(403, 'Not logged in');
	if (!roomId) error(400, 'ID undefined');
	const result = await getById(roomId, locals.user.id);
	if (result.isErr()) {
		if (result.error === 'NOT_IN_ROOM') {
			return 'NOT_IN_ROOM';
		}
		error(500, { message: result.error });
	}
	return result.value;
});

export const joinRoom = command(v.string(), async (roomId) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username) error(403, 'Not logged in');
	if (!roomId) error(400, 'ID undefined');
	const result = await put(roomId, { id: locals.user.id, userName: locals.user.username });
	void getRoom(roomId).refresh();
	return result;
});

export const startGame = command(v.string(), async (roomId) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username) error(403, 'Not logged in');
	if (!roomId) error(400, 'ID undefined');
	return post({ id: locals.user.id, userName: locals.user.username }, roomId);
});
