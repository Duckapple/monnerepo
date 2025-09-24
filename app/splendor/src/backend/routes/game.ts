import { and, eq } from 'drizzle-orm';
import { SplendorGame, SplendorGamePlayer } from '../../lib/db/schema';
import { db } from '../common/db';
import { FunctionError } from '../common/auth';
import type { AuthUser, GameAndPlayers } from '$common/communication';
import { newGameState } from '$common/defaults';
import { mapValues } from '$common/utils';
import { websocketCache } from '$backend/wss';
import { Lobby, LobbyParticipant, User } from '@sgk/lib/db';
import { alias } from 'drizzle-orm/pg-core';

const participantAgain = alias(LobbyParticipant, 'part2');

export async function post(user: AuthUser, code: string) {
	if (typeof code !== 'string') throw new FunctionError(400, { message: 'Bad room ID' });

	const roomPlayers = await db
		.select()
		.from(Lobby)
		.leftJoin(LobbyParticipant, eq(Lobby.code, LobbyParticipant.lobbyCode))
		.innerJoin(
			participantAgain,
			and(eq(Lobby.code, participantAgain.lobbyCode), eq(participantAgain.userId, user.id))
		)
		.where(
			and(
				eq(Lobby.code, code),
				eq(Lobby.gameType, 'splendor'),
				eq(participantAgain.owner, true),
				eq(participantAgain.userId, user.id)
			)
		);

	if (roomPlayers == null) throw new FunctionError(400, { message: 'Bad Request' });

	if (roomPlayers.length < 2)
		throw new FunctionError(400, { message: 'Cannot start game with only 1 player' });

	const newId = crypto.randomUUID();
	const game = newGameState(newId, roomPlayers.length as 2 | 3 | 4);
	const players = roomPlayers.map(({ LobbyParticipant }) => LobbyParticipant).filter(Boolean);

	await Promise.all([
		db.insert(SplendorGame).values(game),
		db.insert(SplendorGamePlayer).values(
			players.map((p) => ({
				gameId: newId,
				userId: p.userId,
				position: (p.order ?? 0) as SplendorGamePlayer['position'],
				owner: p.owner,
			}))
		),
		db.delete(Lobby).where(eq(Lobby.code, code)),
		db.delete(LobbyParticipant).where(eq(LobbyParticipant.lobbyCode, code)),
	]);

	for (const participant of players.filter((participant) => participant?.userId !== user.id)) {
		websocketCache[participant.userId]?.({ type: 'game-started', id: code });
	}

	return game;
}

export async function get(user: AuthUser, id: string) {
	if (typeof id !== 'string') throw new FunctionError(400, { message: 'Bad game ID' });

	const result = await db
		.select({ game: SplendorGame, player: SplendorGamePlayer, userName: User.userName })
		.from(SplendorGame)
		.innerJoin(SplendorGamePlayer, eq(SplendorGamePlayer.gameId, SplendorGame.id))
		.innerJoin(User, eq(User.id, SplendorGamePlayer.userId))
		.where(eq(SplendorGame.id, id))
		.orderBy(SplendorGamePlayer.position);

	if (result.length === 0) throw new FunctionError(404, { message: 'Game not found' });

	if (!result.some(({ player }) => player?.userId === user.id))
		throw new FunctionError(403, { message: 'Forbidden' });

	const piles = mapValues(result[0].game.piles, ({ length }) => ({ length }) as number[]);

	const game: GameAndPlayers = {
		...result[0].game,
		piles,
		players: result.map(({ player, userName }) => ({
			...player,
			userName,
		})),
	};

	return game;
}
