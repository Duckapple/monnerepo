import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { env } from '$env/dynamic/private';

import { neon } from '@neondatabase/serverless';
import * as d from 'drizzle-orm/neon-http';

import * as schema from './schema.ts';

export function createDb<T>() {
	const dialect = new PostgresDialect({
		pool: new Pool({
			connectionString: env.DATABASE_URL,
			max: 10,
		}),
	});
	return new Kysely<T>({
		dialect,
	});
}
export function drizzle<T extends Record<string, unknown> | undefined>(schemaAdditions: T) {
	const connection = neon(env.DATABASE_URL);

	return d.drizzle(connection, { schema: { ...schema, ...schemaAdditions } });
}
