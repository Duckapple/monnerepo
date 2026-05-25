import { createDb, drizzle, User } from '@sgk/lib/db';
import type { Kyselify } from 'drizzle-orm/kysely';
import * as schema from './schema.ts';

// interface Database {
// 	User: Kyselify<typeof User>;
// }

export const db = drizzle(schema);
