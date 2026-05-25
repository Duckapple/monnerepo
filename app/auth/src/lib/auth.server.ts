import { betterAuth } from 'better-auth';
import { username } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/db.server.ts';

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: 'pg' }),
	user: {
		modelName: 'User',
		fields: { name: 'userName' },
	},
	session: { modelName: 'Session' },
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
	],
});
