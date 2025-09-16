import { and, eq, ne, type SQL } from 'drizzle-orm';
import { SplendorGamePlayer, SplendorGame } from '../../lib/db/schema';
import { db } from '../common/db';
import { Auth } from '../common/auth';
import { randomInt } from 'crypto';
import { alias } from 'drizzle-orm/pg-core';
import { Elysia, t } from 'elysia';
import { Lobby, LobbyParticipant, User } from '@sgk/lib/db';
import { GamePhase } from '$common/model';
import { encodeBase58 } from '$common/utils';
import { err, ok } from 'neverthrow';

const playerAgain = alias(SplendorGamePlayer, 'player2');
const partAgain = alias(LobbyParticipant, 'part2');

export const room = new Elysia({ prefix: '/room' })
	.use(Auth)
	.guard({ auth: true })
	.get(
		'/',
		async ({ user, query: { showEnded } = {} }) => {
			const conditions = [eq(playerAgain.userId, user.id)];
			if (!showEnded) {
				conditions.push(ne(SplendorGame.phase, GamePhase.FINISHED));
			}
			const [game, lobby] = await Promise.all([
				getGame(conditions.length > 1 ? (and(...conditions) as SQL) : conditions[0], true),
				getLobbies(user.id),
			]);
			return {
				game,
				lobby,
			};
		},
		{ query: t.Optional(t.Object({ showEnded: t.Optional(t.Boolean()) })) }
	)
	.get('/:id', async ({ user, params: { id }, error }) => {
		if (id.length < 20) {
			const lobby = await oneLobby({ id, userId: user.id });

			if (lobby.isOk()) return { lobby: lobby.value, game: null };

			if (lobby.isErr() && lobby.error.message === 'Not in lobby')
				return error(404, { message: 'Not part of room', data: 'NOT_IN_ROOM' as const });

			return error(404, { message: 'Not Found' });
		}

		const [data] = await getGame(eq(SplendorGame.id, id) as SQL);

		if (data == null) return error(404, { message: 'Not Found' });

		if (data.players.every((player) => player.userId !== user.id)) {
			return error(404, { message: 'Not part of room', data: 'NOT_IN_ROOM' as const });
		}

		return { game: data, lobby: null };
	})
	.post('/', async ({ user }) => {
		const code = encodeBase58(randomInt(58 ** 6));
		const inserts = [
			db.insert(Lobby).values({ code, gameType: 'splendor' }),
			db.insert(LobbyParticipant).values({ lobbyCode: code, userId: user.id, owner: true }),
		];
		const players = [{ userId: user.id, position: 0, userName: user.userName }];
		await Promise.all(inserts);
		return { code, players };
	})
	.put('/:id', async ({ user, params: { id }, error }) => {
		const roomAndPlayers = await getGame(eq(SplendorGame.id, id));

		if (roomAndPlayers.length === 0) {
			return error(404, { message: 'Not Found' });
		}

		const [data] = roomAndPlayers;

		const players = data.players;

		let message = "You're already in the room!";

		if (players.length < 4 && players.every((player) => player.userId !== user.id)) {
			const length = players.length as 0 | 1 | 2 | 3;
			const newPlayer = {
				gameId: id,
				userId: user.id,
				position: length,
				cards: [],
			};
			await db.insert(SplendorGamePlayer).values(newPlayer);
			players.push({
				userId: user.id,
				position: length,
				userName: user.userName,
			});
			message = 'Joined the room!';
		}

		return { message, ...data };
	});

export async function getGame(where: ReturnType<typeof eq>, inRoom?: true) {
	const partial = db
		.select({
			game: SplendorGame,
			player: {
				userId: SplendorGamePlayer.userId,
				position: SplendorGamePlayer.position,
				userName: User.userName,
			},
		})
		.from(SplendorGame)
		.leftJoin(SplendorGamePlayer, eq(SplendorGamePlayer.gameId, SplendorGame.id))
		.leftJoin(User, eq(User.id, SplendorGamePlayer.userId));

	const roomAndPlayers = await (
		inRoom ? partial.leftJoin(playerAgain, eq(playerAgain.gameId, SplendorGame.id)) : partial
	).where(where);

	if (roomAndPlayers.length === 0) return [];

	const res = new Map<
		string,
		{ game: SplendorGame; players: (typeof roomAndPlayers)[number]['player'][] }
	>();

	for (const { game, player } of roomAndPlayers) {
		if (!res.has(game.id)) {
			res.set(game.id, { game, players: [] });
		}
		res.get(game.id)?.players.push(player);
	}

	return [...res.values()];
}
export type GameValue = Awaited<ReturnType<typeof getGame>>[number];

async function getLobbies(userId: string) {
	const x = await getLobby({ userId });
	const res = new Map<
		string,
		{ lobby: (typeof x)[number]['Lobby']; players: (typeof x)[number]['participant'][] }
	>();
	for (const { Lobby, participant } of x) {
		const item = res.get(Lobby.code) ?? { lobby: Lobby, players: [] };
		item.players.push(participant);
		res.set(Lobby.code, item);
	}
	return [...res.values()];
}

export type LobbyValue = Awaited<ReturnType<typeof getLobbies>>[number];

async function oneLobby({ userId, id }: { userId: string; id: string }) {
	const lobbies = await getLobby({ id });

	if (!lobbies.length) return err({ message: 'Not Found' as const });

	if (!lobbies.some((lobby) => lobby.participant?.userId === userId)) {
		return err({ message: 'Not in lobby' as const });
	}

	return ok({
		lobby: lobbies[0].Lobby,
		players: lobbies.map((lobby) => lobby.participant).filter(Boolean),
	});
}

async function getLobby({ userId, id }: { userId?: string; id?: string }) {
	let query = db
		.select({
			Lobby,
			participant: {
				userId: LobbyParticipant.userId,
				userName: User.userName,
				joinedAt: LobbyParticipant.joinedAt,
				owner: LobbyParticipant.owner,
			},
		})
		.from(Lobby)
		.leftJoin(LobbyParticipant, eq(LobbyParticipant.lobbyCode, Lobby.code))
		.leftJoin(User, eq(User.id, LobbyParticipant.userId));

	const conditions = [];

	if (userId != null) {
		query = query.leftJoin(partAgain, eq(partAgain.lobbyCode, Lobby.code));
		conditions.push(eq(partAgain.userId, userId));
	}
	if (id != null) {
		conditions.push(eq(Lobby.code, id));
	}

	return query.where(and(...conditions));
}
