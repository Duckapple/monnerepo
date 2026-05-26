import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getRequestEvent } from '$app/server';
import { db } from './common/db';

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg' }),
	user: {
		modelName: 'User',
		fields: { name: 'userName' },
	},
	session: { modelName: 'Session' },
	plugins: [
		username({
			schema: { user: { modelName: 'User', fields: { username: 'userName' } } },
			maxUsernameLength: 64,
		}),
		// Other plugins go above...
		sveltekitCookies(getRequestEvent),
	],
	// baseURL: import.meta.env.DEV ? `http://localhost:${AUTH_PORT}` : AUTH_ORIGIN,
	logger: {
		level: 'debug',
		log: console.log,
	},
	emailAndPassword: { enabled: true },
});
