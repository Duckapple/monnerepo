import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { env } from '$env/dynamic/private';

export function createDb<T>() {
	const dialect = new PostgresDialect({
		pool: new Pool({
			connectionString: env.DATABASE_URL,
			max: 10
		})
	});
	return new Kysely<T>({
		dialect
	});
}
