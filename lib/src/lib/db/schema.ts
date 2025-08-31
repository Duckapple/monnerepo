import {
	type PgColumn,
	char,
	index,
	json,
	pgTable,
	text,
	varchar,
	uuid
} from 'drizzle-orm/pg-core';

export function indicesOn<T extends string>(tableName: string, ...keys: T[]) {
	return (table: { [P in T]: PgColumn }) => keys.map((key) => index(key + 'Index').on(table[key]));
}

export const User = pgTable('User', {
	id: uuid('id').primaryKey().defaultRandom(),
	bcrypt: char('bcrypt', { length: 60 }).notNull(),
	userName: varchar('userName', { length: 64 }).notNull().unique()
});

export type User = typeof User.$inferSelect;

export const Push = pgTable(
	'Push',
	{
		userId: uuid('userId').notNull(),
		keys: json('keys').notNull().$type<{ p256dh: string; auth: string }>(),
		endpoint: text('endpoint').notNull()
	},
	(table) => [index('PushUserIdIndex').on(table.userId)]
);

export type Push = typeof Push.$inferSelect;
