import * as Bun from 'bun';
import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../lib/db/db.server.ts';
import { AUTH_PORT, AUTH_ORIGIN } from '$env/static/public';
import { env } from '$env/dynamic/private';

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
	advanced: {
		database: { generateId: 'uuid' },
		crossSubDomainCookies: import.meta.env.DEV
			? undefined
			: {
					enabled: true,
					domain: `.${env.PARENT_ORIGIN}`,
				},
	},
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		},
	},
	plugins: [
		username({
			schema: { user: { modelName: 'User', fields: { username: 'userName' } } },
			maxUsernameLength: 64,
			usernameValidator: (username) => {
				const usernameRegex = /^[a-zA-Z0-9_ -]+$/;
				return usernameRegex.test(username);
			},
		}),
		// Other plugins go above...
		sveltekitCookies(getRequestEvent),
	],
	baseURL: import.meta.env.DEV ? `http://localhost:${AUTH_PORT}` : AUTH_ORIGIN,
	logger: {
		level: 'debug',
		log: console.log,
	},
	emailAndPassword: {
		enabled: true,
		password: {
			hash: (password: string) => Bun.password.hash(password, { algorithm: 'bcrypt', cost: 12 }),
			verify: async ({ password, hash }) => Bun.password.verifySync(password, hash),
		},
	},
});
