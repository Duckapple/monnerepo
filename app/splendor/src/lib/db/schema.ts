import { boolean, timestamp, json, pgEnum, pgTable, smallint, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

type TokenHold = [number, number, number, number, number, number];
interface IdDecks {
	high: number[];
	middle: number[];
	low: number[];
	persons: number[];
}
type GamePhase = 0 | 1 | 2 | 3;

export const SplendorRoom = pgTable('SplendorRoom', {
	id: uuid('id').primaryKey().defaultRandom(),
	ownerId: uuid('ownerId').notNull(),
	started: boolean('started').default(false),
	ended: boolean('ended').default(false),
	createdAt: timestamp('createdAt', { precision: 0 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 0 }).notNull().defaultNow()
});

export type SplendorRoom = typeof SplendorRoom.$inferSelect;

// prettier-ignore
export const SplendorGamePlayer = pgTable("SplendorGamePlayer", {
  userId: uuid("userId").notNull(),
  gameId: uuid("gameId").notNull(),
  position: smallint("position").notNull().$type<0 | 1 | 2 | 3>(),
	reserved: json("reserved").notNull().default(sql`('[]')`).$type<number[]>(),
  cards: json("cards").notNull().default(sql`('[]')`).$type<number[]>(),
  tokens: json("tokens").notNull().default(sql`('[0,0,0,0,0,0]')`).$type<TokenHold>(),
});
export type SplendorGamePlayer = typeof SplendorGamePlayer.$inferSelect;

// prettier-ignore
export const SplendorGame = pgTable("SplendorGame", {
  id: uuid("id").primaryKey(),
  shown: json("shown").default(sql`('{"high":[],"middle":[],"low":[],"persons":[]}')`).notNull().$type<IdDecks>(),
  piles: json("piles").default(sql`('{"high":[],"middle":[],"low":[],"persons":[]}')`).notNull().$type<IdDecks>(),
  tokens: json("tokens").default(sql`('[0,0,0,0,0,0]')`).notNull().$type<TokenHold>(),
  turn: smallint("turn").notNull().default(0).$type<0 | 1 | 2 | 3>(),
  playerCount: smallint("playerCount").notNull().$type<1 | 2 | 3 | 4>(),
	phase: smallint("phase").notNull().default(0).$type<GamePhase>(),
});
export type SplendorGame = typeof SplendorGame.$inferSelect;

export const SplendorGameSelect = {
	id: SplendorGame.id,
	shown: SplendorGame.shown,
	tokens: SplendorGame.tokens,
	turn: SplendorGame.turn,
	playerCount: SplendorGame.playerCount,
	phase: SplendorGame.phase
};
export type SplendorGameSelect = typeof SplendorGameSelect;

const splendorActions = ['BUY_CARD', 'TAKE_PERSON', 'TAKE_TOKENS', 'RESERVE'] as const;
export const SplendorActionType = pgEnum('SplendorActionType', splendorActions);
export type SplendorActionType = (typeof splendorActions)[number];

export const SplendorAction = pgTable('SplendorAction', {
	gameId: uuid('gameId').notNull(),
	userId: uuid('userId').notNull(),
	timestamp: timestamp('timestamp', { precision: 0 }).notNull().defaultNow(),
	type: SplendorActionType('type').notNull(),
	data: json('data').notNull()
});

export type SplendorAction = typeof SplendorAction.$inferSelect;
