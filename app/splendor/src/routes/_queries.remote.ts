import { command, getRequestEvent, query } from '$app/server';
import { getAll, post } from '$backend/routes/room';
import { error } from '@sveltejs/kit';

export const getRooms = query(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username) error(403, 'Not logged in');
	return getAll(locals.user.id);
});

export const createRoom = command(async () => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username) error(403, 'Not logged in');
	return post({ id: locals.user.id, userName: locals.user.username });
});
