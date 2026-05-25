import { User } from '@sgk/lib/db';
import * as d from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';

export const Session = d.pgTable('Session', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: d
		.uuid('user_id')
		.notNull()
		.references(() => User.id, { onDelete: 'cascade' }),
	token: d.varchar('token', { length: 255 }).notNull().unique(),
	expiresAt: d.timestamp('expires_at', { precision: 6, withTimezone: true }).notNull(),
	ipAddress: d.text('ip_address'),
	userAgent: d.text('user_agent'),
	createdAt: d.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
	updatedAt: d.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});

export const Account = d.pgTable('Account', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: d
		.uuid('user_id')
		.notNull()
		.references(() => User.id, { onDelete: 'cascade' }),
	accountId: d.text('account_id').notNull(),
	providerId: d.text('provider_id').notNull().$type<'discord' | 'meme-api'>(),
	accessToken: d.text('access_token'),
	refreshToken: d.text('refresh_token'),
	accessTokenExpiresAt: d.timestamp('access_token_expires_at', {
		precision: 6,
		withTimezone: true,
	}),
	refreshTokenExpiresAt: d.timestamp('refresh_token_expires_at', {
		precision: 6,
		withTimezone: true,
	}),
	scope: d.text('scope'),
	idToken: d.text('id_token'),
	password: d.text('password'),
	createdAt: d.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
	updatedAt: d.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});

export const verification = d.pgTable('Verification', {
	id: uuid('id').primaryKey().defaultRandom(),
	identifier: d.text('identifier').notNull(),
	value: d.text('value').notNull(),
	expiresAt: d.timestamp('expires_at', { precision: 6, withTimezone: true }).notNull(),
	createdAt: d.timestamp('created_at', { precision: 6, withTimezone: true }).notNull(),
	updatedAt: d.timestamp('updated_at', { precision: 6, withTimezone: true }).notNull(),
});
