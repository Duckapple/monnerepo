import { createDb, User } from '@sgk/lib/db';
import type { Kyselify } from 'drizzle-orm/kysely';
import {} from './schema.ts';

interface Database {
	User: Kyselify<typeof User>;
}

export const db = createDb<Database>();
