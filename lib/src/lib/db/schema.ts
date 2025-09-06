import {
	char,
	index,
	json,
	pgTable,
	text,
	varchar,
	uuid,
	pgEnum,
	timestamp,
	boolean,
	foreignKey,
} from 'drizzle-orm/pg-core';

// #region User

export const User = pgTable('User', {
	id: uuid('id').primaryKey().defaultRandom(),
	bcrypt: char('bcrypt', { length: 60 }).notNull(),
	userName: varchar('userName', { length: 64 }).notNull().unique(),
});

export type User = typeof User.$inferSelect;

// #region Push

export const Push = pgTable(
	'Push',
	{
		userId: uuid('userId').notNull(),
		keys: json('keys').notNull().$type<{ p256dh: string; auth: string }>(),
		endpoint: text('endpoint').notNull(),
	},
	(table) => [index('PushUserIdIndex').on(table.userId)]
);

export type Push = typeof Push.$inferSelect;

// #region GameType

export const GameType = pgEnum('GameType', ['splendor']);

export type GameType = (typeof GameType.enumValues)[number];

// #region Lobby

export const Lobby = pgTable('Lobby', {
	code: varchar('code', { length: 6 }).notNull().unique(),
	gameType: GameType('gameType').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export type Lobby = typeof Lobby.$inferSelect;

// #region LobbyParticipant

export const LobbyParticipant = pgTable(
	'LobbyParticipant',
	{
		lobbyCode: varchar('code', { length: 6 }).notNull(),
		userId: uuid('userId').notNull(),
		joinedAt: timestamp('joinedAt').notNull().defaultNow(),
		owner: boolean('owner').notNull().default(false),
	},
	(table) => [
		foreignKey({ columns: [table.lobbyCode], foreignColumns: [Lobby.code] }).onDelete('cascade'),
	]
);

export type LobbyParticipant = typeof LobbyParticipant.$inferSelect;

// #region
