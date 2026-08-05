import type { SplendorGamePlayer, SplendorGame } from '../lib/db/schema';
export type AuthUser = {
	id: string;
	userName: string;
};

const NONE = Symbol();

export type NONE = typeof NONE;

type SplendorGameIsh = Omit<SplendorGame, 'createdAt' | 'updatedAt'> & {
	createdAt?: Date;
	updatedAt?: Date;
};

export type GameAndPlayers = SplendorGameIsh & {
	players: (SplendorGamePlayer & { userName: string })[];
};
