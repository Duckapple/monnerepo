import { query } from '$app/server';
import { readdir } from 'fs/promises';

export const getFs = query(async () => {
	const files = await readdir('.');
	return files;
});
