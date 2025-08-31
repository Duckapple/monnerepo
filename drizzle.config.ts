import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './.drizzle/scripts/schema.ts',
	out: './.drizzle/migration',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	}
});
