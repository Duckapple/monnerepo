import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/db.server.ts';
import { AUTH_PORT, AUTH_ORIGIN } from '$env/static/public';

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg' }),
	user: {
		modelName: 'User',
		fields: { name: 'userName' },
	},
	session: { modelName: 'Session' },
	account: {
		modelName: 'Account',
		accountLinking: { trustedProviders: ['discord'] },
	},
	verification: { modelName: 'Verification' },
	advanced: { database: { generateId: 'uuid' } },
	socialProviders: {
		discord: {
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
		},
	},
	plugins: [
		username({
			schema: { user: { modelName: 'User', fields: { username: 'userName' } } },
			maxUsernameLength: 64,
		}),
		sveltekitCookies(getRequestEvent),
	],
	baseURL: import.meta.env.DEV ? `http://localhost:${AUTH_PORT}` : AUTH_ORIGIN,
	logger: {
		level: 'debug',
		log: console.log,
	},
});
