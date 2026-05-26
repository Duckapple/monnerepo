import * as v from 'valibot';
import { command, getRequestEvent, query } from '$app/server';
import { get as backendGetGame } from '$backend/routes/game';
import { error } from '@sveltejs/kit';
import { actionSchema } from '$common/schema/actions-valibot';
import { post, get as backendGetActions } from '$backend/routes/action';

export const getGame = query(v.string(), async (gameId) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username || !gameId) error(400, 'ID undefined');
	return backendGetGame({ id: locals.user.id, userName: locals.user.username }, gameId);
});

const performActionSchema = v.object({
	id: v.string(),
	body: actionSchema,
});
export const performAction = command(performActionSchema, async (data) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username || !data.id) error(400, 'ID undefined');
	const result = await post(
		{ id: locals.user.id, userName: locals.user.username },
		{ body: data.body, params: { id: data.id } }
	);
	void getGame(data.id).refresh();
	return result;
});

export const getActions = query(v.string(), async (gameId) => {
	const { locals } = getRequestEvent();
	if (!locals.user?.username || !gameId) error(400, 'ID undefined');
	return backendGetActions(
		{ id: locals.user.id, userName: locals.user.username },
		{ params: { id: gameId }, query: {} }
	);
});
