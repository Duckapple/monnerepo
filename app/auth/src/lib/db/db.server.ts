import { drizzle } from '@sgk/lib/db';
import * as schema from './schema.ts';

export const db = drizzle(schema);
