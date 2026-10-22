import type { BetterAuthClientPlugin } from 'better-auth/client';
import type { memeApi } from './meme-api.ts';

export const memeApiClient = () =>
	({
		id: 'meme-api',
		$InferServerPlugin: {} as ReturnType<typeof memeApi>,
	}) satisfies BetterAuthClientPlugin;
