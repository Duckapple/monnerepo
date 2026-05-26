import { drizzle } from '@sgk/lib/db';
import * as schema from '$lib/db/schema';

export const db = drizzle(schema);
