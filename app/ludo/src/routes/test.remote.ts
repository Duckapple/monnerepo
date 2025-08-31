import { query } from '$app/server';
import { db } from '$lib/db/db.server.ts';

export const getUsers = query(async () => {
	return db.selectFrom('User').select(['userName']).limit(1).execute();
});
