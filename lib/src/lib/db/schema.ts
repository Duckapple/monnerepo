import * as d from 'drizzle-orm/pg-core';

// #region User

export const User = d.pgTable('User', {
	id: d.uuid('id').primaryKey().defaultRandom(),
	bcrypt: d.char('bcrypt', { length: 60 }).notNull(),
	userName: d.varchar('userName', { length: 64 }).notNull().unique(),

	// BetterAuth
	email: d.varchar('email', { length: 255 }).notNull().unique(),
	emailVerified: d.boolean('email_verified').notNull().default(false),
	image: d.text('image'),
	createdAt: d.timestamp('created_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),
	updatedAt: d.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),

	// BetterAuth Username Plugin
	displayUsername: d.varchar('display_username', { length: 64 }),
});

export type User = typeof User.$inferSelect;

// #region Push

export const Push = d.pgTable(
	'Push',
	{
		userId: d.uuid('userId').notNull(),
		keys: d.json('keys').notNull().$type<{ p256dh: string; auth: string }>(),
		endpoint: d.text('endpoint').notNull(),
	},
	(table) => [d.index('PushUserIdIndex').on(table.userId)]
);

export type Push = typeof Push.$inferSelect;

// #region GameType

export const GameType = d.pgEnum('GameType', ['splendor']);

export type GameType = (typeof GameType.enumValues)[number];

// #region Lobby

export const Lobby = d.pgTable('Lobby', {
	code: d.varchar('code', { length: 6 }).notNull().unique(),
	gameType: GameType('gameType').notNull(),
	createdAt: d.timestamp('createdAt').notNull().defaultNow(),
});

export type Lobby = typeof Lobby.$inferSelect;

// #region LobbyParticipant

export const LobbyParticipant = d.pgTable(
	'LobbyParticipant',
	{
		lobbyCode: d.varchar('code', { length: 6 }).notNull(),
		userId: d.uuid('userId').notNull(),
		joinedAt: d.timestamp('joinedAt').notNull().defaultNow(),
		owner: d.boolean('owner').notNull().default(false),
		order: d.integer('order'),
	},
	(table) => [
		d.foreignKey({ columns: [table.lobbyCode], foreignColumns: [Lobby.code] }).onDelete('cascade'),
	]
);

export type LobbyParticipant = typeof LobbyParticipant.$inferSelect;

// #region
