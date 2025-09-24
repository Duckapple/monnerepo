import { t } from 'elysia';
import type { AuthUser } from '$common/communication';
import type { Infer } from '../common/type';
import { RedirectError } from '../common/error';
import { db } from '../common/db';
import { getLobby } from '$backend/routes/room';
import { LobbyParticipant } from '@sgk/lib/db';

get.params = { query: t.Object({ id: t.String() }) };
export async function get(user: AuthUser, { query: { id } }: Infer<typeof get.params>) {
	const roomAndPlayers = await getLobby({ id });

	const lobby = roomAndPlayers[0]?.Lobby;
	const players = roomAndPlayers.map(({ participant }) => participant);

	if (!lobby) {
		throw new RedirectError(303, `/new?id=${id}`);
	}

	if (players.length < 4 && players.every((player) => player.userId !== user.id)) {
		const length = players.length as 0 | 1 | 2 | 3;

		await db.insert(LobbyParticipant).values({
			lobbyCode: id,
			userId: user.id,
			order: length,
		});
	}

	throw new RedirectError(303, `/new?id=${id}`);
}
